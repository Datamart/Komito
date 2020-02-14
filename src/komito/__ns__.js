/**
 * @fileoverview Komito Analytics is an enhancement for the most popular
 * analytics software. It unlocks power of digital analytics with additional
 * insights about visitor's behavior.
 *
 * @link http://google.github.io/styleguide/javascriptguide.xml
 * @link http://developers.google.com/closure/compiler/docs/js-for-compiler
 *
 * @link http://developers.google.com/analytics/devguides/collection/gajs
 * @link http://developers.google.com/analytics/devguides/collection/analyticsjs
 * @link http://tongji.baidu.com/open/api/more?p=ref_trackEvent
 *
 * Include script before closing <code>&lt;/body&gt;</code> tag.
 * <code>
 *   &lt;script src="//komito.net/komito.js"&gt;&lt;/script&gt;
 * </code>
 */


/**
 * Defines <code>komito</code> namespace.
 * @namespace
 */
var komito = {
  /**
   * Default tracking options.
   * @type {!Object.<string, !Array|!Function|number|string>}
   * @see komito.config
   */
  DEFAULTS: {
    'trackTwitter': 1,
    'trackFacebook': 1,
    'trackLinkedIn': 1,
    'trackDownloads': 1,
    'trackOutbound': 1,
    'trackForms': 1,
    'trackUsers': 1,
    'trackActions': 1,
    'trackPrint': 1,
    'trackMedia': 1,
    'trackScroll': 1,
    'trackOrientation': 1,
    'trackColorScheme': 1,
    'nonInteraction': [
      'adblock', 'audio', 'color-scheme', 'form', 'heartbeat', 'orientation',
      'print', 'scroll', 'video'],
    'debugMode': /[?&]debug=1/.test(location.search)
    // 'trackAdblock': 0, // Experimental feature.
    // 'trackErrorPages': 0, // Experimental feature.
    // 'sendHeartbeat': 0, // Experimental feature.
    // 'trackingIds': ['List of tracking Ids'],
    // 'onBeforeTrack': function(event) {},
    // 'propIndex': 0,
    // 'trackDynamicContent': 0
  },

  /**
   * List of file extensions treated as downloadable.
   * @const {string}
   */
  DOWNLOADS: ',mp3,mp4,wma,mov,avi,wmv,mkv' + // Media
      ',eot,woff,ttf' +                       // Fonts
      ',txt,csv,tsv' +                        // Text
      ',pdf,doc,docx,xls,xlsx,ppt,pptx' +     // Docs
      ',zip,tar,tgz,bz2,gz,rar,dmg,pkg,7z' +  // Archives
      ',ida,exe,sh,bat,',                     // Other

  /**
   * File extension pattern.
   * @const {!RegExp}
   */
  EXT_PATTERN: /\.([0-9a-z]+)(?:[\?#]|$)/i,

  /**
   * @type {string}
   */
  GA_KEY: dom.context['GoogleAnalyticsObject'] || 'ga',

  /**
   * @const {number}
   */
  EVENT_ACTION_TYPE: 0,

  /**
   * @const {number}
   */
  SOCIAL_ACTION_TYPE: 1,

  /**
   * Sign of registered HTML element.
   * Used to track dynamic content to avoid adding event listeners twice.
   * @const {string}
   */
  REGISTERED_ELEMENT_KEY: 'data-kmt',

  /**
   * Performs trackers function execution.
   * @param {...*} var_args
   *
   * _gaq.push(['_trackEvent', category, action, opt_label, opt_value]);
   * ga('send', 'event', category, action, opt_label, opt_value);
   * __utmTrackEvent(category, action, opt_label, opt_value);
   * ClickTaleEvent('category:action:opt_label:opt_value');
   * _hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
   *
   * _gaq.push(['_trackSocial', network, action, target]);
   * ga('send', 'social', network, action, target);
   * __utmTrackEvent('social:action', network, target);
   * ClickTaleEvent('social:action:network:target');
   * _hmt.push(['_trackEvent', 'social:action', network, target]);
   */
  track: function(var_args) {
    /** @type {?Array} */ var args = komito.getTrackingData_(
        util.Array.toArray(arguments));
    /** @type {!Array} */ var argv;

    if (args) {
      komito.config['gtag'] ? komito.sendGtag_(args) : komito.sendGa_(args);
      komito.sendTagLoader_(args);
      argv = komito.convert_(args);
      komito.send_([dom.context], 'ClickTaleEvent', [argv.join(':')]);
      komito.send_([dom.context], '__utmTrackEvent', argv);
      dom.context['_hmt'] && komito.send_(
          [dom.context['_hmt']], 'push', [['_trackEvent'].concat(argv)]);
      komito.sendClassicGa_(args);
      komito.sendYm_(args);
    }
  },

  /**
   *
   */
  DynamicContentTracker: {
    /**
     * @param {!Function} listener The dynamic content listener.
     */
    track: function(listener) {
      if (komito.config['trackDynamicContent']) {
        /** @type {number} */ var timer = setTimeout(function() {
          timer && clearTimeout(timer);
          listener();
        }, 1E3);
      }
    },

    /**
     * @param {!Element} element An HTML element.
     */
    register: function(element) {
      element.setAttribute(komito.REGISTERED_ELEMENT_KEY, 1);
    },

    /**
     * @param {!Element} element An HTML element.
     * @return {boolean} Returns 'true' if the element is registered.
     */
    isRegistered: function(element) {
      return element.hasAttribute(komito.REGISTERED_ELEMENT_KEY);
    }
  },

  /**
   * Marks event as a non-interaction event.
   * @param {string} event The event name to mark as non-interaction event.
   * @see https://support.google.com/analytics/answer/1033068#NonInteractionEvents
   * @see https://github.com/Datamart/Komito/issues/38
   */
  markAsNonInteractionEvent: function(event) {
    var events = /** @type {?Array} */ (komito.config['nonInteraction']);
    if (events && util.Array.isArray(events) && !util.Array.contains(events, event)) {
      events.push(event);
    }
  },

  /**
   * Initializes extension.
   * @private
   */
  init_: function() {
    if (!komito.initialized_) {
      komito.initialized_ = 1; // Initialize Komito Analytics only once.
      /** @type {string} */ var key = dom.document.readyState;

      function ready() {
        komito.config = dom.context['_komito'] || {};

        for (key in komito.DEFAULTS) {
          if (!(key in komito.config)) {
            komito.config[key] = komito.DEFAULTS[key];
          }
        }

        komito.trackers.dom.init();
        komito.trackers.media.init();
        komito.trackers.social.init();
      }

      'interactive' === key || 'complete' === key ?
          setTimeout(ready, 1E3) :
          dom.events.addEventListener(dom.context, 'DOMContentLoaded', ready);
    }
  },

  /**
   * Performs Adobe Tag Loader execution.
   * @param {!Array} args The arguments to send.
   * @private
   */
  sendTagLoader_: function(args) {
    /** @type {number} */ var index = +komito.config['propIndex'] || 0;
    /** @type {?Function} */ var loader = dom.context['TagLoader'] ||
                                          dom.context['AppMeasurement'];
    /** @type {?Object} */ var tracker = dom.context['s'];
    /** @type {!Array} */ var vars = [];
    /** @type {number} */ var i = 1;
    /** @type {string} */ var key;

    if (loader && tracker && (tracker instanceof loader)) {
      for (; i < args.length; i++) {
        key = 'prop' + (i + index);
        vars.push(key);
        tracker[key] = args[i];
      }

      tracker['linkTrackEvents'] = 'None';
      tracker['linkTrackVars'] = vars.join(',');
      komito.send_(
          [tracker], 'tl', // 'tl' is 'trackLink' method.
          [tracker, 'download' === args[1] ? 'd' : 'o', args[0]]);
    }
  },

  /**
   * Performs Google Analytics execution.
   * @param {!Array} args The arguments to send.
   * @private
   */
  sendGa_: function(args) {
    if ('function' === typeof dom.context[komito.GA_KEY]) {
      /** @type {?Array.<!Object>} */ var trackers =
          dom.context[komito.GA_KEY]['getAll'] &&
          dom.context[komito.GA_KEY]['getAll']();
      /** @type {*} */ var trackingIds = komito.config['trackingIds'];
      /** @type {!Object.<string, boolean>} */ var uniques = {};

      if (trackers && trackingIds) {
        if (!util.Array.isArray(trackingIds)) {
          trackingIds = ['' + trackingIds];
        }

        trackers = util.Array.filter(
            /** @type {!Array.<!Object>} */ (trackers), function(tracker) {
              /** @type {string} */
              var trackingId = tracker['get']('trackingId');
              /** @type {boolean} */ var result = util.Array.contains(
                  /** @type {!Array} */ (trackingIds), trackingId);

              return result;
            });
      }

      trackers = util.Array.filter(
          /** @type {!Array.<!Object>} */ (trackers), function(tracker) {
            /** @type {string} */ var trackingId = tracker['get']('trackingId');
            /** @type {boolean} */ var result = !uniques[trackingId];
            uniques[trackingId] = true;
            return result;
          });

      var data = komito.isNonInteraction_(args) ?
          args.concat([{'nonInteraction': 1}]) : args;
      trackers && komito.send_(trackers, 'send', data);
    }
  },

  /**
   * Sends Google Analytics Events using gtag.js
   * @param {!Array} args The arguments to send.
   * @private
   * @see https://developers.google.com/analytics/devguides/collection/gtagjs/events
   * @see https://developers.google.com/gtagjs/reference/event
   */
  sendGtag_: function(args) {
    /** @type {?Array} */ var dataLayer = dom.context['dataLayer'];

    if (util.Array.isArray(dataLayer) && dataLayer.length > 0) {
      /** @type {string} */ var type = args[0];
      /** @type {string} */ var action = args[2];
      /** @type {!Function} */ var gtag = function() {dataLayer.push(arguments);};

      // Social: ['social', 'network', 'action', 'target']
      // Event: ['event', 'category', 'action', 'label']
      if ('social' === type && action === 'share') {
        gtag('event', action, {
          'method' : args[1],
          'target': args[3],
          'social_target': args[3]
        });
      } else {
        gtag('event', action, {
          'event_category': args[1],
          'event_label': args[3],
          'non_interaction': komito.isNonInteraction_(args)
        });
      }
    } else {
      komito.sendGa_(args);
    }
  },

  /**
   * Performs Classic Google Analytics execution.
   * @param {!Array} args The arguments to send.
   * @private
   */
  sendClassicGa_: function(args) {
    if (dom.context['_gat'] || dom.context['_gaq']) {
      /** @type {?Array.<!Object>} */
      var trackers = dom.context['_gat'] &&
                     dom.context['_gat']['_getTrackers'] &&
                     dom.context['_gat']['_getTrackers']();
      var data = komito.isNonInteraction_(args) ? args.concat([1]) : args;
      data[0] = ({'social': '_trackSocial', 'event': '_trackEvent'})[data[0]];

      if (trackers) {
        komito.send_(trackers, data[0], data.slice(1));
      } else if (dom.context['_gaq']) {
        komito.send_([dom.context['_gaq']], 'push', [data]);
      }
    }
  },

  /**
   * Performs Yandex Metrica execution.
   * @param {!Array} args The arguments to send.
   * @see https://yandex.com/support/metrica/objects/_method-reference.html
   * @see https://yandex.com/support/metrica/objects/extlink.html
   * @see https://yandex.com/support/metrica/objects/file.html
   * @private
   */
  sendYm_: function(args) {
    /** @type {!Array.<!Object>} */ var trackers = [];
    /** @type {string} */ var func = 'params';
    /** @type {string} */ var key;

    for (key in dom.context) {
      if (0 == key.indexOf('yaCounter')) {
        trackers.push(dom.context[key]);
      }
    }

    key = args[1];
    if ('outbound' === key) {
      func = 'extLink';
      args = [args.pop()]; // Outbound link URL.
    } else if ('download' === key) {
      func = 'file';
      args = [args.pop()]; // URL of downloaded file.
    }

    komito.send_(trackers, func, args);
  },

  /**
   * @param {!Array} trackers The list of trackers.
   * @param {string} func The function name.
   * @param {!Array} args The func arguments.
   * @private
   */
  send_: function(trackers, func, args) {
    /** @type {number} */ var length = trackers.length;
    /** @type {?Object} */ var tracker;

    komito.debug_(func, args);
    for (; length;) {
      tracker = trackers[--length];
      if ('function' === typeof tracker[func])
        tracker[func].apply(tracker, args);
    }
  },

  /**
   * Converts 'social' interaction to 'event'.
   * @param {!Array} args The arguments to convert.
   * @return {!Array} Returns converted arguments.
   * @private
   */
  convert_: function(args) {
    /** @type {!Array} */ var argv = [].concat(args);

    if ('social' === argv[0]) {
      // from: ['social', 'network', 'action', 'target']
      // to: ['social', 'social:action', 'network', 'target']
      argv[1] = 'social' + ':' + argv.splice(2, 1, argv[1])[0];
    }

    return argv.slice(1);
  },

  /**
   * @param {...*} var_args Arguments to log.
   * @private
   */
  debug_: function(var_args) {
    /** @type {?Console} */ var logger = dom.context.console;
    if (komito.config['debugMode'] && logger)
      logger.log.apply(logger, arguments);
  },

  /**
   * @param {!Array} args The arguments to send.
   * @return {boolean} Return 'true' if is non interaction event.
   * @private
   */
  isNonInteraction_: function(args) {
    var type = args[1]; // video:html5, cta:mailto, color-scheme, scroll.
    var list = /** @type {!Array} */ (komito.config['nonInteraction']);
    return util.Array.contains(list, type) ||
           util.Array.contains(list, type.split(/\W/)[0]);
  },

  /**
   * Prepares data to send to the trackers.
   * @param {!Array} args The arguments to prepare.
   * @return {?Array} Returns prepared arguments.
   * @private
   */
  getTrackingData_: function(args) {
    args[0] = args[0] ? 'social' : 'event'; // Action type: 1 or 0;

    /** @type {boolean} */ var hasData = true;
    /** @type {!Object.<string, *>} */ var data = {
      'type': args[0],
      'category': args[1],
      'action': args[2],
      'label': args[3],
      'preventDefault': function() {
        hasData = false;
      }
    };

    komito.config['onBeforeTrack'] &&
        /** @type {!Function}*/ (komito.config['onBeforeTrack'])(data);

    return hasData ?
        [data['type'], data['category'], data['action'], data['label']] :
        dom.NULL;
  },

  /**
   * The configuration options.
   * @type {!Object.<string, !Array|!Function|number|string>}
   * @see komito.DEFAULTS
   * @see komito.init_
   */
  config: {}
};

'web.archive.org' !== location.hostname && komito.init_();
