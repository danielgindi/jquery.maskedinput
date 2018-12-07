/*!
 * maskedinput.js 1.0.8
 * git://github.com/danielgindi/jquery.maskedinput.git
 */

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["./jquery.maskedinput.core"], factory);
  } else if (typeof exports !== "undefined") {
    module.exports = factory(require("./jquery.maskedinput.core"));
  } else {
    var mod = {
      exports: {}
    };
    mod.exports = factory(global.jqueryMaskedinputCore);;
    global.MaskedInput = mod.exports;
  }
})(this, function (_jqueryMaskedinput) {
  'use strict';

  
  _jqueryMaskedinput = _interopRequireDefault(_jqueryMaskedinput);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  _jqueryMaskedinput.default.defaults.dateLocale = EnglishDateLocale;
  var DATE_PATTERN_MAP = {
    // d - 1-31
    // dd - 01-31
    dd: {
      pattern: /\bdd?\b/,
      type: _jqueryMaskedinput.default.PartType.NUMBER,
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
      type: _jqueryMaskedinput.default.PartType.NUMBER,
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
      type: _jqueryMaskedinput.default.PartType.TEXT,
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
      type: _jqueryMaskedinput.default.PartType.TEXT,
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
      type: _jqueryMaskedinput.default.PartType.NUMBER,
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
      type: _jqueryMaskedinput.default.PartType.NUMBER,
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
      type: _jqueryMaskedinput.default.PartType.NUMBER,
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
      type: _jqueryMaskedinput.default.PartType.NUMBER,
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
      type: _jqueryMaskedinput.default.PartType.NUMBER,
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
      type: _jqueryMaskedinput.default.PartType.TEXT,
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

  _jqueryMaskedinput.default.patternAddons.push(DATE_PATTERN_MAP);

  var _default = _jqueryMaskedinput.default;
  /** DATE_END */

  return _default;
});
