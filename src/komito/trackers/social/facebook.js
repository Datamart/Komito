


/**
 * Defines <code>komito.trackers.social.Facebook</code> constructor.
 * @constructor
 */
komito.trackers.social.Facebook = function() {
  /**
   * Tries to attach listener to Facebook widget object if it presents on page.
   * http://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe
   * @private
   */
  function init_() {
    if (counter_++ < 9) {
      /** @type {Object} */ var fb = dom.context['FB'];
      /** @type {!function(string, Function)} */
      var subscribe = fb && fb['Event'] && fb['Event']['subscribe'];
      if (subscribe) {
        try {
          subscribe('edge.create', function() { listener_('like'); });
          subscribe('edge.remove', function() { listener_('unlike'); });
          subscribe('message.send', function() { listener_('message'); });
        } catch (e) {}
      } else setTimeout(init_, 5e3);
    }
  }

  /**
   * @param {string} action The Facebook event type.
   * @private
   */
  function listener_(action) {
    komito.track(
        komito.SOCIAL_ACTION_TYPE, 'Facebook', action, location.href);
  }

  /**
   * @type {number}
   * @private
   */
  var counter_ = 0;

  // Initializing Facebook events tracking.
  init_();
};
