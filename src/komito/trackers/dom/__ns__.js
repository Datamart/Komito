/**
 * Defines <code>komito.trackers.dom</code> namespace.
 * @namespace
 */
komito.trackers.dom = {
  init: function() {
    komito.trackers.dom.Forms && new komito.trackers.dom.Forms;
    komito.trackers.dom.Links && new komito.trackers.dom.Links;
    komito.trackers.dom.Print && new komito.trackers.dom.Print;
    komito.trackers.dom.Scroll && new komito.trackers.dom.Scroll;
    komito.trackers.dom.Orientation && new komito.trackers.dom.Orientation;
    komito.trackers.dom.AdBlock && new komito.trackers.dom.AdBlock;

    komito.trackers.dom.trackHeartBeat_(+komito.config['sendHeartbeat']);
    komito.trackers.dom.trackErrorPages_();
  },

  /**
   * Tracks heartbeat event.
   * @param {number} interval The heartbeat interval in seconds.
   * @see https://www.w3.org/TR/page-visibility/
   * @private
   */
  trackHeartBeat_: function(interval) {
    if (interval) {
      /** @type {number} */ var timer;
      interval = Math.max(interval, 30);

      dom.events.addEventListener(dom.document, 'visibilitychange', function() {
        if ('visible' === dom.document['visibilityState']) {
          timer = setInterval(function() {
            komito.track(komito.EVENT_ACTION_TYPE, 'heartbeat', interval + 's');
          }, 1E3 * interval);
        } else {
          timer && clearInterval(timer);
        }
      });
    }
  },

  /**
   * Tracks error pages.
   * @private
   */
  trackErrorPages_: function() {
    var page = komito.config['trackErrorPages'] && location.href;

    if (page) {
      (new net.HttpRequest).doHead(/** @type {string} */(page), function(req) {
        if (399 < req.status) {
          komito.track(komito.EVENT_ACTION_TYPE, 'errors', req.status, page);
        }
      });
    }
  }
};
