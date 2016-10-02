/**
 * Defines <code>komito.trackers.social.linkedin</code> namespace.
 * @namespace
 */
komito.trackers.social.linkedin = {
  /**
   * Tries to attach listener to LinkedIn plugin if it presents on page.
   * @see https://developer.linkedin.com/plugins
   */
  track: function() {
    /**
     * @param {Element} element The script element.
     * @param {string} action The social action type.
     */
    function subscribe(element, action) {
      /** @type {string} */ var type = 'onsuccess';
      /** @type {string} */ var cb = ['cb', type, action, +new Date].join('_');
      element[type] = (element[type] ? element[type] + ',' : '') + cb;
      dom.context[cb] = function() {
        komito.track(
            komito.SOCIAL_ACTION_TYPE, 'LinkedIn', action, location.href);
      };
    }

    /** @type {!Array|NodeList} */
    var elements = dom.getElementsByTagName(dom.document, 'SCRIPT');
    /** @type {number} */ var length = elements.length;
    /** @type {number} */ var i = 0;
    /** @type {Element} */ var element;
    /** @type {string} */ var type;

    for (; i < length;) {
      element = elements[i++];
      type = (element.getAttribute('type') || '').toLowerCase();
      (!type.indexOf('in/')) && subscribe(element, type.substr(3));
    }
  }
};
