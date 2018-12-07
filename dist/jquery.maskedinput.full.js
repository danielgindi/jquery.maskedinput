/*!
 * maskedinput.js 1.0.8
 * git://github.com/danielgindi/jquery.maskedinput.git
 */

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["jquery"], factory);
  } else if (typeof exports !== "undefined") {
    module.exports = factory(require("jquery"));
  } else {
    var mod = {
      exports: {}
    };
    mod.exports = factory(global.jQuery);;
    global.MaskedInput = mod.exports;
  }
})(this, function (_jquery) {
  'use strict';

  
  _jquery = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  var MaskedInput = function () {
    /**
     * @typedef {String} MaskedInput~PartType
     * @name MaskedInput~PartType
     * @enum {String}
     */
    var PartType = {
      /** @const */
      NUMBER: 'number',

      /** @const */
      TEXT: 'text',

      /** @const */
      LABEL: 'label'
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

    var defaults =
    /** @type {MaskedInput.Options} */
    {
      patterns: {}
    };

    var execRegexWithLeftovers = function execRegexWithLeftovers(regex, input, onMatch, onLeftover) {
      var match,
          lastIndex = 0;
      regex.lastIndex = 0;

      while (match = regex.exec(input)) {
        // Add skipped raw text
        if (match.index > lastIndex) {
          onLeftover(input.substring(lastIndex, match.index));
        }

        onMatch(match);
        lastIndex = regex.lastIndex;
      } // Add remaining text


      if (input.length > lastIndex) {
        onLeftover(input.substring(lastIndex, input.length));
      }
    };
    /**
     * Get the selection range in an element
     * @param {HTMLInputElement} el
     * @returns {{begin: Number, end: Number, direction: 'forward'|'backward'|'none'|undefined}}
     */


    var getSelectionRange = function getSelectionRange(el) {
      var begin,
          end,
          direction = 'none';

      if (el.setSelectionRange) {
        begin = el.selectionStart;
        end = el.selectionEnd;
        direction = el.selectionDirection;
      } else if (document.selection && document.selection.createRange) {
        var range = document.selection.createRange();
        begin = 0 - range.duplicate().moveStart('character', -10000);
        end = begin + range.text.length;
      }

      return {
        begin: begin,
        end: end,
        direction: direction
      };
    };
    /**
     * Set the selection range in an element
     * @param {HTMLInputElement} el
     * @param {Number|{begin: Number, end: Number, direction: 'forward'|'backward'|'none'|undefined}} begin
     * @param {Number?} end
     * @param {('forward'|'backward'|'none')?} direction
     */


    var setSelectionRange = function setSelectionRange(el, begin, end, direction) {
      if (_typeof(arguments[1]) === 'object' && 'begin' in arguments[1]) {
        begin = arguments[1].begin;
        end = arguments[1].end;
        direction = arguments[1].direction;
      }

      if (direction === undefined) {
        if (typeof arguments[2] === 'string' && (arguments[2] === 'forward' || arguments[2] === 'backward' || arguments[2] === 'none')) {
          direction = arguments[2];
          end = null;
        }
      }

      end = end == null ? begin : end;

      if (el.setSelectionRange) {
        el.setSelectionRange(begin, end, direction);
      } else {
        if (el.createTextRange) {
          var range = el.createTextRange();
          range.collapse(true);
          range.moveEnd('character', end);
          range.moveStart('character', begin);
          range.select();
        }
      }
    };

    var repeatChar = function repeatChar(char, length) {
      var out = '';

      for (var i = 0; i < length; i++) {
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


    var findMatchInArray = function findMatchInArray(options, term, closestChoice, returnFullMatch, caseSensitive) {
      var i, option, optionLower;
      var termLower = caseSensitive ? term : term.toLowerCase();

      if (closestChoice) {
        // Search for a partial option or partial content match, return the longest match found, or `false`
        var maxMatchLength = 0;
        var maxMatchOption;
        var maxMatchFullOption;

        for (i = 0; i < options.length; i++) {
          option = options[i];
          optionLower = caseSensitive ? option : option.toLowerCase();

          for (var clen = Math.min(option.length, 1); clen <= term.length; clen++) {
            if (option.length >= clen && optionLower.substr(0, clen) === termLower.substr(0, clen)) {
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
          if (option.length >= term.length && optionLower.substr(0, term.length) === termLower) return returnFullMatch ? option : true;
        }
      }
    };
    /**
     * Regex escape
     * @param {String} str
     * @returns {XML|void|string}
     */


    var escapeRegExp = function escapeRegExp(str) {
      return str.replace(/[\-\[\]\/{}()*+?.\\\^$|]/g, '\\$&');
    };
    /**
     * Search for closest element to a specified point
     * @param {HTMLElement[]} elements
     * @param {{left: Number, top: Number }} offset
     * @returns {HTMLElement|null}
     */


    var closestToOffset = function closestToOffset(elements, offset) {
      var x = offset.left,
          y = offset.top;
      var bestMatch = null,
          minDistance = null;

      for (var i = 0; i < elements.length; i++) {
        var el = elements[i],
            $el = (0, _jquery.default)(el);
        var elOffset = $el.offset();
        elOffset.right = elOffset.left + $el.outerWidth();
        elOffset.bottom = elOffset.top + $el.outerHeight();

        if (x >= elOffset.left && x <= elOffset.right && y >= elOffset.top && y <= elOffset.bottom) {
          return el;
        }

        var offsets = [[elOffset.left, elOffset.top], [elOffset.right, elOffset.top], [elOffset.left, elOffset.bottom], [elOffset.right, elOffset.bottom]];

        for (var o = 0; o < 4; o++) {
          var _offset = offsets[o];
          var dx = _offset[0] - x;
          var dy = _offset[1] - y;
          var distance = Math.sqrt(dx * dx + dy * dy);

          if (minDistance == null || distance < minDistance) {
            minDistance = distance;
            bestMatch = el;
          }
        }
      }

      return bestMatch;
    };

    var callFunctor = function callFunctor(functor, bind, arg1) {
      return typeof functor === 'function' ? functor.apply(bind, Array.prototype.slice.call(arguments, 2)) : functor;
    };

    var inputBackbufferCssProps = ['font-family', 'font-size', 'font-weight', 'font-size', 'letter-spacing', 'text-transform', 'word-spacing', 'text-indent', 'box-sizing', 'padding-left', 'padding-right'];
    var hasComputedStyle = document.defaultView && document.defaultView.getComputedStyle;
    /**
     * Gets the precise content width for an element, with fractions
     * @param {Element} el
     * @returns {Number}
     */

    var getPreciseContentWidth = function getPreciseContentWidth(el) {
      var style = hasComputedStyle ? document.defaultView.getComputedStyle(el) : el.currentStyle;
      var width = parseFloat(style['width']) || 0;

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

    var FOCUSABLES = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '*[tabindex]', '*[contenteditable]'];
    var FOCUSABLE_SELECTOR = FOCUSABLES.join(',');
    var TABBABLE_SELECTOR = FOCUSABLES.map(function (x) {
      return x + ':not([tabindex=-1])';
    }).join(',');
    var KEY_ENTER = 13;
    var KEY_ARROW_UP = 38;
    var KEY_ARROW_DOWN = 40;
    var KEY_ARROW_LEFT = 37;
    var KEY_ARROW_RIGHT = 39;
    /** @class MaskedInput */

    var MaskedInput =
    /*#__PURE__*/
    function () {
      /**
       * @param {MaskedInput.Options?} options
       * @returns {MaskedInput}
       */
      function MaskedInput(options) {
        var _this = this;

        _classCallCheck(this, MaskedInput);

        /** @private */
        var o = this.o = _jquery.default.extend({}, MaskedInput.defaults, options);

        var patterns = {};
        MaskedInput.patternAddons.forEach(function (addon) {
          patterns = _jquery.default.extend(patterns, addon);
        });
        patterns = _jquery.default.extend(patterns, o.patterns);
        o.patterns = patterns;
        /** This is for encapsulating private data */

        var p = this.p = {};
        p.enabled = true;
        p.inputs = [];
        /** @public */

        var $el = this.$el = (0, _jquery.default)('<div>').addClass(o.className || 'masked-input');
        /** @public */

        this.el = this.$el[0]; // Set control data

        $el.data('control', this).data('maskedinput', this); // Parse format

        p.parsed = this._parseFormat(o.format); // Create backbuffer for input

        p.$inputBackBuffer = (0, _jquery.default)('<span aria-hidden="true" style="position:absolute;z-index:-1;left:0;top:-9999px;white-space:pre;"/>'); // Hook up click event

        $el.on('click', function (event) {
          if (event.target !== event.currentTarget && (0, _jquery.default)(event.target).is(FOCUSABLE_SELECTOR)) return;
          var offset = (0, _jquery.default)(event.currentTarget).offset();
          offset.left += event.offsetX;
          offset.top += event.offsetY;
          var el = closestToOffset($el.children(FOCUSABLE_SELECTOR), offset);

          if (el) {
            el.focus();
          }
        });
        this.render();
        setTimeout(function () {
          if (_this.el && _this.el.parentNode) {
            _this.resize();
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


      _createClass(MaskedInput, [{
        key: "_parseFormat",
        value: function _parseFormat(format) {
          var o = this.o;
          var parsedFormat = []; // Loop through basic format matches

          execRegexWithLeftovers(FORMAT_REGEX, format, function onMatch(match) {
            var numericMatch = match[1] || match[2];
            var textMatch = match[3];
            var quotedMatch = match[4];
            var i, part;

            if (numericMatch) {
              part = {
                type: PartType.NUMBER
              };
              i = numericMatch.indexOf(':');

              if (i > -1) {
                part.length = i;
                part.name = numericMatch.substr(i + 1);
              } else {
                part.length = numericMatch.length;
              }

              if (match[2]) {
                // max length
                part.maxLength = part.length;
                part.length = 0;
              }

              parsedFormat.push(part);
            } else if (textMatch) {
              part = {
                type: PartType.TEXT
              };

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
              var labelText = quotedMatch.substr(1, quotedMatch.length - 2);
              part = {
                type: PartType.LABEL,
                text: labelText,
                length: labelText.length
              };
              parsedFormat.push(part);
            }
          }.bind(this), function onLeftover(leftover) {
            var _this2 = this;

            var leftoverParts = [];
            var part = {
              type: PartType.LABEL,
              text: leftover,
              length: leftover.length
            };
            leftoverParts.push(part);
            Object.keys(o.patterns).forEach(function (key) {
              var patterns = o.patterns[key];
              var regex = new RegExp(patterns.pattern instanceof RegExp ? patterns.pattern.source : patterns.pattern, patterns.pattern instanceof RegExp ? patterns.pattern.flags + (patterns.pattern.flags.indexOf('g') > -1 ? '' : 'g') : 'g');

              var _loop = function _loop(_fpos) {
                var fpart = leftoverParts[_fpos];

                if (fpart.type !== PartType.LABEL) {
                  fpos = _fpos;
                  return "continue";
                }

                var newParts = [];
                execRegexWithLeftovers(regex, fpart.text, function onMatch(match) {
                  var validator;

                  if (patterns.validator instanceof RegExp || typeof patterns.validator === 'function') {
                    validator = patterns.validator;
                  } else if (typeof patterns.validator === 'string') {
                    try {
                      validator = new RegExp(patterns.validator);
                    } catch (e) {}
                  } // Translate the part


                  var part = {
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
                  }; //noinspection JSReferencingMutableVariableFromClosure

                  newParts.push(part);
                }.bind(_this2), function onLeftover(leftover) {
                  var part = {
                    type: PartType.LABEL,
                    text: leftover,
                    length: leftover.length
                  }; //noinspection JSReferencingMutableVariableFromClosure

                  newParts.push(part);
                }.bind(_this2)); // Replace old label with new parts

                Array.prototype.splice.apply(leftoverParts, [_fpos, 1].concat(newParts)); // Move leftoverParts position as necessary

                _fpos += newParts.length - 1;
                fpos = _fpos;
              };

              for (var fpos = 0; fpos < leftoverParts.length; fpos++) {
                var _ret = _loop(fpos);

                if (_ret === "continue") continue;
              }
            });
            parsedFormat = parsedFormat.concat(leftoverParts);
          }.bind(this));
          return parsedFormat;
        }
      }, {
        key: "render",
        value: function render() {
          var _this3 = this;

          var p = this.p;
          this.$el.empty();
          var inputs = [];
          p.parsed.forEach(function (part) {
            if (part.type === PartType.LABEL) {
              var $el = _this3._renderText(part).appendTo(_this3.$el);

              part.$el = $el;
              part.el = $el[0];
              return;
            }

            var $input = _this3._renderInput(part).appendTo(_this3.$el);

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

      }, {
        key: "_renderInput",
        value: function _renderInput(part, input) {
          var _this4 = this;

          var p = this.p;
          var isNewInput = !input;
          var $input;

          if (isNewInput) {
            $input = (0, _jquery.default)('<input>').data('part', part).prop('disabled', !p.enabled);
            input = $input[0];
          } else {
            $input = (0, _jquery.default)(input);
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
            var placeholder = typeof part.placeholder === 'string' ? part.placeholder : part.placeholder === undefined || part.placeholder ? repeatChar('_', part.length || part.maxLength) : '';
            input.placeholder = placeholder;
          }

          if (isNewInput) {
            $input.on('input.maskedinput', function (event) {
              _this4._handleInput(event, input, part);

              _this4._syncInputSizeForPart(part);
            }).on('keydown.maskedinput', function (event) {
              _this4._handleKeydown(event, input, part);
            }).on('keypress.maskedinput', function (event) {
              _this4._handleKeypress(event, input, part);
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

      }, {
        key: "_renderText",
        value: function _renderText(part) {
          return (0, _jquery.default)('<span style="white-space: pre">').text(part.text);
        }
        /**
         *
         * @private
         * @param {jQuery|Element|String} input
         * @param {Boolean=true} alwaysConsiderPlaceholder
         * @param {String=A} fallbackText
         * @returns {MaskedInput}
         */

      }, {
        key: "_syncInputSize",
        value: function _syncInputSize(input, alwaysConsiderPlaceholder, fallbackText) {
          var p = this.p;

          if (alwaysConsiderPlaceholder === undefined) {
            alwaysConsiderPlaceholder = true;
          }

          if (fallbackText === undefined) {
            fallbackText = 'A';
          }

          var $input = (0, _jquery.default)(input),
              $backBuffer = p.$inputBackBuffer;
          /** @type {HTMLInputElement} */

          var inputEl = $input[0];
          fallbackText = fallbackText == null ? '' : fallbackText + '';
          var value = inputEl.value || inputEl.placeholder || fallbackText; // Introduce backbuffer to DOM

          $backBuffer.css($input.css(inputBackbufferCssProps)).text(value).appendTo(this.$el); // Measure these

          var backBufferWidth = getPreciseContentWidth($backBuffer[0]) + 1
          /* caret width */
          ;
          var currentWidth = getPreciseContentWidth(inputEl);

          if (alwaysConsiderPlaceholder && inputEl.value && inputEl.placeholder && inputEl.placeholder !== inputEl.value) {
            $backBuffer.text(inputEl.placeholder);
            backBufferWidth = Math.max(backBufferWidth, getPreciseContentWidth($backBuffer[0]) + 1
            /* caret width */
            );
          } // Compare


          if (backBufferWidth !== currentWidth) {
            // Update if needed
            $input.css('width', backBufferWidth + 'px');
          }

          if ($input[0].scrollWidth > backBufferWidth) {
            $input.css('width', inputEl.scrollWidth);
          } // Remove backbuffer from DOM


          $backBuffer.remove();
          return this;
        }
        /**
         *
         * @private
         * @param {MaskedInput~Part} part
         * @returns {MaskedInput}
         */

      }, {
        key: "_syncInputSizeForPart",
        value: function _syncInputSizeForPart(part) {
          if (!part.el || part.type === PartType.LABEL) return this;
          return this._syncInputSize(part.el, part.forcePlaceholderWidth === undefined ? true : !!part.forcePlaceholderWidth);
        }
        /**
         *
         * @private
         * @param {jQuery.Event} event
         * @param {HTMLInputElement} input
         * @param {MaskedInput~Part} part
         * @returns {MaskedInput}
         */

      }, {
        key: "_handleInput",
        value: function _handleInput(event, input, part) {
          var content = input.value;
          var validatedContent; // Update input if acceptable

          validatedContent = this._validateContent(content, part);

          if (validatedContent === false) {
            event.preventDefault(); // Fire change event

            this.$el.trigger('change');
            return this;
          }

          if (typeof validatedContent === 'string' && content !== validatedContent) {
            input.value = validatedContent;
          }

          this._syncInputSizeForPart(part);

          if (this._shouldMoveToNextFieldAfterInput(getSelectionRange(input), input.value, part)) {
            (0, _jquery.default)(input).nextAll(TABBABLE_SELECTOR).first().focus();
          } // Fire change event


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

      }, {
        key: "_handleKeydown",
        value: function _handleKeydown(event, input, part) {
          if (input.readOnly) return this;
          var keycode = event.which;
          var triggerChange = false;
          var contentBefore = input.value;
          var validatedContent; // Handle UP/DOWN arrows for next/previous value

          if (keycode === KEY_ARROW_UP || keycode === KEY_ARROW_DOWN) {
            var nextValue,
                tryToUpdate = false;
            var minLen = part.maxLength ? Math.max(1, Math.min(part.length || 0, part.maxLength || 1)) : part.length || 1;
            var maxLen = Math.max(part.length || 0, part.maxLength || 0);

            if (part.type === PartType.TEXT && part.options) {
              var fullMatch = findMatchInArray(part.options, contentBefore, true, true, false);
              var index = part.options.indexOf(fullMatch);

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
              if (!contentBefore && keycode === KEY_ARROW_DOWN && part.wholeNumber && (typeof part.numericMax === 'number' || maxLen > 0) && typeof part.numericMin === 'number' && part.numericMin >= 0) {
                // Start with largest number if going down from nothing
                nextValue = typeof part.numericMax === 'number' ? part.numericMax : parseInt(repeatChar('9', maxLen), 10);
              } else if (!contentBefore && keycode === KEY_ARROW_UP && part.wholeNumber && typeof part.numericMin === 'number') {
                // Start with minimum number
                nextValue = part.numericMin === 0 ? 1 : part.numericMin;
              } else {
                /// Up or down
                nextValue = parseFloat(contentBefore) || 0;
                nextValue += keycode === KEY_ARROW_UP ? 1 : -1;
              } // Limit to whole numbers


              if (part.wholeNumber) {
                nextValue = Math.round(nextValue);
              } // Limit to min/max


              if (typeof part.numericMin === 'number' || typeof part.numericMax === 'number') {
                nextValue = Math.max(Math.min(nextValue, typeof part.numericMax === 'number' ? part.numericMax : Infinity), typeof part.numericMin === 'number' ? part.numericMin : -Infinity);
              }

              nextValue = nextValue + ''; // Left-pad with zeroes when we figure out that we want that

              if (typeof part.numericMin === 'number' && part.numericMin >= 0) {
                nextValue = repeatChar('0', minLen - nextValue.length) + nextValue;
              }

              tryToUpdate = true;
            } // Update input if acceptable


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
          } // Handle LEFT/RIGHT arrows, basically when we are at the end/beginning of an input


          if (keycode === KEY_ARROW_LEFT || keycode === KEY_ARROW_RIGHT) {
            var isRtl = (0, _jquery.default)(input).css('direction') === 'rtl';

            if (!isRtl && keycode === KEY_ARROW_LEFT || isRtl && keycode === KEY_ARROW_RIGHT) {
              if (getSelectionRange(input).begin === 0) {
                (0, _jquery.default)(input).prevAll(TABBABLE_SELECTOR).first().focus();
              }
            } else {
              if (getSelectionRange(input).begin === input.value.length) {
                (0, _jquery.default)(input).nextAll(TABBABLE_SELECTOR).first().focus();
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

      }, {
        key: "_handleKeypress",
        value: function _handleKeypress(event, input, part) {
          if (input.readOnly) return this;
          var keycode = event.which;
          var pos = getSelectionRange(input);
          if (event.ctrlKey || event.altKey || event.metaKey || !keycode || keycode < 32 || keycode === KEY_ENTER) return this; // Not a character, perform default

          event.preventDefault();
          var triggerChange = false;
          var moveToNextField = false;
          var pressedChar = event.key || String.fromCharCode(keycode);
          var contentBefore = input.value;
          var contentAfter = contentBefore.substr(0, pos.begin) + pressedChar + contentBefore.substr(pos.end);

          var validatedContent = this._validateContent(contentAfter, part);

          if (validatedContent === false) return this; // Not validated, ignore keypress

          if (typeof validatedContent === 'string') {
            contentAfter = validatedContent;
          }

          if (contentAfter !== contentBefore || contentAfter.substr(pos.begin, 1) === pressedChar) {
            var newPos = {}; // Set caret at new position

            if (pos.end - pos.begin > 0 && pos.direction === 'backward') {
              newPos.begin = newPos.end = pos.begin;
            } else {
              newPos.begin = newPos.end = pos.begin + 1;
            } // Show rest of only choice found


            if (part.type === PartType.TEXT && part.options) {
              var fullMatch = findMatchInArray(part.options, contentAfter, false, true, false);

              if (fullMatch !== undefined && fullMatch.length !== contentAfter.length) {
                // Choose a selection range for the rest of the match
                newPos.begin = contentAfter.length;
                newPos.end = fullMatch.length; // Set new input to full match

                contentAfter = fullMatch;
              }
            } // Update value


            input.value = contentAfter; // Update selection / caret
            //noinspection JSCheckFunctionSignatures

            setSelectionRange(input, newPos); // See if we need to move on to next field

            moveToNextField = this._shouldMoveToNextFieldAfterInput(newPos, contentAfter, part);
            triggerChange = true;
          } else {
            // These are usually used as separators
            if (pressedChar === '/' || pressedChar === ':' || pressedChar === '-' || pressedChar === '(' || pressedChar === ')' || pressedChar === '.') {
              moveToNextField = true;
            }
          }

          this._syncInputSizeForPart(part);

          if (triggerChange) {
            // Fire change event
            this.$el.trigger('change');
          }

          if (moveToNextField) {
            (0, _jquery.default)(input).nextAll(TABBABLE_SELECTOR).first().focus();
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

      }, {
        key: "_shouldMoveToNextFieldAfterInput",
        value: function _shouldMoveToNextFieldAfterInput(newPos, newContent, part) {
          if (newPos.begin === newContent.length) {
            if (part.type === PartType.TEXT) {
              return findMatchInArray(part.options, newContent, false, true, false) === newContent;
            } else {
              return (part.length || part.maxLength || 0) > 0 && newContent.length === (part.length || part.maxLength);
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

      }, {
        key: "_validateContent",
        value: function _validateContent(content, part) {
          // Priority given to validator
          if (part.validator) {
            if (part.validator instanceof RegExp) {
              return part.validator.test(content);
            }

            var ret = part.validator.call(this, content, part);

            if (ret == null) {
              ret = false;
            }

            return ret;
          }

          var maxLen = Math.max(part.length || 0, part.maxLength || 0); // Test numeric

          if (part.type === PartType.NUMBER) {
            if (part.wholeNumber) {
              content = content.replace(/[^-0-9]/g, ''); // Zeroes and "-" only
            } else {
              content = content.replace(/[^-0-9.]/g, ''); // Zeroes, "-" and "." only
            }

            content = content.replace(/^.+-/g, '-') // Dash can only be at the beginning
            .replace(/\..*\./g, '.'); // Only one decimal point

            if (maxLen > 0 && content.length > maxLen) {
              content = content.substr(0, maxLen);
            } // Limit to min/max
            // It's important to do this AFTER trimming the value,
            // To allow inserting character in the middle.


            if (typeof part.numericMin === 'number' || typeof part.numericMax === 'number') {
              var parsedValue = parseFloat(content);

              if (!isNaN(parsedValue)) {
                parsedValue = Math.max(Math.min(parsedValue, typeof part.numericMax === 'number' ? part.numericMax : Infinity), typeof part.numericMin === 'number' ? part.numericMin : -Infinity);

                if (parsedValue !== parseFloat(content)) {
                  content = parsedValue + '';
                }
              }
            }

            if (!content) {
              return false;
            }

            return content;
          } // Test textual


          if (part.type === PartType.TEXT) {
            if (part.options) {
              var match = findMatchInArray(part.options, content, true, false, false);

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

      }, {
        key: "resize",
        value: function resize() {
          var _this5 = this;

          var p = this.p;
          (p.parsed || []).forEach(function (part) {
            return _this5._syncInputSizeForPart(part);
          });
          return this;
        }
        /**
         * Retrieve a field element by index or label
         * @public
         * @param {Number|String} index
         * @returns {HTMLInputElement}
         */

      }, {
        key: "field",
        value: function field(index) {
          var p = this.p;
          var input = p.inputs[index];
          if (!input) return undefined;
          return _jquery.default.isArray(input) ? input.slice(0) : input;
        }
        /**
         * Creates a pattern for parsing an incoming value
         * @private
         * @returns {string}
         */

      }, {
        key: "_valuePattern",
        value: function _valuePattern() {
          var p = this.p;
          var pattern = '';
          p.parsed.forEach(function (part) {
            var group = '';
            var minLen = part.maxLength ? Math.max(1, Math.min(part.length || 0, part.maxLength || 1)) : part.length || 1;
            var maxLen = Math.max(part.length || 0, part.maxLength || 0);

            if (part.type === PartType.TEXT) {
              if (part.options) {
                for (var i = 0; i < part.options.length; i++) {
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
            } else
              /* if (part.type === PartType.LABEL) */
              {
                group += escapeRegExp(part.text == null ? '' : part.text + '');
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

      }, {
        key: "_fieldValue",
        value: function _fieldValue(input, newValue) {
          var $input = (0, _jquery.default)(input);
          if (!$input.length) return undefined;
          input = $input[0];
          var part =
          /**MaskedInput~Part=*/
          $input.data('part');
          var validatedValue;

          if (newValue === undefined) {
            var value = input.value; // Predefined choices?

            if (part.type === PartType.TEXT && part.options) {
              return findMatchInArray(part.options, value, true, true, false);
            } // Enforce length


            var maxLen = Math.max(part.length || 0, part.maxLength || 0);

            if (maxLen > 0 && value.length > maxLen) {
              value = value.substr(0, maxLen);
            } // Validate value


            validatedValue = this._validateContent(value, part);
            if (validatedValue === false) return undefined;

            if (validatedValue !== true) {
              // A string, probably
              value = validatedValue + '';
            }

            return value;
          } else {
            newValue = newValue == null ? '' : newValue + '';
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

      }, {
        key: "fieldValue",
        value: function fieldValue(index, newValue) {
          var p = this.p;
          var input = p.inputs[index];
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

      }, {
        key: "option",
        value: function option(name, newValue) {
          var o = this.o;

          if (arguments.length === 2) {
            if (name === 'patterns') {
              o[name] = {};
              MaskedInput.patternAddons.forEach(function (addon) {
                o[name] = _jquery.default.extend(o[name], addon);
              });
              o[name] = _jquery.default.extend(o[name], newValue);
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

      }, {
        key: "_fieldOption",
        value: function _fieldOption(part, name, value) {
          var _this6 = this;

          var p = this.p;

          if (!part) {
            return arguments.length === 3 ? this : undefined;
          }

          if (arguments.length === 3 || _typeof(name) === 'object') {
            if (_typeof(name) === 'object') {
              // Set the options object for part
              Object.keys(
              /**@type {Object<String, *>}*/
              name).forEach(function (key) {
                _this6._fieldOption(part, key, name[key]);
              });
              return this;
            }

            if (name === 'name' && part.name !== value) {
              // Remove by the old name
              if (parseInt(part.name, 10).toString() !== part.name && p.inputs[part.name]) {
                if (p.inputs[part.name] instanceof HTMLElement) {
                  delete p.inputs[part.name];
                } else {
                  p.inputs[part.name].splice(p.inputs[part.name].indexOf(part), 1);

                  if (p.inputs[part.name].length === 1) {
                    p.inputs[part.name] = p.inputs[part.name][0];
                  }
                }
              } // Assign the new name


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

            if (part.el && (name === 'length' || name === 'name' || name === 'ariaLabel' || name === 'placeholder')) {
              this._renderInput(part, part.el);
            }
          } else {
            if (Array.isArray(name)) {
              // Return value mapping as an object
              var options = {};

              /**@type String[]*/
              name.forEach(function (key) {
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

      }, {
        key: "fieldOption",
        value: function fieldOption(index, name, value) {
          var that = this,
              p = this.p;
          var inputEls = p.inputs[index];
          if (!inputEls) return this;

          if (inputEls.length > 1) {
            if (arguments.length === 3 || _typeof(name) === 'object') {
              // Set the option/options for all inputs
              inputEls.forEach(function (el) {
                that._fieldOption((0, _jquery.default)(el).data('part'), name, value);
              });
              delete p.valueRegex;
              return this;
            } else {
              // Return array of option/options for all inputs
              return inputEls.map(function (el) {
                return that._fieldOption((0, _jquery.default)(el).data('part'), name);
              });
            }
          } else {
            if (arguments.length === 3) {
              // Set the option/options for input
              this._fieldOption((0, _jquery.default)(inputEls).data('part'), name, value);

              delete p.valueRegex;
              return this;
            } else {
              // Return value/values
              return this._fieldOption((0, _jquery.default)(inputEls).data('part'), name);
            }
          }
        }
        /**
         * Get or set the full value
         * @public
         * @param {String?} newValue
         * @returns {String|undefined|MaskedInput}
         */

      }, {
        key: "value",
        value: function value(newValue) {
          var p = this.p;
          var pi, part, value;

          if (newValue === undefined) {
            var out = '';

            for (pi = 0; pi < p.parsed.length; pi++) {
              part = p.parsed[pi];

              if (part.type === PartType.TEXT) {
                value = this._fieldValue(part.el); // Check that the value is OK

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
                value = this._fieldValue(part.el); // Check that the value is OK

                if (value === undefined) {
                  if (part.required === undefined || part.required) {
                    return undefined;
                  }

                  value = part.defaultValue || '';
                } // Post process


                if (part.postProcess) {
                  value = part.postProcess.call(this, value, part); // Check again that the value is OK

                  if (value === undefined) {
                    if (part.required === undefined || part.required) {
                      return undefined;
                    }

                    value = part.defaultValue || '';
                  } else {
                    value = value + '';
                  }
                }

                var minLen = part.maxLength ? Math.max(0, Math.min(part.length || 0, part.maxLength || 0)) : part.length || 0;
                var maxLen = Math.max(part.length || 0, part.maxLength || 0); // Try to pad with zeroes where possible

                if (part.padding || part.padding === undefined) {
                  var padding = typeof part.padding === 'number' ? part.padding || minLen : minLen;

                  if (padding > 0 && value.length < padding) {
                    for (var i = 0; i < value.length; i++) {
                      if (/[0-9.]/.test(value[i])) {
                        value = value.substr(0, i) + repeatChar('0', padding - value.length) + value.substr(i);
                        break;
                      }
                    }

                    if (value.length < padding) {
                      value = repeatChar('0', padding - value.length) + value;
                    }
                  }
                }

                out += value === undefined ? '' : value;
              } else {
                // PartType.LABEL
                // Probably a raw text between labels
                out += part.text;
              }
            }

            return out;
          } else {
            if (!p.valueRegex) {
              p.valueRegex = new RegExp(this._valuePattern(), 'i');
            }

            var matches = newValue.match(p.valueRegex) || [];

            for (var _i = 1, _pi = 0; _i < matches.length && _pi < p.parsed.length; _i++, _pi++) {
              part = p.parsed[_pi];
              value = matches[_i] || '';

              if (part.type !== PartType.LABEL) {
                this._fieldValue(part.el, value);
              }
            } // Allow clearing the field


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

      }, {
        key: "enable",

        /**
         * Set input enabled/disabled mode
         * @param {Boolean} [enabled=true]
         * @returns {MaskedInput} this
         */
        value: function enable(enabled) {
          var p = this.p;
          enabled = !!enabled || enabled === undefined;
          p.enabled = enabled;
          this.$el.attr('disabled', enabled ? null : true);
          this.$el.find('input').prop('disabled', !enabled);
          return this;
        }
        /**
         * Set input enabled/disabled mode
         * @param {Boolean} [disabled=true]
         * @returns {MaskedInput} this
         */

      }, {
        key: "disable",
        value: function disable(disabled) {
          disabled = !!disabled || disabled === undefined;
          return this.enable(!disabled);
        }
        /**
         * @public
         * @returns {Boolean} <code>true</code> if enabled
         */

      }, {
        key: "val",
        get: function get() {
          return this.value;
        }
      }, {
        key: "isEnabled",
        get: function get() {
          return this.p.enabled;
        }
        /**
         * Set input enabled/disabled mode
         * @param {Boolean} enabled
         */
        ,
        set: function set(enabled) {
          this.enable(enabled);
        }
        /**
         * @public
         * @returns {Boolean} <code>true</code> if disabled
         */

      }, {
        key: "isDisabled",
        get: function get() {
          return !this.p.enabled;
        }
        /**
         * Set input enabled/disabled mode
         * @param {Boolean} disabled
         */
        ,
        set: function set(disabled) {
          this.disable(disabled);
        }
      }]);

      return MaskedInput;
    }();

    var FORMAT_REGEX = new RegExp('(0+(?::[a-zA-Z0-9_]+)?)' +
    /* numeric value, fixed length, with possible :name_123 */
    '|(#+(?::[a-zA-Z0-9_]+)?)' +
    /* numeric value, with possible :name_123 */
    '|((?:@+|\\*)(?::[a-zA-Z0-9_]+)?)' +
    /* text value with maximum or variable length, with possible :name_123 */
    '|("[^"]*"|\'[^\']*\')'
    /* possible quoted text */
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
    return MaskedInput;
  }();

  'use strict';
  /** DATE_BEGIN */

  /**
   * @name MaskedInput~Options
   * @property {MaskedInput~DateLocale} [dateLocale] - Date localization map
   */

  /**
   * @typedef {Object} MaskedInput~DateLocale
   * @property {String[]} [MMM]
   * @property {String[]} [MMMM]
   * @property {String[]} [t]
   * @property {String[]} [tt]
   * @property {String[]} [T]
   * @property {String[]} [TT]
   */


  var repeatChar = function repeatChar(char, length) {
    var out = '';

    for (var i = 0; i < length; i++) {
      out += char;
    }

    return out;
  };

  var maxArrayStringLength = function maxArrayStringLength(array) {
    var slen = 0;

    for (var i = 0; i < array.length; i++) {
      if (array[i].length > slen) {
        slen = array[i].length;
      }
    }

    return slen;
  }; //noinspection UnnecessaryLocalVariableJS


  var EnglishDateLocale =
  /** @type {MaskedInput~DateLocale} */
  {
    MMM: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    MMMM: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    t: ['a', 'p'],
    tt: ['am', 'pm'],
    T: ['A', 'P'],
    TT: ['AM', 'PM'],
    aria: {
      day: 'Day',
      month: 'Month',
      year: 'Year',
      hour: 'Hour',
      minutes: 'Minutes',
      seconds: 'Seconds',
      ampm: 'Am/Pm'
    }
  };
  MaskedInput.defaults.dateLocale = EnglishDateLocale;
  var DATE_PATTERN_MAP = {
    // d - 1-31
    // dd - 01-31
    dd: {
      pattern: /\bdd?\b/,
      type: MaskedInput.PartType.NUMBER,
      name: 'day',
      maxLength: 2,
      placeholder: function placeholder(match) {
        return repeatChar('d', match.length);
      },
      numericMin: 0,
      // Allow typing in zeroes, like 06
      numericMax: 31,
      wholeNumber: true,
      padding: function padding(match) {
        return match.length;
      },
      postProcess: function postProcess(value) {
        value = parseInt(value);
        if (value < 1 || value > 31) return undefined;
        return value + '';
      },
      ariaLabel: function ariaLabel(match) {
        return (this.option('dateLocale').aria || {}).day;
      }
    },
    MM: {
      // M - 1-12
      // MM - 01-12
      pattern: /\bMM?\b/,
      type: MaskedInput.PartType.NUMBER,
      name: 'month',
      maxLength: 2,
      placeholder: function placeholder(match) {
        return repeatChar('m', match.length);
      },
      numericMin: 0,
      // Allow typing in zeroes, like 06
      numericMax: 12,
      wholeNumber: true,
      padding: function padding(match) {
        return match.length;
      },
      postProcess: function postProcess(value) {
        value = parseInt(value);
        if (value < 1 || value > 12) return undefined;
        return value + '';
      },
      ariaLabel: function ariaLabel(match) {
        return (this.option('dateLocale').aria || {}).month;
      }
    },
    MMM: {
      // MMM - Jan-Dec
      pattern: /\bMMM\b/,
      type: MaskedInput.PartType.TEXT,
      name: 'month',
      placeholder: function placeholder(match) {
        return repeatChar('m', match.length);
      },
      length: function length(match) {
        return maxArrayStringLength(this.option('dateLocale')[match]);
      },
      options: function options(match) {
        return this.option('dateLocale')[match];
      },
      ariaLabel: function ariaLabel(match) {
        return (this.option('dateLocale').aria || {}).month;
      }
    },
    MMMM: {
      // MMMM - January-December
      pattern: /\bMMMM\b/,
      type: MaskedInput.PartType.TEXT,
      name: 'month',
      placeholder: function placeholder(match) {
        return repeatChar('m', match.length);
      },
      length: function length(match) {
        return maxArrayStringLength(this.option('dateLocale')[match]);
      },
      options: function options(match) {
        return this.option('dateLocale')[match];
      },
      ariaLabel: function ariaLabel(match) {
        return (this.option('dateLocale').aria || {}).month;
      }
    },
    yyyy: {
      // yy - 85
      // yyyy - 1985
      pattern: /\byy(?:yy)?\b/,
      type: MaskedInput.PartType.NUMBER,
      name: 'year',
      wholeNumber: true,
      placeholder: function placeholder(match) {
        return repeatChar('y', match.length);
      },
      maxLength: function maxLength(match) {
        return match.length;
      },
      postProcess: function postProcess(value, part) {
        if (part.maxLength === 4) {
          var baseYear = Math.floor(new Date().getFullYear() / 100) * 100;
          var nowYear = new Date().getFullYear();
          var year = parseInt(value, 10);

          if (year < 100) {
            year += baseYear;

            if (year - nowYear > 50) {
              year -= 100;
            } else if (nowYear - year > 50) {
              year += 100;
            }
          }

          return year + '';
        } else {
          return value;
        }
      },
      padding: function padding(match) {
        return match.length;
      },
      ariaLabel: function ariaLabel(match) {
        return (this.option('dateLocale').aria || {}).year;
      }
    },
    HH: {
      // H - 0-24
      // HH - 00-24
      pattern: /\bHH?\b/,
      type: MaskedInput.PartType.NUMBER,
      name: 'hours',
      maxLength: 2,
      placeholder: function placeholder(match) {
        return repeatChar('h', match.length);
      },
      numericMin: 0,
      numericMax: 23,
      wholeNumber: true,
      padding: function padding(match) {
        return match.length;
      },
      ariaLabel: function ariaLabel(match) {
        return (this.option('dateLocale').aria || {}).hour;
      }
    },
    hh: {
      // h - 1-12
      // hh - 01-12
      pattern: /\bhh?\b/,
      type: MaskedInput.PartType.NUMBER,
      name: 'hours_12',
      maxLength: 2,
      placeholder: function placeholder(match) {
        return repeatChar('h', match.length);
      },
      numericMin: 1,
      numericMax: 12,
      wholeNumber: true,
      padding: function padding(match) {
        return match.length;
      },
      ariaLabel: function ariaLabel(match) {
        return (this.option('dateLocale').aria || {}).hour;
      }
    },
    mm: {
      // m - 0-59
      // mm - 00-59
      pattern: /\bmm?\b/,
      type: MaskedInput.PartType.NUMBER,
      name: 'minutes',
      maxLength: 2,
      placeholder: function placeholder(match) {
        return repeatChar('m', match.length);
      },
      numericMin: 0,
      numericMax: 59,
      wholeNumber: true,
      padding: function padding(match) {
        return match.length;
      },
      ariaLabel: function ariaLabel(match) {
        return (this.option('dateLocale').aria || {}).minutes;
      }
    },
    ss: {
      // s - 0-59
      // ss - 00-59
      pattern: /\bss?\b/,
      type: MaskedInput.PartType.NUMBER,
      name: 'seconds',
      maxLength: 2,
      placeholder: function placeholder(match) {
        return repeatChar('s', match.length);
      },
      numericMin: 0,
      numericMax: 59,
      wholeNumber: true,
      padding: function padding(match) {
        return match.length;
      },
      ariaLabel: function ariaLabel(match) {
        return (this.option('dateLocale').aria || {}).seconds;
      }
    },
    tt: {
      // t - a/p
      // tt - am/pm
      // T - A/P
      // TT - AM/PM
      pattern: /\btt?|TT?\b/,
      type: MaskedInput.PartType.TEXT,
      name: 'ampm',
      length: function length(match) {
        return maxArrayStringLength(this.option('dateLocale')[match]);
      },
      options: function options(match) {
        return this.option('dateLocale')[match];
      },
      defaultValue: function defaultValue(match) {
        return this.option('dateLocale')[match][0];
      },
      ariaLabel: function ariaLabel(match) {
        return (this.option('dateLocale').aria || {}).ampm;
      }
    }
  };
  MaskedInput.patternAddons.push(DATE_PATTERN_MAP);
  var _default = MaskedInput;
  /** DATE_END */

  return _default;
});
