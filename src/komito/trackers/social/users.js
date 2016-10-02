/**
 * Defines <code>komito.trackers.social.users</code> namespace.
 * @namespace
 */
komito.trackers.social.users = {
  /**
   * Tracks pageviews by users logged in to social networks.
   * @private
   */
  track: function() {
    /** @type {number} */ var sent = 0;
    /** @type {number} */ var attempts = 5;
    /** @type {string} */ var network;

    /**
     * @param {string} network The social network name.
     */
    function pageview(network) {
      komito.track(
          komito.SOCIAL_ACTION_TYPE, network, 'pageview', location.href);
    }

    /**
     * @param {Image} image The image object.
     * @param {string} network The social network name.
     */
    function subscribe(image, network) {
      dom.events.addEventListener(image, dom.events.TYPE.LOAD, function() {
        pageview(network);
      });
      image.src = komito.trackers.social.USERS[network];
    }

    /**
     * @param {function(function(Object))} fn Facebook getLoginStatus function.
     */
    function getStatus(fn) {
      fn(function(response) {
        if (response && 'unknown' !== response['status'] && !sent++)
          pageview('Facebook');
      });
    }

    function status() {
      /** @type {function(function(Object))} */
      var fn = dom.context['FB'] && dom.context['FB']['getLoginStatus'];
      if (fn) {
        getStatus(fn);

        dom.events.addEventListener(dom.context, 'message', function(e) {
          try {
            if ('facebook.com' === e['origin'].substr(-12) &&
                e['data'] &&
                ~e['data'].indexOf('xd_action=proxy_ready')) {
              getStatus(fn);
            }
          } catch (ex) {}
        });

      } else if (--attempts) {
        setTimeout(status, 2e3);
      }
    }

    for (network in komito.trackers.social.USERS) {
      subscribe(new Image(1, 1), network);
    }

    status();
  }
};
