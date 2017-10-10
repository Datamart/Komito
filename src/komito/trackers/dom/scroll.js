


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
    if (komito.config['trackScroll']) {
      /** @type {!Object} */ var map = {25: 0, 50: 0, 75: 0, 100: 0};
      /** @type {Element} */ var root = dom.document.documentElement;
      /** @type {Element} */ var body = dom.document.body;
      /** @type {number} */ var depth;

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
