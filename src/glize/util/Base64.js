
/**
 * @fileoverview Base64 utility methods.
 *
 * @see https://en.wikipedia.org/wiki/Base64
 * @see http://google.github.io/styleguide/javascriptguide.xml
 * @see http://developers.google.com/closure/compiler/docs/js-for-compiler
 */


/**
 * Base64 utility methods.
 * @namespace
 * @see https://en.wikipedia.org/wiki/Base64
 */
util.Base64 = {
  /**
   * @type {string}
   * @const
   */
  BASE64_CHARACTER_TABLE:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  /**
   * Encodes string to base64.
   * @param {string} str String to encode.
   * @return {string} Returns encoded string.
   */
  encode: function(str) {
    /** @type {string} */
    var result = dom.context.btoa ? dom.context.btoa(str) : '';

    if (!result) {
      /** @type {!Array.<string>} */
      var table = util.Base64.BASE64_CHARACTER_TABLE.split('');
      /** @type {!Array.<string>} */ var buffer = str.split('');
      /** @type {number} */ var block = 0;
      /** @type {number} */ var index = 0;

      for (; buffer[index | 0] || (table = ['='], index % 1);
           result += table[63 & block >> 8 - index % 1 * 8]) {
        block = block << 8 | str.charCodeAt(index -= -3 / 4);
      }
    }
    return result;
  },

  /**
   * Decodes base64-encoded string.
   * @param {string} str Encoded string.
   * @return {string} Returns decoded string.
   */
  decode: function(str) {
    /** @type {string} */
    var result = dom.context.atob ? dom.context.atob(str) : '';

    if (!result) {
      /** @type {!Array.<string>} */ var buffer = str.split('');
      /** @type {number} */ var bit = 0;
      /** @type {number} */ var counter = 0;
      /** @type {number} */ var index = 0;
      /** @type {string} */ var character = '';
      /** @type {number} */ var i = 0;

      for (; character = buffer[i++];) {
        index = util.Base64.BASE64_CHARACTER_TABLE.indexOf(character);
        if (~index) {
          bit = counter % 4 ? bit * 64 + index : index;
          if (counter++ % 4) {
            result += String.fromCharCode(255 & bit >> (-2 * counter & 6));
          }
        }
      }
    }
    return result;
  }
};
