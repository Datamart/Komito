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
   * @type {!Object.<string, number|string|Array>}
   * @see komito.config
   */
  DEFAULTS: {
    'trackTwitter': 1,
    'trackFacebook': 0,
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
    'trackAdblock': 0, // Experimental feature.
    'trackHeartBeat': 0, // Experimental feature.
    // 'trackingIds': ['List of tracking Ids'],
    'nonInteraction': [
      'form', 'print', 'scroll', 'video', 'orientation',
      'adblock', 'heartbeat'],
    'debugMode': /[?&]debug=1/.test(location.search)
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
    /** @type {Array} */ var argv;
    args[0] = args[0] ? 'social' : 'event'; // Action type: 1 or 0;

    komito.sendGa_(args);
    komito.sendTagLoader_(args);
    argv = komito.convert_(args);
    komito.send_([dom.context], 'ClickTaleEvent', [argv.join(':')]);
    komito.send_([dom.context], '__utmTrackEvent', argv);
    dom.context['_hmt'] && komito.send_(
        [dom.context['_hmt']], 'push', [['_trackEvent'].concat(argv)]);
    komito.sendClassicGa_(args);
    komito.sendYm_(args);
  },

  /**
   * Initializes extension.
   * @private
   */
  init_: function() {
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
   * Performs Google Analytics execution.
   * @param {!Array} args The arguments to send.
   * @private
   */
  sendGa_(args) {
    if ('function' === typeof dom.context[komito.GA_KEY]) {
      /** @type {Array.<Object>} */ var trackers =
          dom.context[komito.GA_KEY]['getAll'] &&
          dom.context[komito.GA_KEY]['getAll']();
      /** @type {*} */ var trackingIds = komito.config['trackingIds'];
      /** @type {!Object.<string, boolean>} */ var uniques = {};

      if (trackers && trackingIds) {
        if (!util.Array.isArray(trackingIds)) {
          trackingIds = ['' + trackingIds];
        }

        trackers = util.Array.filter(trackers, function(tracker) {
          /** @type {string} */ var trackingId = tracker['get']('trackingId');
          /** @type {boolean} */ var result = util.Array.contains(
              /** @type {!Array} */ (trackingIds), trackingId);
          return result;
        });
      }

      trackers = util.Array.filter(trackers, function(tracker) {
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
   * Performs Classic Google Analytics execution.
   * @param {!Array} args The arguments to send.
   * @private
   */
  sendClassicGa_: function(args) {
    if (dom.context['_gat'] || dom.context['_gaq']) {
      /** @type {Array.<Object>} */
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
    /** @type {!Array.<Object>} */ var trackers = [];
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
    /** @type {Console} */ var logger = dom.context.console;
    if (komito.config['debugMode'] && logger)
      logger.log.apply(logger, arguments);
  },

  /**
   * @param {!Array} args The arguments to send.
   * @return {boolean} Return 'true' if is non interaction event.
   * @private
   */
  isNonInteraction_: function(args) {
    var type = args[1].split(/\W/)[0]; // video:html5, cta:mailto, scroll.
    var list = komito.config['nonInteraction'];
    return util.Array.contains(/** @type {!Array} */ (list), type);
  },

  /**
   * The configuration options.
   * @type {!Object.<string, number|string|Array>}
   * @see komito.DEFAULTS
   * @see komito.init_
   */
  config: {}
};

'web.archive.org' !== location.hostname && komito.init_();
