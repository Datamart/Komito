/**
 * Defines <code>komito.trackers.media.youtube</code> namespace.
 * Tracks youtube events on page.
 * @see https://developers.google.com/youtube/iframe_api_reference
 * @namespace
 */
komito.trackers.media.youtube = {
  /** @const {!RegExp} */ PATTERN:
      /^(https?:)?\/\/(www\.)?youtube(\-nocookie)?\.com\/(embed|watch|v)/,

  /** @const {string} */
  PLAYERJS: 'https://www.youtube.com/iframe_api',

  /**
   * Initializes youtube media tracking.
   */
  init: function() {
    /** @type {!Array|NodeList} */
    var elements = dom.getElementsByTagName(dom.document, 'IFRAME');
    /** @type {number} */ var length = elements.length;
    /** @type {number} */ var i = 0;
    /** @type {!Array} */ var iframes = [];
    /** @type {HTMLIFrameElement} */ var element;
    /** @type {string} */ var source;

    for (; i < length;) {
      element = elements[i++];
      source = element.src;
      if (komito.trackers.media.youtube.PATTERN.test(source)) {
        if (0 > source.indexOf('enablejsapi')) {
          element.src += (~source.indexOf('?') ? '&' : '?') + 'enablejsapi=1';
        }
        iframes.push(element);
      }
    }

    length = iframes.length;
    if (length) {
      dom.context['onYouTubeIframeAPIReady'] = function() {
        for (i = 0; i < length;) {
          dom.events.addEventListener(
              new dom.context['YT']['Player'](iframes[i++]),
              'onStateChange', komito.trackers.media.youtube.listener_);
        }
      };

      if (!dom.context['YT']) {
        dom.scripts.load(komito.trackers.media.youtube.PLAYERJS);
      }
    }
  },

  /**
   * @param {Event} e The event
   * @private
   */
  listener_: function(e) {
    /** @type {string} */ var type = ['ended', 'play', 'pause'][e['data']];

    type && komito.track(
        komito.EVENT_ACTION_TYPE, 'video:youtube',
        type, e.target['getVideoUrl']());
  }
};
