


/**
 * Defines <code>komito.trackers.social.Users</code> constructor.
 * @constructor
 */
komito.trackers.social.Users = function() {

  /**
   * Mapping for tracking logged in users.
   * @type {!Object.<string, string>}
   */
  var USERS = {
    'Google': 'https://accounts.google.com/CheckCookie?continue=' +
        'https%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fimages%2Flogos%2F' +
        'accounts_logo.png&amp;followup=https%3A%2F%2Fwww.google.com%2F' +
        'intl%2Fen%2Fimages%2Flogos%2Faccounts_logo.png&amp;' +
        'chtml=LoginDoneHtml&amp;checkedDomains=youtube&amp;' +
        'checkConnection=youtube%3A291%3A1',
    'Google+': 'https://plus.google.com/up/?continue=' +
        'https%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fimages%2Flogos%2F' +
        'accounts_logo.png',
    'Twitter': 'https://twitter.com/login?redirect_after_login=' +
        'https%3A%2F%2Fplatform.twitter.com%2Fwidgets%2Fimages%2Fbtn.png'
  };

  /**
   * Tracks pageviews by users logged in to social networks.
   * @private
   */
  function init_() {
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
     * @param {HTMLImageElement|Image} image The image object.
     * @param {string} network The social network name.
     */
    function subscribe(image, network) {
      dom.events.addEventListener(image, dom.events.TYPE.LOAD, function() {
        pageview(network);
      });
      image.src = USERS[network];
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

    for (network in USERS) {
      /** @type {HTMLImageElement|Image} */ var image = new Image(1, 1);
      // if ('Twitter' == network) {
      //   // https://www.w3.org/TR/referrer-policy/
      //   image = /** @type {HTMLImageElement} */ (dom.createElement('IMG'));
      //   image.setAttribute('referrerpolicy', 'no-referrer');
      //   image.setAttribute('crossorigin', 'anonymous');
      // }
      subscribe(image, network);
    }

    status();
  }

  // Initializing Users events tracking.
  init_();
};
