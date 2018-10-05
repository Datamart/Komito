/**
 * @fileoverview Tracks pageviews with blocked ads.
 */



/**
 * Defines <code>komito.trackers.dom.AdBlock</code> constructor.
 * @constructor
 */
komito.trackers.dom.AdBlock = function() {

  /**
   * Initializes orientation tracking.
   * @private
   */
  function init_() {
    if (komito.config['trackAdblock']) {
      var node = dom.appendChild(dom.document.body, dom.createElement('ins'));
      node.id = 'ad-container';
      node.className = 'Adsense';
      node.style.position = 'absolute';
      node.style.display = 'block';
      node.style.top = '-1px';
      node.style.height = '1px';
      node.innerHTML = '<img src="data:image/svg+xml,%3Csvg/%3E" id="ad" ' +
                       'class="banner" height="5" width="5">';

      setTimeout(function() {
        node.offsetHeight < 5 && komito.track(
            komito.EVENT_ACTION_TYPE, 'adblock', 'pageview', location.href);
        dom.removeNode(node);
      }, 1E3);
    }
  }

  // Initializing adblock tracking.
  init_();
};
