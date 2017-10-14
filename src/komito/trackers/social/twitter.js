


/**
 * Defines <code>komito.trackers.social.Twitter</code> constructor.
 * @constructor
 */
komito.trackers.social.Twitter = function() {
  /**
   * List of Twitter events to track.
   * @const {!Array.<string>}
   * @see https://dev.twitter.com/web/javascript/events
   */
  var EVENTS = ['tweet', 'retweet', 'like', 'follow'];

  /**
   * Mapping of event's data keys.
   * @const {!Object.<string, string>}
   */
  var DATA_KEYS = {
    'follow': 'screen_name',
    'retweet': 'source_tweet_id',
    'like': 'tweet_id',
    'tweet': 'url'
  };

  /**
   * Tries to attach listener to Twitter widget object if it presents on page.
   * @see https://dev.twitter.com/web/javascript/events
   * @private
   */
  function init_() {
    if (9 > counter_++) {
      if (dom.context['twttr'] && dom.context['twttr']['ready']) {
        dom.context['twttr']['ready'](function(twttr) {
          var config = komito.config['trackTwitter'];
          var type;
          var data;
          var key;

          var events = /** @type {!Array.<string>} */ (
              util.Array.isArray(config) ? config : EVENTS);

          util.Array.forEach(events, function(event) {
            twttr['events']['bind'](event, function(e) {
              type = e['type'];
              if (!fired_[type]) {
                fired_[type] = 1;
                key = DATA_KEYS[type];
                data = (key && e['data'] && e['data'][key]) || location.href;
                komito.track(komito.SOCIAL_ACTION_TYPE, 'Twitter', type, data);
              }
            });
          });
        });
      } else setTimeout(init_, 5e3);
    }
  }


  /**
   * @type {number}
   * @private
   */
  var counter_ = 0;

  /**
   * @type {!Object.<string, number>}
   * @private
   */
  var fired_ = {};

  // Initializing Twitter events tracking.
  init_();
};
