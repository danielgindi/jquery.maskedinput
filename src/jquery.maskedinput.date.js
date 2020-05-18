'use strict';

import MaskedInput from './jquery.maskedinput.core';

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

const repeatChar = function (char, length) {
    let out = '';
    for (let i = 0; i < length; i++) {
        out += char;
    }
    return out;
};

const maxArrayStringLength = function (array) {
    let slen = 0;
    for (let i = 0; i < array.length; i++) {
        if (array[i].length > slen) {
            slen = array[i].length;
        }
    }
    return slen;
};

//noinspection UnnecessaryLocalVariableJS
const EnglishDateLocale = /** @type {MaskedInput~DateLocale} */ {
    MMM: [
        'Jan', 'Feb', 'Mar',
        'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep',
        'Oct', 'Nov', 'Dec',
    ],
    MMMM: [
        'January', 'February', 'March',
        'April', 'May', 'June',
        'July', 'August', 'September',
        'October', 'November', 'December',
    ],
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
        ampm: 'Am/Pm',
    },
};

MaskedInput.defaults.dateLocale = EnglishDateLocale;

const DATE_PATTERN_MAP = {
    // d - 1-31
    // dd - 01-31
    dd: {
        pattern: /\bdd?\b/,
        type: MaskedInput.PartType.NUMBER,
        name: 'day',
        maxLength: 2,
        placeholder: function (match) {
            return repeatChar('d', match.length);
        },
        numericMin: 0, // Allow typing in zeroes, like 06
        numericMax: 31,
        wholeNumber: true,
        padding: function (match) {
            return match.length;
        },
        postProcess: function (value) {
            value = parseInt(value);
            if (value < 1 || value > 31) return undefined;
            return value + '';
        },
        ariaLabel: function (_match) {
            return (this.option('dateLocale').aria || {}).day;
        },
    },
    MM: {
        // M - 1-12
        // MM - 01-12
        pattern: /\bMM?\b/,
        type: MaskedInput.PartType.NUMBER,
        name: 'month',
        maxLength: 2,
        placeholder: function (match) {
            return repeatChar('m', match.length);
        },
        numericMin: 0, // Allow typing in zeroes, like 06
        numericMax: 12,
        wholeNumber: true,
        padding: function (match) {
            return match.length;
        },
        postProcess: function (value) {
            value = parseInt(value);
            if (value < 1 || value > 12) return undefined;
            return value + '';
        },
        ariaLabel: function (_match) {
            return (this.option('dateLocale').aria || {}).month;
        },
    },
    MMM: {
        // MMM - Jan-Dec
        pattern: /\bMMM\b/,
        type: MaskedInput.PartType.TEXT,
        name: 'month',
        placeholder: function (match) {
            return repeatChar('m', match.length);
        },
        length: function (match) {
            return maxArrayStringLength(this.option('dateLocale')[match]);
        },
        options: function (match) {
            return this.option('dateLocale')[match];
        },
        ariaLabel: function (_match) {
            return (this.option('dateLocale').aria || {}).month;
        },
    },
    MMMM: {
        // MMMM - January-December
        pattern: /\bMMMM\b/,
        type: MaskedInput.PartType.TEXT,
        name: 'month',
        placeholder: function (match) {
            return repeatChar('m', match.length);
        },
        length: function (match) {
            return maxArrayStringLength(this.option('dateLocale')[match]);
        },
        options: function (match) {
            return this.option('dateLocale')[match];
        },
        ariaLabel: function (_match) {
            return (this.option('dateLocale').aria || {}).month;
        },
    },
    yyyy: {
        // yy - 85
        // yyyy - 1985
        pattern: /\byy(?:yy)?\b/,
        type: MaskedInput.PartType.NUMBER,
        name: 'year',
        wholeNumber: true,
        placeholder: function (match) {
            return repeatChar('y', match.length);
        },
        maxLength: function (match) {
            return match.length;
        },
        postProcess: function (value, part) {

            if (part.maxLength === 4) {
                const baseYear = Math.floor((new Date()).getFullYear() / 100) * 100;
                const nowYear = new Date().getFullYear();

                let year = parseInt(value, 10);

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
        padding: function (match) {
            return match.length;
        },
        ariaLabel: function (_match) {
            return (this.option('dateLocale').aria || {}).year;
        },
    },
    HH: {
        // H - 0-24
        // HH - 00-24
        pattern: /\bHH?\b/,
        type: MaskedInput.PartType.NUMBER,
        name: 'hours',
        maxLength: 2,
        placeholder: function (match) {
            return repeatChar('h', match.length);
        },
        numericMin: 0,
        numericMax: 23,
        wholeNumber: true,
        padding: function (match) {
            return match.length;
        },
        ariaLabel: function (_match) {
            return (this.option('dateLocale').aria || {}).hour;
        },
    },
    hh: {
        // h - 1-12
        // hh - 01-12
        pattern: /\bhh?\b/,
        type: MaskedInput.PartType.NUMBER,
        name: 'hours_12',
        maxLength: 2,
        placeholder: function (match) {
            return repeatChar('h', match.length);
        },
        numericMin: 1,
        numericMax: 12,
        wholeNumber: true,
        padding: function (match) {
            return match.length;
        },
        ariaLabel: function (_match) {
            return (this.option('dateLocale').aria || {}).hour;
        },
    },
    mm: {
        // m - 0-59
        // mm - 00-59
        pattern: /\bmm?\b/,
        type: MaskedInput.PartType.NUMBER,
        name: 'minutes',
        maxLength: 2,
        placeholder: function (match) {
            return repeatChar('m', match.length);
        },
        numericMin: 0,
        numericMax: 59,
        wholeNumber: true,
        padding: function (match) {
            return match.length;
        },
        ariaLabel: function (_match) {
            return (this.option('dateLocale').aria || {}).minutes;
        },
    },
    ss: {
        // s - 0-59
        // ss - 00-59
        pattern: /\bss?\b/,
        type: MaskedInput.PartType.NUMBER,
        name: 'seconds',
        maxLength: 2,
        placeholder: function (match) {
            return repeatChar('s', match.length);
        },
        numericMin: 0,
        numericMax: 59,
        wholeNumber: true,
        padding: function (match) {
            return match.length;
        },
        ariaLabel: function (_match) {
            return (this.option('dateLocale').aria || {}).seconds;
        },
    },
    tt: {
        // t - a/p
        // tt - am/pm
        // T - A/P
        // TT - AM/PM
        pattern: /\btt?|TT?\b/,
        type: MaskedInput.PartType.TEXT,
        name: 'ampm',
        length: function (match) {
            return maxArrayStringLength(this.option('dateLocale')[match]);
        },
        options: function (match) {
            return this.option('dateLocale')[match];
        },
        defaultValue: function (match) {
            return this.option('dateLocale')[match][0];
        },
        ariaLabel: function (_match) {
            return (this.option('dateLocale').aria || {}).ampm;
        },
    },
};

MaskedInput.patternAddons.push(DATE_PATTERN_MAP);

export default MaskedInput;
