
/**
 * @fileoverview Defines compressors utility methods.
 *
 * @see http://google.github.io/styleguide/javascriptguide.xml
 * @see http://developers.google.com/closure/compiler/docs/js-for-compiler
 */


/**
 * Defines compressors utility methods.
 * @namespace
 */
var compressors = {

  /**
   * Compress data string using specified compression type.
   * @param {string} data Data to compress.
   * @param {string=} opt_type Optional compression type.
   * @return {string} Returns compressed data.
   */
  compress: function(data, opt_type) {
    opt_type = opt_type || compressors.TYPE.LZW;
    /** @type {string} */ var result;

    if (compressors.TYPE.LZW === opt_type) {
      result = compressors.LZW.compress(data);
    }
    return result;
  },

  /**
   * Decompress data string using specified compression type.
   * @param {string} data Data to compress.
   * @param {string=} opt_type Optional compression type.
   * @return {string} Returns compressed data.
   */
  decompress: function(data, opt_type) {
    opt_type = opt_type || compressors.TYPE.LZW;
    /** @type {string} */ var result;

    if (compressors.TYPE.LZW === opt_type) {
      result = compressors.LZW.decompress(data);
    }
    return result;
  }
};


/**
 * Enumeration of available compression types.
 * @enum {string}
 */
compressors.TYPE = {
  LZW: 'lzw'
};


/**
 * LZW compression utility.
 * @see http://en.wikipedia.org/wiki/Lempel–Ziv–Welch
 * @namespace
 */
compressors.LZW = {

  /**
   * Encodes string using LZW algorithm.
   * @param {string} str The input string.
   * @return {string} Returns compressed string using LZW algorithm.
   */
  compress: function(str) {
    /** @type {!Object.<string, number>} */ var dict = {};
    /** @type {!Array.<string>} */ var data = str.split('');
    /** @type {!Array} */ var out = [];
    /** @type {number} */ var code = 256;
    /** @type {string} */ var phrase = data.shift();
    /** @type {number} */ var i = 0;
    /** @type {string} */ var next;

    while (data.length) {
      next = data.shift();
      if (dom.NULL != dict[phrase + next]) {
        phrase += next;
      } else {
        out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
        dict[phrase + next] = code++;
        phrase = next;
      }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (; i < out.length; i++) {
      out[i] = String.fromCharCode(/** @type {number} */ (out[i]));
    }

    return out.join('');
  },

  /**
   * Decodes string encoded with LZW algorithm.
   * @param {string} str The input string encoded with LZW algorithm.
   * @return {string} Returns decoded string.
   * @static
   */
  decompress: function(str) {
    /** @type {!Object} */ var dict = {};
    /** @type {!Array.<string>} */ var data = str.split('');
    /** @type {!Array.<string>} */ var out = [data.shift()];
    /** @type {number} */ var code = 256;
    /** @type {string} */ var chr = out[0];
    /** @type {string} */ var tmp = chr;
    /** @type {number} */ var i = 0;
    /** @type {number} */ var next;
    /** @type {string} */ var phrase;

    for (; i < data.length; i++) {
      next = data[i].charCodeAt(0);
      phrase = next < 256 ? data[i] : (dict[next] ? dict[next] : (tmp + chr));
      out.push(phrase);
      chr = phrase.charAt(0);
      dict[code++] = tmp + chr;
      tmp = phrase;
    }

    return out.join('');
  }
};
