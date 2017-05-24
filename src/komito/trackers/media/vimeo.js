/**
 * @fileoverview Komito Analytics tracker for Vimeo player.
 *
 * Searches for IFRAMEs in DOM loaded from 'player.vimeo.com' domain.
 * Loads Vimeo Player API if needed.
 * Adds event listeners to Vimeo players for videos found on webpage.
 * Supported event types: 'play', 'pause' and 'ended'.
 * Sends 'video:vimeo' as event category name.
 *
 * @link https://github.com/vimeo/player.js
 *
 * @link http://google.github.io/styleguide/javascriptguide.xml
 * @link http://developers.google.com/closure/compiler/docs/js-for-compiler
 */



/**
 * Tracks vimeo events on page.
 * @constructor
 */
komito.trackers.media.Vimeo = function() {

  /** @const {!RegExp} */
  var PATTERN = /^(https?:)?\/\/player\.vimeo\.com\/video\/\d+/;

  /** @const {string} */
  var PLAYERJS = 'https://player.vimeo.com/api/player.js';

  /**
   * Initializes Vimeo player events tracking.
   * @private
   */
  function init_() {
    /** @type {NodeList} */
    var elements = dom.getElementsByTagName(dom.document, 'IFRAME');
    /** @type {number} */ var length = elements.length;
    /** @type {!Array.<HTMLIFrameElement>} */ var iframes = [];
    /** @type {HTMLIFrameElement} */ var element;

    for (; length;) {
      element = elements[--length];
      if (PATTERN.test(element.src))
        iframes.push(element);
    }

    if (iframes.length) {
      if (dom.context['Vimeo'] && dom.context['Vimeo']['Player']) {
        initListeners_(iframes);
      } else {
        dom.scripts.load(PLAYERJS, function() {
          initListeners_(iframes);
        });
      }
    }
  }

  /**
   * Initializes event listeners.
   * @param {!Array.<HTMLIFrameElement>} iframes The list of found iframes.
   * @private
   */
  function initListeners_(iframes) {
    var Player = dom.context['Vimeo'] && dom.context['Vimeo']['Player'];

    if (Player) {
      /** @type {number} */ var length = iframes.length;
      /** @type {HTMLIFrameElement} */ var element;

      for (; length;) {
        element = iframes[--length];
        addListeners_(new Player(element), element.src.split('?')[0]);
      }
    }
  }

  /**
   * Adds event listener for Vimeo player.
   * @param {!Object} player The instance of 'Vimeo.Player'.
   * @param {string} video The video source URL.
   * @private
   */
  function addListeners_(player, video) {
    player['on']('ended', function() {
      komito.track(komito.EVENT_ACTION_TYPE, 'video:vimeo', 'ended', video);
    });
    player['on']('play', function() {
      komito.track(komito.EVENT_ACTION_TYPE, 'video:vimeo', 'play', video);
    });
    player['on']('pause', function() {
      komito.track(komito.EVENT_ACTION_TYPE, 'video:vimeo', 'pause', video);
    });
  }

  // Initializing Vimeo player events tracking.
  init_();
};
