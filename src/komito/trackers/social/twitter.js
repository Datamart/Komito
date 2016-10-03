


/**
 * Defines <code>komito.trackers.social.Twitter</code> constructor.
 * @constructor
 */
komito.trackers.social.Twitter = function() {
  /**
   * Tries to attach listener to Twitter widget object if it presents on page.
   * @see https://dev.twitter.com/docs/tfw/events
   * @private
   */
  function init_() {
    /** @type {!Object.<string, number>} */ var events = {};
    /** @type {string} */ var type;
    /** @type {Object.<string, *>} */ var data;
    /** @type {Array} */ var params;

    if (counter_++ < 9) {
      if (dom.context['twttr'] && dom.context['twttr']['ready']) {
        if (!dom.context['__twitterIntentHandler']) {
          dom.events.addEventListener(dom.context, 'message', function(e) {
            try {
              if ('twitter.com' === e['origin'].substr(-11) && e['data']) {
                data = util.StringUtils.JSON.parse(e['data']);
                params = data && data['params'];
                if (params && 'trigger' === data['method']) {
                  type = params[0];
                  if ('click' === type && params[1]) {
                    type += '-' + params[1]['region'];
                  }

                  if (!events[type]) {
                    events[type] = 1;
                    komito.track(
                        komito.SOCIAL_ACTION_TYPE, 'Twitter',
                        type, location.href);
                  }
                }
              }
            } catch (ex) {}
          });

          dom.context['twttr']['ready'](function(twttr) {
            twttr['events']['bind']('message', function() {});
          });
          dom.context['__twitterIntentHandler'] = true;
        }
      } else setTimeout(init_, 5e3);
    }
  }

  /**
   * @type {number}
   * @private
   */
  var counter_ = 0;

  // Initializing Twitter events tracking.
  init_();
};
