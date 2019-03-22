


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
  komito.trackers.social.Facebook.init(init_);
};


/**
 * Gets Facebook App ID.
 * @return {string} Returns Facebook App ID.
 * @private
 */
komito.trackers.social.Facebook.getAppId_ = function() {
  var appId = komito.trackers.social.Facebook.appId_;

  if (!appId) {
    appId = komito.config['trackFacebook'];

    if (appId) {
      appId = '' + appId;
      if (appId.length < 9) {
        var nodes = dom.getElementsByTagName(dom.document, 'META');
        var array = util.Array.toArray(nodes);
        var length = array.length;
        var node;
        for (; length--;) {
          node = array[length];
          // <meta property="fb:app_id" content="490025408049997">
          if ('fb:app_id' == node.getAttribute('property')) {
            appId = node.getAttribute('content');
            break;
          }
        }
      }
    }

    komito.trackers.social.Facebook.appId_ = appId.length < 9 ? '' : appId;
  }

  return /** @type {string} */ (komito.trackers.social.Facebook.appId_);
};


/**
 * Loads and initializes Facebook SDK.
 * @param {!Function} callback The callback function.
 * @see https://developers.facebook.com/docs/javascript/quickstart
 * @see https://developers.facebook.com/docs/javascript/reference/FB.init/v3.2
 */
komito.trackers.social.Facebook.init = function(callback) {
  /** @type {string} */ var appId;

  if (!dom.context['FB']) {
    appId = komito.trackers.social.Facebook.getAppId_();
    if (appId) {
      /** @type {Element} */ var script = dom.createElement('SCRIPT');
      script.async = 1;
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk.js#' +
                   'xfbml=1&version=v3.2' +
                   '&appId=' + appId + '&status=1&cookie=1';
      dom.appendChild(dom.document.body, script);
      setTimeout(callback, 3E3);
    }
  }

  appId || callback();
};
