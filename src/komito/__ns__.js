
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
 *   &lt;script src="//datamart.github.io/Komito/komito.js"&gt;&lt;/script&gt;
 * </code>
 */


/**
 * Defines <code>komito</code> namespace.
 * @namespace
 */
var komito = {
  /**
   * Default tracking options.
   * @type {!Object.<string, number>}
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
    'debugMode': /[?&]debug=1/.test(location.search)
  },

  /**
   * List of file extensions treated as downloadable.
   * @const {string}
   */
  DOWNLOADS: ',mp3,mp4,wma,mov,avi,wmv,mkv' +       // Media
      ',eot,woff,ttf' +                      // Fonts
      ',txt,csv,tsv' +                       // Text
      ',pdf,doc,docx,xls,xlsx,ppt,pptx' +    // Docs
      ',zip,tar,tgz,bz2,gz,rar,dmg,pkg,7z' + // Archives
      ',ida,exe,sh,bat,',                    // Other

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
   * Initializes extension.
   * @private
   */
  init_: function() {
    for (/** @type {string} */ var key in komito.DEFAULTS) {
      if (!(key in komito.config)) {
        komito.config[key] = komito.DEFAULTS[key];
      }
    }

    komito.trackers.dom.init();
    komito.trackers.social.init();
    komito.trackers.media.init();
  },

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
    /** @type {!Array} */ var args = util.Array.toArray(arguments);
    /** @type {Array.<Object>} */ var trackers;
    /** @type {Array} */ var argv;

    args[0] = args[0] ? 'social' : 'event';
    // args[0] = ['event', 'social', 'ecom', 'campaign'][args[0]];

    if ('function' === typeof dom.context[komito.GA_KEY]) {
      trackers = dom.context[komito.GA_KEY]['getAll'] &&
                 dom.context[komito.GA_KEY]['getAll']();
      trackers && komito.send_(trackers, 'send', args);
    }

    komito.sendTagLoader_(args);
    argv = komito.convert_(args);
    komito.send_([dom.context], 'ClickTaleEvent', [argv.join(':')]);
    komito.send_([dom.context], '__utmTrackEvent', argv);
    dom.context['_hmt'] && komito.send_(
        [dom.context['_hmt']], 'push', [['_trackEvent'].concat(argv)]);
    komito.sendClassicGA_(args);
  },

  /**
   * Performs Adobe Tag Loader execution.
   * @param {Array} args The arguments to send.
   * @private
   */
  sendTagLoader_: function(args) {
    /** @type {Function} */ var loader = dom.context['TagLoader'];
    /** @type {Object} */ var tracker = dom.context['s'];
    /** @type {!Array} */ var vars = [];
    /** @type {number} */ var i = 1;
    /** @type {string} */ var key;

    if (loader && tracker && (tracker instanceof loader)) {
      for (; i < args.length; i++) {
        key = 'prop' + i;
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
   * Performs Classic Google Analytics execution.
   * @param {Array} args The arguments to send.
   * @private
   */
  sendClassicGA_: function(args) {
    if (dom.context['_gat'] || dom.context['_gaq']) {
      /** @type {Array.<Object>} */
      var trackers = dom.context['_gat'] &&
                     dom.context['_gat']['_getTrackers'] &&
                     dom.context['_gat']['_getTrackers']();
      args[0] = ({'social': '_trackSocial', 'event': '_trackEvent'})[args[0]];
      if (trackers) {
        komito.send_(trackers, args[0], args.slice(1));
      } else if (dom.context['_gaq']) {
        komito.send_([dom.context['_gaq']], 'push', [args]);
      }
    }
  },

  /**
   * @param {!Array} trackers The list of trackers.
   * @param {string} func The function name.
   * @param {!Array} args The func arguments.
   * @private
   */
  send_: function(trackers, func, args) {
    /** @type {number} */ var length = trackers.length;
    /** @type {Object} */ var tracker;

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

    if ('social' == argv[0]) {
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
    /** @type {Console} */ var logger = dom.context.console;
    if (komito.config['debugMode'] && logger)
      logger.log.apply(logger, arguments);
  },

  /**
   * The configuration options.
   * @type {!Object.<string, number>}
   * @see komito.DEFAULTS
   */
  config: dom.context['_komito'] || {}
};

setTimeout(komito.init_, 1e3);
