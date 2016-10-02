

/**
 * Defines <code>komito.trackers.social.facebook</code> namespace.
 * @namespace
 */
komito.trackers.social.facebook = {
  /**
   * Tries to attach listener to Facebook widget object if it presents on page.
   * http://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe
   */
  track: function() {

    /** @param {string} action The Facebook event type. */
    function listener(action) {
      komito.track(
          komito.SOCIAL_ACTION_TYPE, 'Facebook', action, location.href);
    }

    if (komito.trackers.social.facebook.counter_++ < 9) {
      /** @type {Object} */ var fb = dom.context['FB'];
      /** @type {!function(string, Function)} */
      var subscribe = fb && fb['Event'] && fb['Event']['subscribe'];
      if (subscribe) {
        try {
          subscribe('edge.create', function() { listener('like'); });
          subscribe('edge.remove', function() { listener('unlike'); });
          subscribe('message.send', function() { listener('message'); });
        } catch (e) {}
      } else setTimeout(komito.trackers.social.facebook.track, 5e3);
    }
  },

  /**
   * @type {number}
   * @private
   */
  counter_: 0
};
