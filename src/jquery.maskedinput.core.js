'use strict';

import $ from 'jquery';

/** CORE_BEGIN */

/**
 * @typedef {String} MaskedInput~PartType
 * @name MaskedInput~PartType
 * @enum {String}
 */
const PartType = {
    /** @const */ NUMBER: 'number',
    /** @const */ TEXT: 'text',
    /** @const */ LABEL: 'label'
};

/**
 * @typedef {Object} MaskedInput~Part
 * @property {MaskedInput~PartType} [type] - Type of the field
 * @property {String|undefined} [name] - Name for this field
 * @property {String|undefined} [ariaLabel] - An ARIA accessibility label
 * @property {String|undefined} [text] - Text for this field if it's a LABEL
 * @property {String|undefined} [placeholder] - Placeholder for the field
 * @property {Number} [length] - Length of the field
 * @property {Number} [maxLength] - Maximum length of the field
 * @property {Number|undefined} [numericMin] - Minimum numeric value
 * @property {Number|undefined} [numericMax] - Maximum numeric value
 * @property {Boolean|undefined} [wholeNumber] - Force the number to be whole? (default `false`)
 * @property {RegExp|String|function(value:String)|undefined} [validator] - Validator regex or function
 * @property {String[]|undefined} [options] - Options to choose from for textual field
 * @property {function(value,part:MaskedInput~Part)|undefined} [postProcess] - Function for post processing a value before retrieving by user
 * @property {Boolean|Number|undefined} [padding] - Enable padding in value result (default `true`)
 * @property {Boolean|undefined} [required] - Is the field required (default `true`)
 * @property {String|undefined} [defaultValue] - Default value, used if field is not `required`
 * @property {Boolean|undefined} [forcePlaceholderWidth] - Always consider placeholder's width (default `true`)
 */

/**
 * @typedef {Object} MaskedInput~Pattern
 * @property {RegExp|String} [pattern] - Pattern to recognize in the format
 * @property {MaskedInput~PartType} [type] - Type of the field
 * @property {String|undefined} [name] - Name for this field
 * @property {String|undefined} [ariaLabel] - An ARIA accessibility label
 * @property {String|function(match):String|undefined} [text] - Text for this field if it's a LABEL
 * @property {String|function(match):String|undefined} [placeholder] - Placeholder for the field
 * @property {Number|function(match):Number} [length] - Length of the field
 * @property {Number|function(match):Number} [maxLength] - Maximum length of the field
 * @property {Number|function(match):Number|undefined} [numericMin] - Minimum numeric value
 * @property {Number|function(match):Number|undefined} [numericMax] - Maximum numeric value
 * @property {Boolean|undefined} [wholeNumber] - Force the number to be whole? (default `false`)
 * @property {RegExp|String|function(value:String)|undefined} [validator] - Validator regex or function
 * @property {String[]|function(match):String[]|undefined} [options] - Options to choose from for textual field
 * @property {function(value,part:MaskedInput~Part)|undefined} [postProcess] - Function for post processing a value before retrieving by user
 * @property {Boolean|Number|function(match):(Boolean|Number)|undefined} [padding] - Enable padding in value result (default `true`)
 * @property {Boolean|function(match):Boolean|undefined} [required] - Is the field required (default `true`)
 * @property {String|function(match):String|undefined} [defaultValue] - Default value, used if field is not `required`
 * @property {Boolean|function(match):Boolean|undefined} [forcePlaceholderWidth] - Always consider placeholder's width (default `true`)
 */

/**
 * @typedef {Object} MaskedInput~Options
 * @property {String} [format] - Format to show
 * @property {Object<String, MaskedInput~Pattern>} [patterns] - Additional patterns to recognize in the format
 */
const defaults = /** @type {MaskedInput.Options} */ {
    patterns: {}
};

const execRegexWithLeftovers = function (regex, input, onMatch, onLeftover) {

    let match, lastIndex = 0;
    regex.lastIndex = 0;
    while ((match = regex.exec(input))) {

        // Add skipped raw text
        if (match.index > lastIndex) {
            onLeftover(input.substring(lastIndex, match.index));
        }

        onMatch(match);

        lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (input.length > lastIndex) {
        onLeftover(input.substring(lastIndex, input.length));
    }

};

/**
 * Get the selection range in an element
 * @param {HTMLInputElement} el
 * @returns {{begin: Number, end: Number, direction: 'forward'|'backward'|'none'|undefined}}
 */
const getSelectionRange = function (el) {
    let begin, end, direction = 'none';

    if (el.setSelectionRange) {

        begin = el.selectionStart;
        end = el.selectionEnd;
        direction = el.selectionDirection;

    } else if (document.selection && document.selection.createRange) {

        const range = document.selection.createRange();
        begin = 0 - range.duplicate().moveStart('character', -10000);
        end = begin + range.text.length;
    }

    return {
        begin : begin,
        end : end,
        direction: direction
    }
};

/**
 * Set the selection range in an element
 * @param {HTMLInputElement} el
 * @param {Number|{begin: Number, end: Number, direction: 'forward'|'backward'|'none'|undefined}} begin
 * @param {Number?} end
 * @param {('forward'|'backward'|'none')?} direction
 */
const setSelectionRange = function (el, begin, end, direction) {

    if (typeof arguments[1] === 'object' && 'begin' in arguments[1]) {
        begin = arguments[1].begin;
        end = arguments[1].end;
        direction = arguments[1].direction;
    }

    if (direction === undefined) {
        if (typeof arguments[2] === 'string' &&
            (arguments[2] === 'forward' || arguments[2] === 'backward' || arguments[2] === 'none')) {
            direction = arguments[2];
            end = null;
        }
    }

    end = end == null ? begin : end;

    if (el.setSelectionRange) {
        el.setSelectionRange(begin, end, direction);

    } else {
        if (el.createTextRange) {
            const range = el.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', begin);
            range.select();
        }
    }

};

const repeatChar = function (char, length) {
    let out = '';
    for (let i = 0; i < length; i++) {
        out += char;
    }
    return out;
};

/**
 * @param {String[]} options
 * @param {String} term
 * @param {Boolean?} closestChoice
 * @param {Boolean?} returnFullMatch
 * @param {Boolean?} caseSensitive
 * @returns {String|undefined}
 */
const findMatchInArray = function (options, term, closestChoice, returnFullMatch, caseSensitive) {

    let i, option, optionLower;
    const termLower = caseSensitive ? term : term.toLowerCase();

    if (closestChoice) {
        // Search for a partial option or partial content match, return the longest match found, or `false`

        let maxMatchLength = 0;
        let maxMatchOption;
        let maxMatchFullOption;

        for (i = 0; i < options.length; i++) {
            option = options[i];
            optionLower = caseSensitive ? option : option.toLowerCase();

            for (let clen = Math.min(option.length, 1); clen <= term.length; clen++) {
                if (option.length >= clen &&
                    optionLower.substr(0, clen) === termLower.substr(0, clen)) {
                    if (clen > maxMatchLength) {
                        maxMatchLength = clen;
                        maxMatchOption = option.substr(0, clen);
                        maxMatchFullOption = option;
                    }
                } else {
                    break;
                }
            }
        }

        return returnFullMatch ? maxMatchFullOption : maxMatchOption;

    } else {

        // Search for an exact match or option "starts with" the content - all case insensitive
        for (i = 0; i < options.length; i++) {
            option = options[i];
            optionLower = caseSensitive ? option : option.toLowerCase();

            if (option.length >= term.length &&
                optionLower.substr(0, term.length) === termLower)
                return returnFullMatch ? option : true;
        }
    }
};

/**
 * Regex escape
 * @param {String} str
 * @returns {XML|void|string}
 */
const escapeRegExp = function (str) {
    return str.replace(/[\-\[\]\/{}()*+?.\\\^$|]/g, '\\$&');
};
/**
 * Search for closest element to a specified point
 * @param {HTMLElement[]} elements
 * @param {{left: Number, top: Number }} offset
 * @returns {HTMLElement|null}
 */
const closestToOffset = function (elements, offset) {
    const x = offset.left,
        y = offset.top;
    let bestMatch = null,
        minDistance = null;

    for (let i = 0; i < elements.length; i++) {
        const el = elements[i], $el = $(el);
        const elOffset = $el.offset();

        elOffset.right = elOffset.left + $el.outerWidth();
        elOffset.bottom = elOffset.top + $el.outerHeight();

        if (
            (x >= elOffset.left) && (x <= elOffset.right) &&
            (y >= elOffset.top) && (y <= elOffset.bottom)
        ) {
            return el;
        }

        const offsets = [
            [elOffset.left, elOffset.top],
            [elOffset.right, elOffset.top],
            [elOffset.left, elOffset.bottom],
            [elOffset.right, elOffset.bottom]
        ];

        for (let o = 0; o < 4; o++) {
            const offset = offsets[o];
            const dx = offset[0] - x;
            const dy = offset[1] - y;
            const distance = Math.sqrt((dx * dx) + (dy * dy));

            if (minDistance == null || distance < minDistance) {
                minDistance = distance;
                bestMatch = el;
            }
        }
    }

    return bestMatch;
};

const callFunctor = function (functor, bind, arg1) {
    return (typeof functor === 'function') ?
        functor.apply(bind, Array.prototype.slice.call(arguments, 2)) :
        functor;
};

const inputBackbufferCssProps = [
    'font-family',
    'font-size',
    'font-weight',
    'font-size',
    'letter-spacing',
    'text-transform',
    'word-spacing',
    'text-indent',
    'box-sizing',
    'padding-left',
    'padding-right'
];

const hasComputedStyle = document.defaultView && document.defaultView.getComputedStyle;

/**
 * Gets the precise content width for an element, with fractions
 * @param {Element} el
 * @returns {Number}
 */
const getPreciseContentWidth = function (el) {

    const style = hasComputedStyle ? document.defaultView.getComputedStyle(el) : el.currentStyle;
    let width = parseFloat(style['width']) || 0;

    if (style['boxSizing'] === 'border-box') {
        width -= parseFloat(style['paddingLeft']) || 0;
        width -= parseFloat(style['paddingRight']) || 0;
        width -= parseFloat(style['borderLeftWidth']) || 0;
        width -= parseFloat(style['borderRightWidth']) || 0;

        if (width < 0) {
            width = 0;
        }
    }

    return width;
};

const FOCUSABLES = [
    'a[href]',
    'area[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    'object',
    'embed',
    '*[tabindex]',
    '*[contenteditable]'
];

const FOCUSABLE_SELECTOR = FOCUSABLES.join(',');
const TABBABLE_SELECTOR = FOCUSABLES.map(x => x + ':not([tabindex=-1])').join(',');

const KEY_ENTER = 13;
const KEY_ARROW_UP = 38;
const KEY_ARROW_DOWN = 40;
const KEY_ARROW_LEFT = 37;
const KEY_ARROW_RIGHT = 39;

/** @class MaskedInput */
class MaskedInput {
    /**
     * @param {MaskedInput.Options?} options
     * @returns {MaskedInput}
     */
    constructor(options) {
        /** @private */
        const o = this.o = $.extend({}, MaskedInput.defaults, options);

        let patterns = {};
        MaskedInput.patternAddons.forEach(addon => {
            patterns = $.extend(patterns, addon);
        });
        patterns = $.extend(patterns, o.patterns);
        o.patterns = patterns;

        /** This is for encapsulating private data */
        const p = this.p = {};

        p.enabled = true;
        p.inputs = [];

        /** @public */
        const $el = this.$el = $('<div>').addClass(o.className || 'masked-input');

        /** @public */
        this.el = this.$el[0];

        // Set control data
        $el
            .data('control', this)
            .data('maskedinput', this);

        // Parse format
        p.parsed = this._parseFormat(o.format);

        // Create backbuffer for input
        p.$inputBackBuffer = $('<span aria-hidden="true" style="position:absolute;z-index:-1;left:0;top:-9999px;white-space:pre;"/>');

        // Hook up click event
        $el.on('click', event => {
            if (event.target !== event.currentTarget &&
                $(event.target).is(FOCUSABLE_SELECTOR)) return;

            const offset = $(event.currentTarget).offset();
            offset.left += event.offsetX;
            offset.top += event.offsetY;

            const el = closestToOffset($el.children(FOCUSABLE_SELECTOR), offset);

            if (el) {
                el.focus();
            }
        });

        this.render();

        setTimeout(() => {
            if (this.el && this.el.parentNode) {
                this.resize();
            }
        }, 0);

        return this;
    }

    /**
     *
     * @private
     * @param format
     * @returns {MaskedInput~Part[]}
     */
    _parseFormat(format) {
        const o = this.o;

        let parsedFormat = [];

        // Loop through basic format matches

        execRegexWithLeftovers(FORMAT_REGEX, format, (function onMatch(match) {

            const numericMatch = match[1] || match[2];
            const textMatch = match[3];
            const quotedMatch = match[4];

            let i, part;

            if (numericMatch) {
                part = { type: PartType.NUMBER };
                i = numericMatch.indexOf(':');

                if (i > -1) {
                    part.length = i;
                    part.name = numericMatch.substr(i + 1);
                } else {
                    part.length = numericMatch.length;
                }

                if (match[2]) { // max length
                    part.maxLength = part.length;
                    part.length = 0;
                }

                parsedFormat.push(part);
            } else if (textMatch) {
                part = { type: PartType.TEXT };
                if (textMatch[0] === '*') {
                    part.length = 0;
                } else {
                    i = textMatch.indexOf(':');

                    if (i > -1) {
                        part.length = i;
                        part.name = textMatch.substr(i + 1);
                    } else {
                        part.length = textMatch.length;
                    }
                }
                parsedFormat.push(part);
            } else if (quotedMatch) {
                const labelText = quotedMatch.substr(1, quotedMatch.length - 2);
                part = {
                    type: PartType.LABEL,
                    text: labelText,
                    length: labelText.length
                };
                parsedFormat.push(part);
            }

        }).bind(this), (function onLeftover(leftover) {

            const leftoverParts = [];

            const part = {
                type: PartType.LABEL,
                text: leftover,
                length: leftover.length
            };
            leftoverParts.push(part);

            Object.keys(o.patterns).forEach(key => {
                const patterns = o.patterns[key];

                const regex = new RegExp(
                    patterns.pattern instanceof RegExp ?
                        patterns.pattern.source :
                        patterns.pattern,
                    patterns.pattern instanceof RegExp ?
                        (patterns.pattern.flags + (patterns.pattern.flags.indexOf('g') > -1 ? '' : 'g')) :
                        'g'
                );

                for (let fpos = 0; fpos < leftoverParts.length; fpos++) {
                    const fpart = leftoverParts[fpos];
                    if (fpart.type !== PartType.LABEL) continue;

                    const newParts = [];

                    execRegexWithLeftovers(regex, fpart.text, (function onMatch(match) {

                        let validator;
                        if (patterns.validator instanceof RegExp || typeof patterns.validator === 'function') {
                            validator = patterns.validator;
                        } else if (typeof patterns.validator === 'string') {
                            try {
                                validator = new RegExp(patterns.validator);
                            } catch (e) { }
                        }

                        // Translate the part
                        const part = {
                            type: callFunctor(patterns.type, this, match[0]),
                            name: callFunctor(patterns.name, this, match[0]),
                            ariaLabel: callFunctor(patterns.ariaLabel, this, match[0]),
                            text: callFunctor(patterns.text, this, match[0]),
                            placeholder: callFunctor(patterns.placeholder, this, match[0]),
                            length: callFunctor(patterns.length, this, match[0]) || 0,
                            maxLength: callFunctor(patterns.maxLength, this, match[0]) || 0,
                            numericMin: callFunctor(patterns.numericMin, this, match[0]),
                            numericMax: callFunctor(patterns.numericMax, this, match[0]),
                            wholeNumber: callFunctor(patterns.wholeNumber, this, match[0]),
                            validator: validator,
                            options: callFunctor(patterns.options, this, match[0]),
                            postProcess: patterns.postProcess,
                            padding: callFunctor(patterns.padding, this, match[0]),
                            required: callFunctor(patterns.required, this, match[0]),
                            defaultValue: callFunctor(patterns.defaultValue, this, match[0]),
                            forcePlaceholderWidth: callFunctor(patterns.forcePlaceholderWidth, this, match[0])
                        };
                        //noinspection JSReferencingMutableVariableFromClosure
                        newParts.push(part);

                    }).bind(this), (function onLeftover(leftover) {
                        const part = {
                            type: PartType.LABEL,
                            text: leftover,
                            length: leftover.length
                        };
                        //noinspection JSReferencingMutableVariableFromClosure
                        newParts.push(part);
                    }).bind(this));

                    // Replace old label with new parts
                    Array.prototype.splice.apply(leftoverParts, [fpos, 1].concat(newParts));

                    // Move leftoverParts position as necessary
                    fpos += newParts.length - 1;
                }

            });

            parsedFormat = parsedFormat.concat(leftoverParts);
        }).bind(this));

        return parsedFormat;
    }

    render() {
        const p = this.p;

        this.$el.empty();

        const inputs = [];

        p.parsed.forEach(part => {
            if (part.type === PartType.LABEL) {
                const $el = this._renderText(part).appendTo(this.$el);
                part.$el = $el;
                part.el = $el[0];
                return;
            }

            const $input = this._renderInput(part).appendTo(this.$el);

            part.$el = $input;
            part.el = $input[0];

            inputs.push($input);

            if (part.name && parseInt(part.name, 10).toString() !== part.name) {
                inputs[part.name] = (inputs[part.name] || []).concat(part.el);
            }
        });

        p.inputs = inputs;

        this.resize();

        return this;
    }

    /**
     *
     * @private
     * @param {MaskedInput~Part} part
     * @param {HTMLInputElement?} input
     * @returns {jQuery}
     */
    _renderInput(part, input) {
        const p = this.p;

        const isNewInput = !input;

        let $input;

        if (isNewInput) {
            $input = $('<input>').data('part', part).prop('disabled', !p.enabled);
            input = $input[0];
        } else {
            $input = $(input);
        }

        if (part.name) {
            input.setAttribute('data-name', part.name);
        } else {
            input.removeAttribute('data-name');
        }

        if (part.ariaLabel) {
            input.setAttribute('aria-label', part.ariaLabel);
        } else {
            input.removeAttribute('aria-label');
        }

        if (part.length || part.maxLength || typeof part.placeholder === 'string') {
            //noinspection UnnecessaryLocalVariableJS
            const placeholder = typeof part.placeholder === 'string'
                ? part.placeholder
                : (part.placeholder === undefined || part.placeholder) ? repeatChar('_', part.length || part.maxLength) : '';
            input.placeholder = placeholder;
        }

        if (isNewInput) {
            $input
                .on('input.maskedinput', event => {
                    this._handleInput(event, input, part);
                    this._syncInputSizeForPart(part);
                })
                .on('keydown.maskedinput', event => {
                    this._handleKeydown(event, input, part);
                })
                .on('keypress.maskedinput', event => {
                    this._handleKeypress(event, input, part);
                });
        }

        return $input;
    }

    /**
     *
     * @private
     * @param {MaskedInput~Part} part
     * @returns {jQuery}
     */
    _renderText(part) {
        return $('<span style="white-space: pre">').text(part.text);
    }

    /**
     *
     * @private
     * @param {jQuery|Element|String} input
     * @param {Boolean=true} alwaysConsiderPlaceholder
     * @param {String=A} fallbackText
     * @returns {MaskedInput}
     */
    _syncInputSize(input, alwaysConsiderPlaceholder, fallbackText) {
        const p = this.p;

        if (alwaysConsiderPlaceholder === undefined) {
            alwaysConsiderPlaceholder = true;
        }

        if (fallbackText === undefined) {
            fallbackText = 'A';
        }

        const $input = $(input), $backBuffer = p.$inputBackBuffer;

        /** @type {HTMLInputElement} */
        const inputEl = $input[0];

        fallbackText = fallbackText == null ? '' : (fallbackText + '');
        const value = inputEl.value || inputEl.placeholder || fallbackText;

        // Introduce backbuffer to DOM
        $backBuffer
            .css($input.css(inputBackbufferCssProps))
            .text(value)
            .appendTo(this.$el);

        // Measure these
        let backBufferWidth = getPreciseContentWidth($backBuffer[0]) + 1 /* caret width */;
        const currentWidth = getPreciseContentWidth(inputEl);

        if (alwaysConsiderPlaceholder &&
            inputEl.value &&
            inputEl.placeholder &&
            inputEl.placeholder !== inputEl.value) {
            $backBuffer.text(inputEl.placeholder);
            backBufferWidth = Math.max(
                backBufferWidth,
                getPreciseContentWidth($backBuffer[0]) + 1 /* caret width */
            );
        }

        // Compare
        if (backBufferWidth !== currentWidth) {
            // Update if needed
            $input.css('width', backBufferWidth + 'px');
        }

        if ($input[0].scrollWidth > backBufferWidth) {
            $input.css('width', inputEl.scrollWidth);
        }

        // Remove backbuffer from DOM
        $backBuffer.remove();

        return this;
    }

    /**
     *
     * @private
     * @param {MaskedInput~Part} part
     * @returns {MaskedInput}
     */
    _syncInputSizeForPart(part) {
        if (!part.el || part.type === PartType.LABEL) return this;
        return this._syncInputSize(
            part.el,
            part.forcePlaceholderWidth === undefined ? true : !!part.forcePlaceholderWidth
        );
    }

    /**
     *
     * @private
     * @param {jQuery.Event} event
     * @param {HTMLInputElement} input
     * @param {MaskedInput~Part} part
     * @returns {MaskedInput}
     */
    _handleInput(event, input, part) {
        const content = input.value;
        let validatedContent;

        // Update input if acceptable
        validatedContent = this._validateContent(content, part);

        if (validatedContent === false) {
            event.preventDefault();

            // Fire change event
            this.$el.trigger('change');

            return this;
        }

        if (typeof validatedContent === 'string' &&
            content !== validatedContent) {
            input.value = validatedContent;
        }

        this._syncInputSizeForPart(part);

        if (this._shouldMoveToNextFieldAfterInput(getSelectionRange(input), input.value, part)) {
            $(input).nextAll(TABBABLE_SELECTOR).first().focus();
        }

        // Fire change event
        this.$el.trigger('change');

        return this;
    }

    /**
     *
     * @private
     * @param {jQuery.Event} event
     * @param {HTMLInputElement} input
     * @param {MaskedInput~Part} part
     * @returns {MaskedInput}
     */
    _handleKeydown(event, input, part) {
        if (input.readOnly) return this;

        const keycode = event.which;
        let triggerChange = false;

        const contentBefore = input.value;
        let validatedContent;

        // Handle UP/DOWN arrows for next/previous value

        if (keycode === KEY_ARROW_UP || keycode === KEY_ARROW_DOWN) {

            let nextValue, tryToUpdate = false;

            const minLen = part.maxLength ?
                Math.max(1, Math.min(part.length || 0, part.maxLength || 1)) :
                (part.length || 1);
            const maxLen = Math.max(part.length || 0, part.maxLength || 0);

            if (part.type === PartType.TEXT && part.options) {

                const fullMatch = findMatchInArray(part.options, contentBefore, true, true, false);
                let index = part.options.indexOf(fullMatch);

                if (index === -1) {
                    if (keycode === KEY_ARROW_UP) {
                        index = 0;
                    } else {
                        index = part.options.length - 1;
                    }
                } else {
                    index += keycode === KEY_ARROW_DOWN ? 1 : -1;
                }

                if (index === part.options.length) {
                    index = 0;
                } else if (index === -1) {
                    index = part.options.length - 1;
                }

                nextValue = part.options[index];

                tryToUpdate = true;

            } else if (part.type === PartType.NUMBER) {

                if (!contentBefore &&
                    keycode === KEY_ARROW_DOWN &&
                    part.wholeNumber &&
                    (typeof part.numericMax === 'number' || maxLen > 0) &&
                    typeof part.numericMin === 'number' &&
                    part.numericMin >= 0) {

                    // Start with largest number if going down from nothing
                    nextValue = typeof part.numericMax === 'number' ?
                        part.numericMax :
                        parseInt(repeatChar('9', maxLen), 10);

                } else if (!contentBefore &&
                    keycode === KEY_ARROW_UP &&
                    part.wholeNumber &&
                    typeof part.numericMin === 'number') {

                    // Start with minimum number
                    nextValue = part.numericMin === 0 ? 1 : part.numericMin;

                } else {
                    /// Up or down
                    nextValue = parseFloat(contentBefore) || 0;
                    nextValue += keycode === KEY_ARROW_UP ? 1 : -1;
                }

                // Limit to whole numbers
                if (part.wholeNumber) {
                    nextValue = Math.round(nextValue);
                }

                // Limit to min/max
                if (typeof part.numericMin === 'number' || typeof part.numericMax === 'number') {
                    nextValue = Math.max(
                        Math.min(
                            nextValue,
                            typeof part.numericMax === 'number' ? part.numericMax : Infinity
                        ),
                        typeof part.numericMin === 'number' ? part.numericMin : -Infinity
                    );
                }

                nextValue = nextValue + '';

                // Left-pad with zeroes when we figure out that we want that
                if (typeof part.numericMin === 'number' &&
                    part.numericMin >= 0) {
                    nextValue = repeatChar('0', minLen - nextValue.length) + nextValue;
                }

                tryToUpdate = true;
            }

            // Update input if acceptable
            if (tryToUpdate && nextValue !== contentBefore) {
                validatedContent = this._validateContent(nextValue, part);
                if (validatedContent === true) {
                    validatedContent = nextValue;
                }
                if (validatedContent !== false) {
                    input.value = validatedContent;
                    this._syncInputSizeForPart(part);
                    event.preventDefault();

                    triggerChange = true;
                }
            }
        }

        if (triggerChange) {
            // Fire change event
            this.$el.trigger('change');
        }

        // Handle LEFT/RIGHT arrows, basically when we are at the end/beginning of an input
        if (keycode === KEY_ARROW_LEFT || keycode === KEY_ARROW_RIGHT) {
            const isRtl = $(input).css('direction') === 'rtl';

            if ((!isRtl && keycode === KEY_ARROW_LEFT) || (isRtl && keycode === KEY_ARROW_RIGHT)) {
                if (getSelectionRange(input).begin === 0) {
                    $(input).prevAll(TABBABLE_SELECTOR).first().focus();
                }
            } else {
                if (getSelectionRange(input).begin === input.value.length) {
                    $(input).nextAll(TABBABLE_SELECTOR).first().focus();
                }
            }
        }

        return this;
    }

    /**
     *
     * @private
     * @param {jQuery.Event} event
     * @param {HTMLInputElement} input
     * @param {MaskedInput~Part} part
     * @returns {MaskedInput}
     */
    _handleKeypress(event, input, part) {
        if (input.readOnly) return this;

        const keycode = event.which;
        const pos = getSelectionRange(input);

        if (event.ctrlKey || event.altKey || event.metaKey ||
            !keycode ||
            keycode < 32 || keycode === KEY_ENTER) return this; // Not a character, perform default

        event.preventDefault();

        let triggerChange = false;
        let moveToNextField = false;

        const pressedChar = event.key || String.fromCharCode(keycode);

        const contentBefore = input.value;
        let contentAfter = contentBefore.substr(0, pos.begin) +
            pressedChar +
            contentBefore.substr(pos.end);

        const validatedContent = this._validateContent(contentAfter, part);
        if (validatedContent === false) return this; // Not validated, ignore keypress

        if (typeof validatedContent === 'string') {
            contentAfter = validatedContent;
        }

        if (contentAfter !== contentBefore || contentAfter.substr(pos.begin, 1) === pressedChar) {

            const newPos = {};

            // Set caret at new position

            if (pos.end - pos.begin > 0 && pos.direction === 'backward') {
                newPos.begin = newPos.end = pos.begin;
            } else {
                newPos.begin = newPos.end = pos.begin + 1;
            }

            // Show rest of only choice found
            if (part.type === PartType.TEXT && part.options) {

                const fullMatch = findMatchInArray(part.options, contentAfter, false, true, false);
                if (fullMatch !== undefined && fullMatch.length !== contentAfter.length) {
                    // Choose a selection range for the rest of the match
                    newPos.begin = contentAfter.length;
                    newPos.end = fullMatch.length;

                    // Set new input to full match
                    contentAfter = fullMatch;
                }

            }

            // Update value
            input.value = contentAfter;

            // Update selection / caret
            //noinspection JSCheckFunctionSignatures
            setSelectionRange(input, newPos);

            // See if we need to move on to next field
            moveToNextField = this._shouldMoveToNextFieldAfterInput(newPos, contentAfter, part);

            triggerChange = true;

        } else {

            // These are usually used as separators
            if (pressedChar === '/' ||
                pressedChar === ':' ||
                pressedChar === '-' ||
                pressedChar === '(' ||
                pressedChar === ')' ||
                pressedChar === '.') {
                moveToNextField = true;
            }
        }

        this._syncInputSizeForPart(part);

        if (triggerChange) {
            // Fire change event
            this.$el.trigger('change');
        }

        if (moveToNextField) {
            $(input).nextAll(TABBABLE_SELECTOR).first().focus();
        }

        return this;
    }

    /**
     * Determines if we need to skip to next field after input change
     * @private
     * @param {{begin: Number, end: Number}} newPos
     * @param {String} newContent
     * @param {MaskedInput~Part} part
     */
    _shouldMoveToNextFieldAfterInput(newPos, newContent, part) {
        if (newPos.begin === newContent.length) {
            if (part.type === PartType.TEXT) {
                return findMatchInArray(part.options, newContent, false, true, false) === newContent;
            } else {
                return (part.length || part.maxLength || 0) > 0 &&
                    newContent.length === (part.length || part.maxLength);
            }
        }

        return false;
    }

    /**
     *
     * @private
     * @param {String} content
     * @param {MaskedInput~Part} part
     * @returns {String|Boolean}
     */
    _validateContent(content, part) {

        // Priority given to validator
        if (part.validator) {
            if (part.validator instanceof RegExp) {
                return part.validator.test(content);
            }

            let ret = part.validator.call(this, content, part);
            if (ret == null) {
                ret = false;
            }
            return ret;
        }

        const maxLen = Math.max(part.length || 0, part.maxLength || 0);

        // Test numeric
        if (part.type === PartType.NUMBER) {

            if (part.wholeNumber) {
                content = content.replace(/[^-0-9]/g, ''); // Zeroes and "-" only
            } else {
                content = content.replace(/[^-0-9.]/g, ''); // Zeroes, "-" and "." only
            }

            content = content
                .replace(/^.+-/g, '-') // Dash can only be at the beginning
                .replace(/\..*\./g, '.'); // Only one decimal point

            if (maxLen > 0 && content.length > maxLen) {
                content = content.substr(0, maxLen);
            }

            // Limit to min/max
            // It's important to do this AFTER trimming the value,
            // To allow inserting character in the middle.
            if (typeof part.numericMin === 'number' || typeof part.numericMax === 'number') {
                let parsedValue = parseFloat(content);
                if (!isNaN(parsedValue)) {
                    parsedValue = Math.max(
                        Math.min(
                            parsedValue,
                            typeof part.numericMax === 'number' ? part.numericMax : Infinity
                        ),
                        typeof part.numericMin === 'number' ? part.numericMin : -Infinity
                    );

                    if (parsedValue !== parseFloat(content)) {
                        content = parsedValue + '';
                    }
                }
            }

            if (!content) {
                return false;
            }

            return content;
        }

        // Test textual
        if (part.type === PartType.TEXT) {
            if (part.options) {
                const match = findMatchInArray(part.options, content, true, false, false);
                if (match !== undefined) {
                    return match;
                }
                return false;
            }

            return maxLen === 0 || content.length <= maxLen;
        }

        return false;
    }

    /**
     * @public
     * @returns {MaskedInput}
     */
    resize() {
        const p = this.p;

        (p.parsed || []).forEach(part => this._syncInputSizeForPart(part));

        return this;
    }

    /**
     * Retrieve a field element by index or label
     * @public
     * @param {Number|String} index
     * @returns {HTMLInputElement}
     */
    field(index) {
        const p = this.p;

        const input = p.inputs[index];

        if (!input) return undefined;

        return $.isArray(input) ? input.slice(0) : input;
    }

    /**
     * Creates a pattern for parsing an incoming value
     * @private
     * @returns {string}
     */
    _valuePattern() {
        const p = this.p;

        let pattern = '';

        p.parsed.forEach(part => {
            let group = '';

            const minLen = part.maxLength ?
                Math.max(1, Math.min(part.length || 0, part.maxLength || 1)) :
                (part.length || 1);
            const maxLen = Math.max(part.length || 0, part.maxLength || 0);

            if (part.type === PartType.TEXT) {
                if (part.options) {
                    for (let i = 0; i < part.options.length; i++) {
                        if (i > 0) {
                            group += '|';
                        }
                        group += escapeRegExp(part.options[i]);
                    }
                } else {
                    if (maxLen) {
                        group += '.{0,' + maxLen + '}';
                    } else {
                        group += '.*?';
                    }
                }
            } else if (part.type === PartType.NUMBER) {
                if (part.wholeNumber) {
                    if (part.length > 0) {
                        group += '[-+]' + '[0-9]{' + (minLen - 1) + ',' + (maxLen - 1) + '}';
                        group += '|[0-9]{' + minLen + ',' + maxLen + '}';
                    } else {
                        group += '[-+]?[0-9]+';
                    }
                } else {
                    if (maxLen) {
                        group += '[-+]' + '[0-9.]{' + (minLen - 1) + ',' + (maxLen - 1) + '}';
                        group += '|[0-9.]{' + minLen + ',' + maxLen + '}';
                    } else {
                        group += '[-+]?(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+)';
                    }
                }
            } else /* if (part.type === PartType.LABEL) */ {
                group += escapeRegExp(part.text == null ? '' : (part.text + ''));
            }

            pattern += '(' + group + ')';

            if (part.required !== undefined && !part.required) {
                pattern += '?';
            }
        });

        return '^' + pattern + '$';
    }

    /**
     * Retrieve or set an input element's value
     * @private
     * @param {HTMLInputElement|jQuery|String} input
     * @param {String?} newValue
     * @returns {String|MaskedInput|undefined}
     */
    _fieldValue(input, newValue) {
        const $input = $(input);
        if (!$input.length) return undefined;
        input = $input[0];

        const part = /**MaskedInput~Part=*/ $input.data('part');
        let validatedValue;

        if (newValue === undefined) {
            let value = input.value;

            // Predefined choices?
            if (part.type === PartType.TEXT && part.options) {
                return findMatchInArray(part.options, value, true, true, false);
            }

            // Enforce length
            const maxLen = Math.max(part.length || 0, part.maxLength || 0);
            if (maxLen > 0 && value.length > maxLen) {
                value = value.substr(0, maxLen);
            }

            // Validate value
            validatedValue = this._validateContent(value, part);
            if (validatedValue === false) return undefined;

            if (validatedValue !== true) { // A string, probably
                value = validatedValue + '';
            }

            return value;
        } else {
            newValue = newValue == null ? '' : (newValue + '');
            validatedValue = this._validateContent(newValue, part);
            if (validatedValue === false) {
                validatedValue = '';
            } else if (validatedValue === true) {
                validatedValue = newValue;
            }

            input.value = validatedValue;

            this._syncInputSizeForPart(part);
        }
    }

    /**
     * Retrieve an input element's value by index or label
     * @public
     * @param {Number|String} index
     * @param {String?} newValue
     * @returns {String|MaskedInput|undefined}
     */
    fieldValue(index, newValue) {
        const p = this.p;

        const input = p.inputs[index];

        if (!input) return undefined;

        if (newValue === undefined) {
            return this._fieldValue(input);
        } else {
            this._fieldValue(input, newValue);
            return this;
        }
    }

    /**
     * Gets or sets an option by name
     * @param {String} name
     * @param {*?} newValue
     * @returns {MaskedInput}
     */
    option(name, newValue) {
        const o = this.o;

        if (arguments.length === 2) {
            if (name === 'patterns') {
                o[name] = {};

                MaskedInput.patternAddons.forEach(addon => {
                    o[name] = $.extend(o[name], addon);
                });

                o[name] = $.extend(o[name], newValue);
            } else {
                o[name] = newValue;
            }
        } else {
            return o[name];
        }
    }

    /**
     * Gets or sets a part's option by option name
     * @private
     * @param {MaskedInput~Part} part
     * @param {String|Object<String, *>} name
     * @param {*?} value
     * @returns {MaskedInput|*}
     */
    _fieldOption(part, name, value) {
        const p = this.p;

        if (!part) {
            return arguments.length === 3 ? this : undefined;
        }

        if (arguments.length === 3 || typeof(name) === 'object') {

            if (typeof name === 'object') {
                // Set the options object for part
                Object.keys(/**@type {Object<String, *>}*/name).forEach(key => {
                    this._fieldOption(part, key, name[key]);
                });

                return this;
            }

            if (name === 'name' && part.name !== value) {

                // Remove by the old name
                if (parseInt(part.name, 10).toString() !== part.name &&
                    p.inputs[part.name]) {
                    if (p.inputs[part.name] instanceof HTMLElement) {
                        delete p.inputs[part.name];
                    } else {
                        p.inputs[part.name].splice(p.inputs[part.name].indexOf(part), 1);
                        if (p.inputs[part.name].length === 1) {
                            p.inputs[part.name] = p.inputs[part.name][0];
                        }
                    }
                }

                // Assign the new name
                if (value && parseInt(value, 10).toString() !== value) {
                    if (p.inputs[value]) {
                        if (p.inputs[value] instanceof HTMLElement) {
                            p.inputs[value] = [p.inputs[value], part];
                        } else {
                            p.inputs[value] = part;
                        }
                    } else {
                        p.inputs[value] = part;
                    }
                }
            }

            if (name !== 'el' && name !== '$el') {
                // Do not allow overriding the internal element pointer by mistake
                part[name] = value;
            }

            if (part.el && (
                name === 'length' ||
                name === 'name' ||
                name === 'ariaLabel' ||
                name === 'placeholder')) {
                this._renderInput(part, part.el);
            }

        } else {

            if (Array.isArray(name)) {
                // Return value mapping as an object
                const options = {};

                (/**@type String[]*/name).forEach(key => {
                    options[key] = part[key];
                });

                return options;
            } else {
                // Return value
                return part[name];
            }
        }

        return this;
    }

    /**
     * Gets or sets a part's option by part's index and option name
     * @public
     * @param {Number|String} index
     * @param {String|Object} name
     * @param {*?} value
     * @returns {MaskedInput|*}
     */
    fieldOption(index, name, value) {
        const that = this,
            p = this.p;

        const inputEls = p.inputs[index];
        if (!inputEls) return this;

        if (inputEls.length > 1) {
            if (arguments.length === 3 || typeof(name) === 'object') {

                // Set the option/options for all inputs
                inputEls.forEach(el => {
                    that._fieldOption($(el).data('part'), name, value);
                });

                delete p.valueRegex;

                return this;
            } else {

                // Return array of option/options for all inputs
                return inputEls.map(el => that._fieldOption($(el).data('part'), name));
            }
        } else {
            if (arguments.length === 3) {

                // Set the option/options for input
                this._fieldOption($(inputEls).data('part'), name, value);

                delete p.valueRegex;

                return this;
            } else {

                // Return value/values
                return this._fieldOption($(inputEls).data('part'), name);
            }
        }
    }

    /**
     * Get or set the full value
     * @public
     * @param {String?} newValue
     * @returns {String|undefined|MaskedInput}
     */
    value(newValue) {
        const p = this.p;

        let pi, part, value;

        if (newValue === undefined) {

            let out = '';

            for (pi = 0; pi < p.parsed.length; pi++) {
                part = p.parsed[pi];

                if (part.type === PartType.TEXT) {

                    value = this._fieldValue(part.el);

                    // Check that the value is OK
                    if (part.postProcess) {
                        value = part.postProcess.call(this, value, part) + '';
                    }

                    if (value === undefined) {
                        if (part.required === undefined || part.required) {
                            return undefined;
                        }

                        value = part.defaultValue || '';
                    }

                    out += value === undefined ? '' : value;

                } else if (part.type === PartType.NUMBER) {

                    value = this._fieldValue(part.el);

                    // Check that the value is OK
                    if (value === undefined) {
                        if (part.required === undefined || part.required) {
                            return undefined;
                        }

                        value = part.defaultValue || '';
                    }

                    // Post process
                    if (part.postProcess) {
                        value = part.postProcess.call(this, value, part);

                        // Check again that the value is OK
                        if (value === undefined) {
                            if (part.required === undefined || part.required) {
                                return undefined;
                            }

                            value = part.defaultValue || '';
                        } else {
                            value = value + '';
                        }
                    }

                    const minLen = part.maxLength ?
                        Math.max(0, Math.min(part.length || 0, part.maxLength || 0)) :
                        (part.length || 0);
                    const maxLen = Math.max(part.length || 0, part.maxLength || 0);

                    // Try to pad with zeroes where possible
                    if (part.padding || part.padding === undefined) {
                        const padding = typeof part.padding === 'number' ? part.padding || minLen : minLen;

                        if (padding > 0 && value.length < padding) {
                            for (let i = 0; i < value.length; i++) {
                                if (/[0-9.]/.test(value[i])) {
                                    value = value.substr(0, i) +
                                        repeatChar('0', padding - value.length) +
                                        value.substr(i);
                                    break;
                                }
                            }

                            if (value.length < padding) {
                                value = repeatChar('0', padding - value.length) + value;
                            }
                        }
                    }

                    out += value === undefined ? '' : value;

                } else { // PartType.LABEL
                    // Probably a raw text between labels
                    out += part.text;
                }

            }

            return out;

        } else {
            if (!p.valueRegex) {
                p.valueRegex = new RegExp(this._valuePattern(), 'i');
            }

            const matches = newValue.match(p.valueRegex) || [];
            for (let i = 1, pi = 0; i < matches.length && pi < p.parsed.length; i++, pi++) {
                part = p.parsed[pi];
                value = matches[i] || '';

                if (part.type !== PartType.LABEL) {

                    this._fieldValue(part.el, value);

                }

            }

            // Allow clearing the field
            if (!matches.length && (newValue === '' || newValue === null)) {
                for (pi = 0; pi < p.parsed.length; pi++) {
                    part = p.parsed[pi];

                    if (part.type !== PartType.LABEL) {
                        this._fieldValue(part.el, '');
                    }

                }
            }
        }

        return this;
    }

    /**
     *
     * @returns {function(string?):(String|MaskedInput|undefined)}
     */
    get val() {
        return this.value;
    }

    /**
     * @public
     * @returns {Boolean} <code>true</code> if enabled
     */
    get isEnabled() {
        return this.p.enabled;
    }

    /**
     * Set input enabled/disabled mode
     * @param {Boolean} enabled
     */
    set isEnabled(enabled) {
        const p = this.p;

        enabled = !!enabled || enabled === undefined;

        p.enabled = enabled;

        this.$el[0].attr('disabled', enabled ? null : true);
        this.$el.find('input').prop('disabled', !enabled);

        return this;
    }

    /**
     * @public
     * @returns {Boolean} <code>true</code> if disabled
     */
    get isDisabled() {
        return !this.p.enabled;
    }

    /**
     * Set input enabled/disabled mode
     * @param {Boolean} disabled
     */
    set isDisabled(disabled) {
        disabled = !!disabled || disabled === undefined;

        this.isEnabled = !disabled;
    }
}

const FORMAT_REGEX = new RegExp(
    '(0+(?::[a-zA-Z0-9_]+)?)' + /* numeric value, fixed length, with possible :name_123 */
    '|(#+(?::[a-zA-Z0-9_]+)?)' + /* numeric value, with possible :name_123 */
    '|((?:@+|\\*)(?::[a-zA-Z0-9_]+)?)' + /* text value with maximum or variable length, with possible :name_123 */
    '|("[^"]*"|\'[^\']*\')' /* possible quoted text */
    , 'g' // find all matches
);

/**
 * @public
 * @expose
 */
MaskedInput.PartType = PartType;

/**
 * Here we can add more pattern addons
 * @public
 * @expose
 */
MaskedInput.patternAddons = [];

/**
 * Default options for the control
 * @public
 * @expose
 * @type {MaskedInput.Options}
 */
MaskedInput.defaults = defaults;

export default MaskedInput;

/** CORE_END */
