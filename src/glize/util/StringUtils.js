/**
 * @fileoverview Miscellaneous String utility methods.
 *
 * @see http://google.github.io/styleguide/javascriptguide.xml
 * @see http://developers.google.com/closure/compiler/docs/js-for-compiler
 */


/**
 * Miscellaneous String utility methods.
 * @namespace
 */
util.StringUtils = {
  /**
   * Converts HTML to plain text.
   * @param {string} str The input string.
   * @return {string} Converted string.
   * @static
   */
  toPlainText: function(str) {
    return str.replace(/<|>/gm, function(m) {
      return '&' + ('<' == m ? 'l' : 'g') + 't;';
    });
  },

  /**
   * Converts <code>obj</code> to query string.
   * @param {!Object} obj The key-value pairs object.
   * @param {string=} opt_prefix Optional query prefix.
   * @return {string} Returns query string or empty string if no parameters
   *     given.
   * @static
   */
  toQueryString: function(obj, opt_prefix) {
    /** @type {string} */ var result = opt_prefix || '?';
    /** @type {string} */ var key;

    for (key in obj) {
      result += util.StringUtils.URI.encode(key) + '=' +
          util.StringUtils.URI.encode(obj[key]) + '&';
    }

    return result.slice(0, -1);
  },

  /**
   * Generates a random UUID (v4).
   * @return {string} Returns generated random UUID.
   * @link http://en.wikipedia.org/wiki/Universally_unique_identifier
   * @link http://en.wikipedia.org/wiki/Globally_unique_identifier
   * @link http://www.ietf.org/rfc/rfc4122.txt
   * @static
   */
  uuid: function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      /** @type {number} */ var r = Math.random() * 16 | 0;
      return ('x' == c ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },

  /**
   * Converts <code>str</code> to hashed string.
   * @param {string} str The input string.
   * @return {string} Returns hashed string.
   * @static
   */
  hash: function(str) {
    /** @type {number} */ var result = 0;
    /** @type {number} */ var length = str.length;
    /** @type {number} */ var j = 0;
    /** @type {number} */ var i = 0;

    for (; i < length;) {
      result ^= str.charCodeAt(i++) << j;
      j += 8;
      j %= 24;
    }

    return result.toString(36).toUpperCase();
  },

  /**
   * Methods to manipulate with UTF-8 strings.
   * @type {!Object.<string, function(string): string>}
   * @static
   */
  UTF8: {
    /**
     * @param {string} str String to encode.
     * @return {string} Returns encoded string.
     * @static
     */
    encode: function(str) {
      return unescape(util.StringUtils.URI.encode(str));
    },

    /**
     * @param {string} str String to decode.
     * @return {string} Returns decoded string.
     * @static
     */
    decode: function(str) {
      return util.StringUtils.URI.decode(escape(str));
    }
  },

  /**
   * Methods to manipulate with URI strings.
   * @type {!Object.<string, function(string): string>}
   * @static
   */
  URI: {
    /**
     * @param {string} str String to encode.
     * @return {string} Returns encoded string.
     * @static
     */
    encode: encodeURIComponent || escape,

    /**
     * @param {string} str String to decode.
     * @return {string} Returns decoded string.
     * @static
     */
    decode: decodeURIComponent || unescape
  }
};


/**
 * Simple implementation of JSON methods.
 * @type {!Object.<string, function(string):string>}
 * @namespace
 */
util.StringUtils.JSON = {
  /**
   * This method parses a JSON text to produce an object or array.
   * @param {string} value String to parse.
   * @return {?Object} Returns parsed object from string.
   */
  parse: function(value) {
    return /** @type {?Object} */ ((dom.context.JSON ?
        JSON.parse(value) : eval('(' + value + ')')) || dom.NULL);
  },

  /**
   * This method produces a JSON text from a JavaScript value.
   * @param {*} obj Any JavaScript value, usually an object or array.
   * @return {string} Returns serialized object as string.
   */
  stringify: dom.context.JSON ? JSON.stringify : function(obj) {
    /** @type {string} */ var type = typeof obj;
    /** @type {!Array.<string>} */ var buffer = [];
    /** @type {boolean} */ var isArray;
    /** @type {string} */ var result;
    /** @type {string} */ var key;
    /** @type {string|?Object} */ var value;

    if ('object' !== type || dom.NULL === obj) {
      result = 'string' === type ? '"' + obj + '"' : '' + obj;
    } else {
      isArray = util.Array.isArray(obj);
      for (key in obj) {
        value = obj[key];
        type = typeof value;
        if ('string' === type) {
          value = '"' + value + '"';
        } else if ('object' === type && dom.NULL !== value) {
          value = util.StringUtils.JSON.stringify(/** @type {!Object}*/ (value));
        }
        buffer.push((isArray ? '' : '"' + key + '":') + value);
      }

      result = (isArray ? '[' : '{') + buffer + (isArray ? ']' : '}');
    }

    return result;
  }
};


/**
 * Converts string to a byte array.
 * @param {string} str The input string.
 * @return {!Array.<number>} Returns byte array.
 */
util.StringUtils.toByteArray = function(str) {
  /** @type {!Array.<number>} */ var result = [];
  /** @type {number} */ var i = 0;
  /** @type {number} */ var length = str.length;

  for (; i < length;) {
    /** @type {number} */ var code = str.charCodeAt(i++);
    if (128 > code) {
      result.push(code);
    } else if (2048 > code) {
      result.push((code >> 6) | 192);
      result.push((code & 63) | 128);
    } else if (65535 >= code) {
      result.push((code >> 12) | 224); // 192 + 32
      result.push(((code >> 6) & 63) | 128);
      result.push((code & 63) | 128);
    } else {
      result.push((code >> 18) | 240); // 224 + 16
      result.push(((code >> 12) & 63) | 128);
      result.push(((code >> 6) & 63) | 128);
      result.push((code & 63) | 128);
    }
  }
  return result;
};
