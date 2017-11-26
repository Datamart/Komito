/**
 * @fileoverview The orientation tracking plug-in.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
 * @see https://developer.mozilla.org/en-US/docs/Web/Events/orientationchange
 */



/**
 * Defines <code>komito.trackers.dom.Orientation</code> constructor.
 * @constructor
 */
komito.trackers.dom.Orientation = function() {
  /** @const {string} */ var EVENT = 'orientationchange';
  /** @const {string} */ var QUERY = '(orientation: portrait)';

  /**
   * Initializes orientation tracking.
   * @private
   */
  function init_() {
    if (komito.config['trackOrientation']) {
      /** @type {function(string):MediaQueryList} */
      var matchMedia = dom.context['matchMedia'];
      mql_ = matchMedia && matchMedia(QUERY);

      komito.track(
          komito.EVENT_ACTION_TYPE, 'orientation', 'initial', getType_(mql_));

      mql_ ?
          mql_['addListener'](listener_) :
          dom.events.addEventListener(dom.context, EVENT, listener_);
    }
  }

  /**
   * @param {Event} e The orientation change event.
   * @private
   */
  function listener_(e) {
    komito.track(
        komito.EVENT_ACTION_TYPE, 'orientation', 'change', getType_(e));

    mql_ ?
        mql_['removeListener'](listener_) :
        dom.events.removeEventListener(dom.context, EVENT, listener_);

    mql_ = listener_ = dom.NULL;
  }

  /**
   * @param {Event|MediaQueryList} e The orientation event.
   * @return {string} Return current orientation type.
   * @see http://developer.mozilla.org/en-US/docs/Web/API/ScreenOrientation/type
   * @private
   */
  function getType_(e) {
    /** @type {ScreenOrientation} */ var orientation = screen['orientation'] ||
        screen['mozOrientation'] ||
        screen['msOrientation'];
    /** @type {string} */ var type = orientation ? orientation['type'] :
        (e['matches'] ? 'portrait' : 'landscape');

    return type.split('-')[0];
  }

  /**
   * @type {MediaQueryList}
   * @private
   */
  var mql_;

  // Initializing orientation events tracking.
  init_();
};
