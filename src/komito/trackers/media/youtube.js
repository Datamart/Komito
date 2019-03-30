/**
 * @fileoverview Komito Analytics tracker for YouTube player.
 *
 * Searches for IFRAMEs in DOM loaded from '*.youtube.com' domain.
 * Loads YouTube Iframe API script if needed.
 * Adds event listeners to YouTube videos found on webpage.
 * Supported event types: 'play', 'pause' and 'ended'.
 * Sends 'video:youtube' as event category name.
 *
 * @link https://developers.google.com/youtube/iframe_api_reference
 *
 * @link http://google.github.io/styleguide/javascriptguide.xml
 * @link http://developers.google.com/closure/compiler/docs/js-for-compiler
 */



/**
 * Defines <code>komito.trackers.media.youtube</code> constructor.
 * Tracks youtube events on page.
 * @constructor
 */
komito.trackers.media.YouTube = function() {
  /** @const {!RegExp} */ var PATTERN =
      /^(https?:)?\/\/(www\.)?youtube(\-nocookie)?\.com\/(embed|watch|v)/;

  /** @const {string} */
  var PLAYERJS = 'https://www.youtube.com/iframe_api';

  /**
   * Initializes YouTube media tracking.
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
      // Save the reference to the YouTube event listener if it exists.
      var listener = dom.context['onYouTubeIframeAPIReady'];
      dom.context['onYouTubeIframeAPIReady'] = function() {
        listener && listener();
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
   * The 'onStateChange' event listener attached to YouTube player.
   * @param {Event} e The event
   * @private
   */
  function listener_(e) {
    /** @type {string} */ var type = ['ended', 'play', 'pause'][e['data']];

    type && komito.track(
        komito.EVENT_ACTION_TYPE, 'video:youtube',
        type, e.target['getVideoUrl']());
  }

  // Initializing YouTube video events tracking.
  init_();
};
