/**
 * @fileoverview Date utility methods.
 *
 * @see http://google.github.io/styleguide/javascriptguide.xml
 * @see http://developers.google.com/closure/compiler/docs/js-for-compiler
 */


/**
 * Date utility methods.
 * @namespace
 */
util.Date = {
  /**
   * Shortcut for <code>Date</code> constructor.
   * Used to reduce size after compilation.
   * @constructor
   */
  DateTime: Date,

  /**
   * Shortcut for <code>new Date()</code>.
   * Used to reduce size after compilation.
   * @return {!Date} Returns current <code>Date</code> object.
   */
  getDate: function() {
    return new util.Date.DateTime;
  },

  /**
   * @return {number} Returns the number of milliseconds elapsed since
   *                  1 January 1970 00:00:00 UTC.
   * @see https://es5.github.io/x15.9.html#x15.9.4.4
   */
  now: function() {
    return +util.Date.getDate();
  },

  /**
   * Converts a <code>date</code> object into a string using the ISO standard.
   * As alternative method {@link formatters.DateFormatter.format} can be used.
   * @param {!Date} date The date to format.
   * @return {string} Returns a string in simplified extended ISO format.
   * @see https://es5.github.io/x15.9.html#x15.9.5.43
   * @see https://en.wikipedia.org/wiki/ISO_8601
   * @see formatters.DateFormatter.format
   * @example
   * var date = new Date(2013, 5, 15, 13, 30);
   * var iso = '2013-06-15T13:30:00.000Z';
   * util.Date.toISOString(date) == iso;
   * formatters.DateFormatter.format(date, 'YYYY-MM-ddThh:mm:ss.000Z') == iso;
   */
  toISOString: function(date) {
    /** @type {function():string} */ var fn = date['toISOString'];

    return fn ? fn.call(date) :
        (1e3 - ~date.getUTCMonth() * 10 + date.toUTCString() + 1e3 + date / 1).
        replace(/1(..).*?(\d\d)\D+(\d+).(\S+).*(...)/, '$3-$1-$2T$4.$5Z');
  },

  /**
   * Converts 24-hour time string to 12-hour time string.
   * @param {string} time The time string ("00:30", "01:45", "12:00", "22:15").
   * @return {string} Return converted 24-hour time string to 12-hour time.
   * @example
   * util.Date.toAmPmTime('00:30'); // 12:30 AM
   * util.Date.toAmPmTime('01:15'); // 1:15 AM
   * util.Date.toAmPmTime('11:45'); // 11:45 AM
   * util.Date.toAmPmTime('12:15'); // 12:15 PM
   * util.Date.toAmPmTime('13:15'); // 1:15 PM
   * util.Date.toAmPmTime('23:15'); // 11:15 PM
   */
  toAmPmTime: function(time) {
    /** @type {string} */ var hours = time.slice(0, 2);
    return (hours % 12 || 12) + ':' + time.slice(3, 5) + ' ' +
           (12 > hours ? 'AM' : 'PM');
  },

  /**
   * Gets week date.
   * @param {!Date=} opt_date The optional date object.
   * @return {string} Returns week date in ISO 8601 format.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Week_dates
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   * @example
   * var weekDate = util.Date.getWeekDate(new Date(2015, 9, 26));
   * var expected = '2015-W44';
   * weekDate == expected;
   */
  getWeekDate: function(opt_date) {
    opt_date = opt_date || util.Date.getDate();
    /** @type {number} */ var number = util.Date.getWeekNumber(opt_date);
    /** @type {string} */ var week = ('0' + number).slice(-2);

    return opt_date.getFullYear() + '-W' + week;
  },

  /**
   * Gets week number.
   * @param {!Date=} opt_date The optional date object.
   * @return {number} Returns week number.
   * @see https://en.wikipedia.org/wiki/ISO_8601#Week_dates
   * @see https://en.wikipedia.org/wiki/ISO_week_date
   */
  getWeekNumber: function(opt_date) {
    opt_date = opt_date || util.Date.getDate();
    opt_date.setHours(0, 0, 0, 0);
    opt_date.setDate(opt_date.getDate() + 3 - (opt_date.getDay() + 6) % 7);
    /** @type {!Date} */ var jan4 = new Date(opt_date.getFullYear(), 0, 4);
    /** @type {number} */ var diff = opt_date - jan4;

    return 1 + Math.round((diff / 864e5 - 3 + (jan4.getDay() + 6) % 7) / 7);
  },

  /**
   * Converts value to Date object.
   * NOTE: Currently supported only ISO 8601 week date format.
   * @param {string} value The value to convert.
   * @return {!Date} Returns converted value to Date object.
   * @see util.Date.getWeekDate
   * @example
   * var date = util.Date.toDate('2015-W44');
   * var str = 'Mon Oct 26 2015 00:00:00 GMT+0200 (EET)';
   * date.toString() == str;
   */
  toDate: function(value) {
    /** @type {?Array.<string>} */
    var weekDate = value.match(/^([12]\d{3})\-w([012345]\d)(\-\d+)*$/i);
    /** @type {number} */ var year;
    /** @type {number} */ var week;
    /** @type {!Date} */ var date;
    /** @type {number} */ var offset;

    if (weekDate) {
      year = +weekDate[1];
      week = +weekDate[2];

      date = new Date(year, 0, 1 + (week - 1) * 7);
      offset = date.getDay() <= 4 ? 1 : 8;
      date.setDate(date.getDate() - date.getDay() + offset);
    }

    return date;
  }
};
