


/**
 * Defines <code>komito.trackers.media.youtube</code> constructor.
 * Tracks youtube events on page.
 * @see https://developers.google.com/youtube/iframe_api_reference
 * @constructor
 */
komito.trackers.media.YouTube = function() {
  /** @const {!RegExp} */ var PATTERN =
      /^(https?:)?\/\/(www\.)?youtube(\-nocookie)?\.com\/(embed|watch|v)/;

  /** @const {string} */
  var PLAYERJS = 'https://www.youtube.com/iframe_api';

  /**
   * Initializes youtube media tracking.
   * @private
   */
  function init_() {
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
      if (PATTERN.test(source)) {
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
              'onStateChange', listener_);
        }
      };

      dom.context['YT'] || dom.scripts.load(PLAYERJS);
    }
  }

  /**
   * @param {Event} e The event
   * @private
   */
  function listener_(e) {
    /** @type {string} */ var type = ['ended', 'play', 'pause'][e['data']];

    type && komito.track(
        komito.EVENT_ACTION_TYPE, 'video:youtube',
        type, e.target['getVideoUrl']());
  }

  // Initializing youtube video events tracking.
  init_();
};
