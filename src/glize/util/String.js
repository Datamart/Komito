/**
 * @fileoverview String utility methods.
 *
 * @see http://google.github.io/styleguide/javascriptguide.xml
 * @see http://developers.google.com/closure/compiler/docs/js-for-compiler
 */


/**
 * String utility methods.
 * @namespace
 */
util.String = {
  /**
   * Trims leading and trailing whitespace from the given string.
   * @param {string} str The string to trim.
   * @return {string} Returns the string stripped of whitespace.
   * @see {@link http://www.ecma-international.org/ecma-262/5.1/#sec-15.5.4.20}
   */
  trim: function(str) {
    return str.trim ? str.trim() : util.String.trimRight(
        util.String.trimLeft(str));
  },

  /**
   * Removes whitespace from the left end of the string.
   * @param {string} str The string to trim.
   * @return {string} Returns the string stripped of whitespace from left end.
   */
  trimLeft: function(str) {
    return str.trimLeft ? str.trimLeft() : str.replace(/^[\s\xa0]+/, '');
  },

  /**
   * Removes whitespace from the right end of the string.
   * @param {string} str The string to trim.
   * @return {string} Returns the string stripped of whitespace from right end.
   */
  trimRight: function(str) {
    return str.trimRight ? str.trimRight() : str.replace(/[\s\xa0]+$/, '');
  },

  /**
   * Checks whether <code>str</code> starts with <code>prefix</code>.
   * @param {string} str The string to be checked.
   * @param {string} prefix A string to look for at the start of
   *     <code>str</code>.
   * @return {boolean} Returns <code>true</code> if string <code>str</code>
   *     starts with the <code>prefix</code>.
   */
  startsWith: function(str, prefix) {
    return 0 === str.lastIndexOf(prefix, 0);
  },

  /**
   * Checks whether <code>str</code> ends with <code>suffix</code>.
   * @param {string} str The string to be checked.
   * @param {string} suffix A string to look for at the end of <code>str</code>.
   * @return {boolean} Returns <code>true</code> if string <code>str</code>
   *     ends with the <code>suffix</code>.
   */
  endsWith: function(str, suffix) {
    /** @type {number} */ var index = str.lastIndexOf(suffix);
    return 0 <= index && index === str.length - suffix.length;
  },

  /**
   * Transforms the first character of each word to uppercase; other
   * characters are unaffected..
   * @param {string} str The string to be transformed.
   * @return {string} Returns transformed string.
   * @see http://www.w3.org/wiki/CSS/Properties/text-transform
   */
  capitalize: function(str) {
    /** @type {!Array.<string>} */ var words = str.split(/\s+/);
    /** @type {number} */ var length = words.length;
    /** @type {number} */ var i = 0;
    /** @type {string} */ var word;

    for (; i < length; ++i) {
      word = words[i];
      words[i] = word.charAt(0).toUpperCase() + word.slice(1);
    }

    return words.join(' ');
  }
};
