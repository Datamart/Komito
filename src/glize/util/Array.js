/**
 * @fileoverview Array utility methods.
 *
 * @see http://google.github.io/styleguide/javascriptguide.xml
 * @see http://developers.google.com/closure/compiler/docs/js-for-compiler
 */


/**
 * Array utility methods.
 * @namespace
 */
util.Array = {
  /**
   * Reference to <code>Array.prototype.slice</code>.
   * Used to reduce size after compilation.
   * @type {function(number=, number=): !Array}
   * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.10
   */
  slice: Array.prototype.slice,

  /**
   * Searches the array for the specified element, and returns its position.
   * @param {!Arguments|!Array|!NodeList|string} obj The array-like object.
   * @param {*} element The element to locate in the array.
   * @param {number=} opt_fromIndex The optional index to start the search at.
   * @return {number} Returns the first index at which a given element can be
   *                  found in the array, or -1 if it is not present.
   * @see https://es5.github.io/#x15.4.4.14
   */
  indexOf: function(obj, element, opt_fromIndex) {
    opt_fromIndex = opt_fromIndex | 0;

    /** @type {!Array} */ var list = util.Array.toArray(obj);
    /** @type {number} */ var length = list.length;
    /** @type {function(*, number=): number} */ var fn = list.indexOf;
    /** @type {number} */ var result = fn ?
        fn.call(list, element, opt_fromIndex) : -1;

    if (!fn) {
      for (; opt_fromIndex < length && !~result; opt_fromIndex++) {
        result = list[opt_fromIndex] === element ? opt_fromIndex : result;
      }
    }

    return result;
  },

  /**
   * Determines whether an object is an array.
   * @param {*} obj The object to be checked.
   * @return {boolean} Returns <code>true</code> if an object is an
   *                   array, <code>false</code> if it is not.
   * @see https://es5.github.io/#x15.4.3.2
   */
  isArray: function(obj) {
    /** @type {function(*):boolean} */ var fn = Array['isArray'];

    return fn ?
        fn(obj) : '[object Array]' === Object.prototype.toString.call(obj);
  },

  /**
   * Creates a new array with all elements that pass the test implemented
   * by the provided function.
   * @param {!Arguments|!Array|!NodeList|string} obj The array-like object.
   * @param {function(*, number, !Array):boolean} callback The callback function
   * @param {?Object=} opt_context The optional context object.
   * @return {!Array} Returns filtered array.
   * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.20
   */
  filter: function(obj, callback, opt_context) {
    /** @type {!Array} */ var list = util.Array.toArray(obj);
    /** @type {number} */ var length = list.length;
    /** @type {number} */ var i = 0;
    /** @type {number} */ var j = 0;
    /** @type {function(!Function, ?Object=): !Array} */ var fn = list.filter;
    /** @type {!Array} */ var result = fn ?
        fn.call(list, callback, opt_context) : [];
    /** @type {*} */ var element;

    if (!fn) {
      for (; i < length;) {
        element = list[i++];
        if (callback.call(opt_context, element, i, list)) {
          result[j++] = element;
        }
      }
    }

    return result;
  },

  /**
   * Creates a new array with the results of calling a provided function on
   * every element in this array.
   * @param {!Arguments|!Array|!NodeList|string} obj The array-like object.
   * @param {function(*, number, !Array):*} callback The callback function.
   * @param {?Object=} opt_context The optional context object.
   * @return {!Array} Returns filtered array.
   * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.19
   */
  map: function(obj, callback, opt_context) {
    /** @type {!Array} */ var list = util.Array.toArray(obj);
    /** @type {number} */ var length = list.length;
    /** @type {number} */ var i = 0;
    /** @type {function(!Function, ?Object=): !Array} */ var fn = list.map;
    /** @type {!Array} */ var result = fn ?
        fn.call(list, callback, opt_context) : new Array(length);

    if (!fn) {
      for (; i < length;) {
        result[i] = callback.call(opt_context, list[i], i++, list);
      }
    }

    return result;
  },

  /**
   * Executes a provided function once per array element.
   * @param {!Arguments|!Array|!NodeList|string} obj The array-like object.
   * @param {function(*, number, !Array): *} callback The callback function.
   * @param {?Object=} opt_context The optional context object.
   * @see http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.18
   */
  forEach: function(obj, callback, opt_context) {
    /** @type {!Array} */ var list = util.Array.toArray(obj);
    /** @type {number} */ var length = list.length;
    /** @type {number} */ var i = 0;
    /** @type {function(!Function, ?Object=)} */ var fn = list.forEach;

    if (fn) {
      fn.call(list, callback, opt_context);
    } else {
      for (; i < length;) {
        callback.call(opt_context, list[i], i++, list);
      }
    }
  },

  /**
   * Calls the specified <code>callback</code> function for all the elements
   * in an array-like object <code>obj</code>.
   * @param {!Arguments|!Array|!NodeList|string} obj The array-like object.
   * @param {function(*, *, number, !Array): *} callback The callback function.
   * @param {*=} opt_initial The initial value to use as the first argument
   *     to the first call of the <code>callback</code>.
   * @return {*} Returns accumulated result from the last call to
   *     the <code>callback</code> function.
   * @see http://es5.github.io/#x15.4.4.21
   */
  reduce: function(obj, callback, opt_initial) {
    /** @type {!Array} */ var list = util.Array.toArray(obj);
    /** @type {number} */ var length = list.length;
    /** @type {number} */ var i = arguments.length > 2 ? 0 : 1;
    /** @type {function(!Function, *=): *} */ var fn = list.reduce;

    if (fn) {
      opt_initial = fn.call(list, callback, opt_initial);
    } else {
      opt_initial = i ? list[0] : opt_initial;
      for (; i < length;) {
        opt_initial = callback(opt_initial, list[i], i++, list);
      }
    }

    return opt_initial;
  },

  /**
   * Checks if array contains the given element.
   * @param {!Array} arr The array to test for the presence of the element.
   * @param {*} element The element to search.
   * @return {boolean} Returns <code>true</code> if element is present.
   */
  contains: function(arr, element) {
    return 0 <= util.Array.indexOf(arr, element);
  },

  /**
   * Gets random element from array.
   * @param {!Arguments|!Array|!NodeList|string} obj The array-like object.
   * @return {*} Returns random element from array <code>obj</code>.
   */
  random: function(obj) {
    /** @type {!Array} */ var list = util.Array.toArray(obj);
    return list[Math.random() * list.length | 0];
  },

  /**
   * Converts object <code>obj</code> to <code>Array</code>.
   * @param {!Arguments|!Array|!NodeList|string} obj The array-like object.
   * @return {!Array} Returns <code>obj</code> converted to <code>Array</code>.
   */
  toArray: function(obj) {
    return util.Array.isArray(obj) ?
        /** @type {!Array} */ (obj) : util.Array.slice.call(obj);
  }
};
