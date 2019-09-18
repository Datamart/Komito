


/**
 * Defines <code>komito.trackers.dom.scroll</code> constructor.
 * @constructor
 */
komito.trackers.dom.Scroll = function() {

  /**
   * Initializes scroll tracking.
   * @private
   */
  function init_() {
    /** @type {!Array|!Function|number|string} */
    var trackScroll = komito.config['trackScroll'];
    if (trackScroll) {
      /** @type {!Array.<number>} */ var percentages = [25, 50, 75, 100];
      if (util.Array.isArray(trackScroll)) {
        percentages = /** @type {!Array.<number>} */ (trackScroll);
      }

      /** @type {?Element} */ var root = dom.document.documentElement;
      /** @type {?Element} */ var body = dom.document.body;
      /** @type {!Object} */ var map = {};
      /** @type {number} */ var depth = percentages.length;
      for (; depth--;) { map[percentages[depth]] = 0; }

      dom.events.addEventListener(
          dom.context, dom.events.TYPE.SCROLL, function() {
            var screenHeight = root.clientHeight || dom.context.innerHeight;
            var scrollHeight = root.scrollHeight || body.offsetHeight;
            var scrollTop = root.scrollTop || body.scrollTop;
            var percent = scrollTop / (scrollHeight - screenHeight) * 100;
            depth = ~~(percent / 25) * 25;
            if (depth && depth in map && !map[depth]) {
              map[depth] = 1;
              komito.track(
                  komito.EVENT_ACTION_TYPE, 'scroll', 'depth', depth + '%');
            }
          });
    }
  }

  // Initializing print events tracking.
  init_();
};
