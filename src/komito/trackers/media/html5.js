/**
 * @fileoverview Komito Analytics tracker for HTML5 media elements.
 *
 * Adds DOM event listeners to <audio> and <video> elements found on webpage.
 * Supported event types: 'play', 'pause', 'ended' and 'fullscreenchange'.
 * Sends 'audio:html5' and 'video:html5' as event category name.
 *
 * @link http://html.spec.whatwg.org/multipage/embedded-content.html#mediaevents
 * @link http://developer.mozilla.org/en-US/docs/Web/Events/fullscreenchange
 *
 * @link http://google.github.io/styleguide/javascriptguide.xml
 * @link http://developers.google.com/closure/compiler/docs/js-for-compiler
 */



/**
 * Defines <code>komito.trackers.media.html5</code> constructor.
 * Tracks media (video and audio) events on page.
 * @constructor
 */
komito.trackers.media.HTML5 = function() {

  /**
   * Initializes HTML5 media tracking.
   * @private
   */
  function init_() {
    /** @type {!Array.<string>} */ var events = [
      'ended', 'pause', 'play',
      'webkitfullscreenchange', 'mozfullscreenchange', 'fullscreenchange'];
    /** @type {!Array.<!Element>} */ var elements = toArray_('AUDIO', 'VIDEO');

    /** @type {number} */ var length = elements.length;
    /** @type {!Element} */ var element;
    /** @type {string} */ var type;
    /** @type {number} */ var i;

    /** @param {?Event} e The event */
    function listener(e) {
      element = /** @type {!Element} */ (dom.events.getEventTarget(e));
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
      if (!komito.DynamicContentTracker.isRegistered(element)) {
        komito.DynamicContentTracker.register(element);
        for (i = 0; i < 6;) { // 6 == events.length
          dom.events.addEventListener(element, events[i++], listener);
        }
      }
    }

    komito.DynamicContentTracker.track(init_);
  }

  /**
   * Creates an array of element by specified tag names.
   * @param {...string} var_args The elements tag names to convert.
   * @return {!Array.<!Element>} Returns converted elements to array.
   * @private
   */
  function toArray_(var_args) {
    /** @type {!Array.<!Element>} */ var elements = [];
    /** @type {number} */ var length = arguments.length;
    /** @type {?NodeList} */ var nodes;
    /** @type {number} */ var i;

    for (; length;) {
      nodes = dom.getElementsByTagName(dom.document, arguments[--length]);
      for (i = 0; i < nodes.length;) {
        elements.push(nodes[i++]);
      }
    }

    return elements;
  }

  // Initializing HTML5 media events tracking.
  init_();
};
