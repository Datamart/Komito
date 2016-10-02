/**
 * Defines <code>komito.trackers.media.html5</code> namespace.
 * Tracks media (video and audio) events on page.
 * @namespace
 */
komito.trackers.media.html5 = {

  /**
   * Initializes html5 media tracking.
   */
  init: function() {
    /** @type {!Array.<string>} */ var events = [
      'ended', 'pause', 'play',
      'webkitfullscreenchange', 'mozfullscreenchange', 'fullscreenchange'];
    /** @type {!Array} */ var elements =
        komito.trackers.media.html5.toArray_('AUDIO', 'VIDEO');

    /** @type {number} */ var length = elements.length;
    /** @type {Element} */ var element;
    /** @type {string} */ var type;
    /** @type {number} */ var i;

    /** @param {Event} e The event */
    function listener(e) {
      element = /** @type {Element} */ (dom.events.getEventTarget(e));
      type = e.type;

      if (~type.indexOf('fullscreen')) {
        type = (dom.document['fullScreen'] || dom.document['mozFullScreen'] ||
                dom.document['webkitIsFullScreen']) ? 'fullscreen' : '';
      }

      type && komito.track(
          komito.EVENT_ACTION_TYPE, element.tagName.toLowerCase() + ':html5',
          type, element['currentSrc'] || element['src']);
    }

    for (; length--;) {
      element = elements[length];
      for (i = 0; i < 6;) { // 6 == events.length
        dom.events.addEventListener(element, events[i++], listener);
      }
    }
  },

  /**
   * @param {...string} var_args The elements tag names to convert.
   * @return {!Array} Returns converted elements to array.
   * @private
   */
  toArray_: function(var_args) {
    /** @type {!Array} */ var elements = [];
    /** @type {number} */ var length = arguments.length;
    /** @type {Array|NodeList} */ var nodes;
    /** @type {number} */ var i;

    for (; length;) {
      nodes = dom.getElementsByTagName(dom.document, arguments[--length]);
      for (i = 0; i < nodes.length;) {
        elements.push(nodes[i++]);
      }
    }

    return elements;
  }
};

