
/**
 * @fileoverview The Komito Collector is a tool to unlock the power of
 * digital analytics. It enriches analytics data with important information
 * about visitor's behavior.
 * @link http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml
 * @link http://developers.google.com/closure/compiler/docs/js-for-compiler
 * @link http://developers.google.com/analytics/devguides/collection/gajs
 * @link http://developers.google.com/analytics/devguides/collection/analyticsjs
 * @link http://tongji.baidu.com/open/api/more?p=ref_trackEvent
 *
 * Include script before closing &lt;/body&gt; tag.
 * <code>
 *   &lt;script src="//datamart.github.io/Komito/komito.js"&gt;&lt;/script&gt;
 * </code>
 */


/**
 * @param {!Window} win The shortcut for 'window' object.
 * @param {!HTMLDocument} doc The shortcut for 'document' object.
 * @param {Location} loc The shortcut for 'location' object.
 */
(function(win, doc, loc) {

  /**
   * Default tracking options.
   * @type {!Object.<string, number>}
   */
  var DEFAULTS = {
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
    'debugMode': 0
  };

  /**
   * Map of social networks.
   * @type {!Object.<string, string>}
   */
  var NETWORKS = {
    'plus.google.com': 'Google+',
    'plus.url.google.com': 'Google+',
    'blogspot.com': 'Blogger',
    'facebook.com': 'Facebook',
    'on.fb.me': 'Facebook',
    'fb.me': 'Facebook',
    'fb.com': 'Facebook',
    'twitter.com': 'Twitter',
    't.co': 'Twitter',
    'linkedin.com': 'LinkedIn',
    'myspace.com': 'MySpace',
    'vk.com': 'VKontakte',
    'odnoklassniki.ru': 'Odnoklassniki',
    'xing.com': 'Xing',
    'youtube.com': 'YouTube',
    'youtu.be': 'YouTube',
    'twoo.com': 'Twoo',
    'reddit.com': 'Reddit',
    'pinterest.com': 'Pinterest',
    'digg.com': 'Digg',
    '4sq.com': 'Foursquare',
    'foursquare.com': 'Foursquare',
    'hi.baidu.com': 'Baidu Space'
  };

  /**
   * Mapping for tracking logged in users.
   * For Facebook users see "users_" method.
   * @type {!Object.<string, string>}
   * @see users_
   */
  var USERS = {
    'Google': 'https://accounts.google.com/CheckCookie?continue=' +
        'https%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fimages%2Flogos%2F' +
        'accounts_logo.png&amp;followup=https%3A%2F%2Fwww.google.com%2F' +
        'intl%2Fen%2Fimages%2Flogos%2Faccounts_logo.png&amp;' +
        'chtml=LoginDoneHtml&amp;checkedDomains=youtube&amp;' +
        'checkConnection=youtube%3A291%3A1',
    'Google+': '//plus.google.com/up/?continue=' +
        'https%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fimages%2Flogos%2F' +
        'accounts_logo.png',
    'Twitter': '//twitter.com/login?redirect_after_login=' +
        'https%3A%2F%2Fplatform.twitter.com%2Fwidgets%2Fimages%2Fbtn.png'
  };

  /**
   * List of file extensions treated as downloadable.
   * @const
   * @type {string}
   */
  var DOWNLOADS = ',mp3,mp4,wma,mov,avi,wmv,mkv' +       // Media
                  ',eot,woff,ttf' +                      // Fonts
                  ',txt,csv,tsv' +                       // Text
                  ',pdf,doc,docx,xls,xlsx,ppt,pptx' +    // Docs
                  ',zip,tar,tgz,bz2,gz,rar,dmg,pkg,7z' + // Archives
                  ',ida,exe,sh,bat,';                    // Other

  /**
   * File extension pattern.
   * @const
   * @type {!RegExp}
   */
  var EXT_PATTERN = /\.([0-9a-z]+)(?:[\?#]|$)/i;

  /**
   * @type {string}
   */
  var GA_KEY = win['GoogleAnalyticsObject'] || 'ga';

  /**
   * @const
   * @type {number}
   */
  var EVENT_ACTION_TYPE = 0;

  /**
   * @const
   * @type {number}
   */
  var SOCIAL_ACTION_TYPE = 1;

  /**
   * Initializes extension.
   * @private
   */
  function init_() {
    /** @type {number} */ var i = 0;
    /** @type {NodeList|HTMLCollection} */ var elements = getElements_('A');
    /** @type {number} */ var length = elements[length_];
    /** @type {string} */ var key;

    for (key in DEFAULTS) {
      if (!(key in config_))
        config_[key] = DEFAULTS[key];
    }

    for (; i < length;)
      link_(/** @type {!HTMLAnchorElement} */ (elements[i++]), i);

    if (config_['trackForms']) {
      elements = doc.forms;
      length = elements[length_];
      for (i = 0; i < length;)
        form_(/** @type {!HTMLFormElement} */ (elements[i++]), i);
    }

    config_['trackTwitter'] && twitter_();
    config_['trackFacebook'] && facebook_();
    config_['trackLinkedIn'] && linkedin_();
    config_['trackUsers'] && users_();
    config_['trackPrint'] && print_();
    config_['trackMedia'] && media_();
    config_['trackScroll'] && scroll_();
  }

  /**
   * Attaches event listener if passed link is outbound, social or downloadable.
   * The attached listener sends event to trackers.
   * @param {!HTMLAnchorElement} link The link element.
   * @param {number} index The link collection index.
   * @private
   */
  function link_(link, index) {
    /** @type {string} */ var proto = link.protocol[slice_](0, -1);
    /** @type {string} */ var href = link[href_];
    /** @type {string} */ var host = link.hostname;
    /** @type {!Array.<string>} */ var path = link.pathname.split('/');
    /** @type {boolean} */ var isHttp = /^https?$/.test(proto);
    /** @type {string} */ var social = NETWORKS[host.replace('www.', '')];
    /** @type {string} */
    var ext = (href.match(EXT_PATTERN) || ['']).pop()[lower_]();
    /** @type {number} */
    var trackExt = ext ? ~DOWNLOADS[index_](',' + ext + ',') : 0;
    /** @type {string} */var type;

    if (config_['trackOutbound'] && isHttp && !~host[index_](loc.hostname)) {
      addEvent_(link, mousedown_, function() {
        type = 'outbound';
        exec_(EVENT_ACTION_TYPE, type, host, href, index);
        if (social) {
          if ('twitter.com' === host[substr_](-11) &&
              'intent' === path[path.length - 2])
            type = 'intent-' + path.pop();
          exec_(SOCIAL_ACTION_TYPE, social, type, href);
        }
      });
    }

    if (config_['trackDownloads'] && trackExt) {
      addEvent_(link, mousedown_, function() {
        exec_(EVENT_ACTION_TYPE, 'download', ext, href);
      });
    }

    if (config_['trackActions'] && !isHttp) {
      addEvent_(link, mousedown_, function() {
        exec_(
            EVENT_ACTION_TYPE, 'cta:' + proto,
            // 'tel:1234567890'.slice('tel'.length + 1) == '1234567890';
            // 'mailto:hr@dtm.io'.slice('mailto'.length + 1) == 'hr@dtm.io';
            href[slice_](proto[length_] + 1).split('?')[0],
            loc[href_]);
      });
    }
  }

  /**
   * Attaches event listener to passed form element.
   * The attached listener sends event to trackers.
   * @param {!HTMLFormElement} form The from element.
   * @param {number} index The from collection index.
   * @private
   */
  function form_(form, index) {
    addEvent_(form, 'submit', function() {
      /** @type {HTMLCollection} */ var elements = form.elements;
      /** @type {number} */ var i = 0;
      /** @type {Element} */ var element;

      for (; i < elements[length_];) {
        element = elements[i++];
        element.name && exec_(
            EVENT_ACTION_TYPE, 'form',
            form[attr_]('name') || form[attr_]('id') || 'form ' + index,
            element.name + ':' + (element.type || element.tagName));
      }
    });
  }

  /**
   * Tries to attach listener to Twitter widget object if it presents on page.
   * @link https://dev.twitter.com/docs/tfw/events
   * @private
   */
  function twitter_() {
    twitter_.counter = twitter_.counter || 0;
    /** @type {!Object.<string, number>} */ var events = {};
    /** @type {string} */ var type;
    /** @type {Object.<string, *>} */ var data;
    /** @type {Array} */ var params;

    if (twitter_.counter++ < 9) {
      if (win['twttr'] && win['twttr']['ready']) {
        if (!win['__twitterIntentHandler']) {
          addEvent_(win, message_, function(e) {
            try {
              if ('twitter.com' === e['origin'][substr_](-11) && e['data']) {
                data = win['JSON'] && win['JSON']['parse'](e['data']);
                params = data && data['params'];
                if (params && 'trigger' === data['method']) {
                  type = params[0];
                  if ('click' === type && params[1]) {
                    type += '-' + params[1]['region'];
                  }

                  if (!events[type]) {
                    events[type] = 1;
                    exec_(SOCIAL_ACTION_TYPE, 'Twitter', type, loc[href_]);
                  }
                }
              }
            } catch (ex) {}
          });

          win['twttr']['ready'](function(twttr) {
            twttr['events']['bind'](message_, function() {});
          });
          win['__twitterIntentHandler'] = true;
        }
      } else setTimeout(twitter_, 5e3);
    }
  }

  /**
   * Tries to attach listener to Facebook widget object if it presents on page.
   * http://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe
   * @private
   */
  function facebook_() {
    facebook_.counter = facebook_.counter || 0;
    /** @param {string} action The Facebook event type. */
    function listener(action) {
      exec_(SOCIAL_ACTION_TYPE, 'Facebook', action, loc[href_]);
    }

    if (facebook_.counter++ < 9) {
      /** @type {Object} */ var fb = win['FB'];
      /** @type {!function(string, Function)} */
      var subscribe = fb && fb['Event'] && fb['Event']['subscribe'];
      if (subscribe) {
        try {
          subscribe('edge.create', function() { listener('like'); });
          subscribe('edge.remove', function() { listener('unlike'); });
          subscribe(message_ + '.send', function() { listener(message_); });
        } catch (e) {}
      } else setTimeout(facebook_, 5e3);
    }
  }

  /**
   * Tries to attach listener to LinkedIn plugin if it presents on page.
   * @link https://developer.linkedin.com/plugins
   * @private
   */
  function linkedin_() {
    /**
     * @param {Element} element The script element.
     * @param {string} action The social action type.
     */
    function subscribe(element, action) {
      /** @type {string} */ var type = 'onsuccess';
      /** @type {string} */ var cb = ['cb', type, action, +new Date].join('_');
      element[type] = (element[type] ? element[type] + ',' : '') + cb;
      win[cb] = function() {
        exec_(SOCIAL_ACTION_TYPE, 'LinkedIn', action, loc[href_]);
      };
    }

    /** @type {NodeList} */ var elements = getElements_('SCRIPT');
    /** @type {number} */ var length = elements[length_];
    /** @type {number} */ var i = 0;
    /** @type {Element} */ var element;
    /** @type {string} */ var type;

    for (; i < length;) {
      element = elements[i++];
      type = (element[attr_]('type') || '')[lower_]();
      (!type[index_]('in/')) && subscribe(element, type[substr_](3));
    }
  }

  /**
   * Tracks pageviews by users logged in to social networks.
   * @private
   */
  function users_() {
    /** @type {number} */ var sent = 0;
    /** @type {number} */ var attempts = 5;
    /** @type {string} */ var network;

    /**
     * @param {string} network The social network name.
     */
    function pageview(network) {
      exec_(SOCIAL_ACTION_TYPE, network, 'pageview', loc[href_]);
    }

    /**
     * @param {Image} image The image object.
     * @param {string} network The social network name.
     */
    function subscribe(image, network) {
      addEvent_(image, 'load', function() {
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
      var fn = win['FB'] && win['FB']['getLoginStatus'];
      if (fn) {
        getStatus(fn);

        addEvent_(win, message_, function(e) {
          try {
            if ('facebook.com' === e['origin'][substr_](-12) &&
                e['data'] &&
                ~e['data'][index_]('xd_action=proxy_ready')) {
              getStatus(fn);
            }
          } catch (ex) {}
        });

      } else if (--attempts) {
        setTimeout(status, 2e3);
      }
    }

    for (network in USERS) {
      subscribe(new Image(1, 1), network);
    }

    status();
  }

  /**
   * Tracks page prints.
   * @private
   */
  function print_() {
    /** @type {function(string):MediaQueryList} */
    var matchMedia = win['matchMedia'];
    /** @type {MediaQueryList} */
    var queryList = matchMedia && matchMedia('print');

    function afterprint() {
      exec_(EVENT_ACTION_TYPE, 'print', doc.title, loc[href_]);
    }

    queryList && queryList['addListener'](afterprint);
    addEvent_(win, 'afterprint', afterprint);
  }

  /**
   * Tracks media (video and audio) events on page.
   * @private
   */
  function media_() {
    /** @type {!Array.<string>} */ var events = [
      'ended', 'pause', 'play',
      'webkitfullscreenchange', 'mozfullscreenchange', 'fullscreenchange'];
    /** @type {!Array.<HTMLMediaElement>} */ var elements =
        /** @type {!Array.<HTMLMediaElement>} */ (toArray_('AUDIO', 'VIDEO'));
    /** @type {number} */ var length = elements[length_] >>> 0;
    /** @type {number} */ var i = 0;
    /** @type {number} */ var j;
    /** @type {HTMLMediaElement} */ var element;
    /** @type {string} */ var source;
    /** @type {string} */ var type;
    /** @type {string} */ var tag;

    /** @param {Event} e The event */
    function listener(e) {
      element = /** @type {HTMLMediaElement} */ (e.target || e.srcElement);
      source = element['currentSrc'] || element['src'];
      tag = element.tagName[lower_]();
      type = e.type;
      if (~type[index_]('fullscreen')) {
        if (doc['fullScreen'] || doc['mozFullScreen'] ||
            doc['webkitIsFullScreen'])
          exec_(EVENT_ACTION_TYPE, tag + ':html5', 'fullscreen', source);
      } else {
        exec_(EVENT_ACTION_TYPE, tag + ':html5', type, source);
      }
    }

    for (; i < length;) {
      element = elements[i++];
      for (j = 0; j < 6;) { // 6 == events.length
        addEvent_(element, events[j++], listener);
      }
    }

    youtube_();
  }

  /**
   * Tracks youtube video events on page.
   * @see https://developers.google.com/youtube/iframe_api_reference
   * @private
   */
  function youtube_() {
    /** @type {NodeList} */ var elements = getElements_('IFRAME');
    /** @type {number} */ var length = elements[length_];
    /** @type {number} */ var i = 0;
    /** @type {!Array} */ var iframes = [];
    /** @type {string} */ var type;
    /** @type {HTMLIFrameElement} */ var element;
    /** @type {string} */ var source;

    /** @param {Event} e The event */
    function listener(e) {
      type = ['ended', 'play', 'pause'][e['data']];
      type && exec_(
          EVENT_ACTION_TYPE, 'video:youtube', type, e.target['getVideoUrl']());
    }

    for (; i < length;) {
      element = elements[i++];
      source = element.src;
      if (/^(https?:)?\/\/(www\.)?youtube\.com\/embed/.test(source)) {
        if (0 > source[index_]('enablejsapi')) {
          element.src += (~source.indexOf('?') ? '&' : '?') + 'enablejsapi=1';
        }
        iframes.push(element);
      }
    }

    length = iframes[length_];
    if (length) {
      win['onYouTubeIframeAPIReady'] = function() {
        for (i = 0; i < length;) {
          addEvent_(
              new win['YT']['Player'](iframes[i++]), 'onStateChange', listener);
        }
      };

      if (!win['YT'])
        getElements_('HEAD')[0].appendChild(
            doc.createElement('SCRIPT')).src = '//www.youtube.com/iframe_api';
    }
  }

  /**
   * Tracks scroll events on page.
   * @private
   */
  function scroll_() {
    /** @type {Object} */ var map = {25: 0, 50: 0, 75: 0, 100: 0};
    /** @type {Element} */ var root = doc.documentElement;
    /** @type {number} */ var depth;

    addEvent_(win, 'scroll', function() {
      /** @type {number} */ var percent =
          (root.scrollTop + doc.body.scrollTop) /
          (root.scrollHeight - root.clientHeight) * 100;
      depth = ~~(percent / 25) * 25;
      if (depth && !map[depth]) {
        map[depth] = 1;
        exec_(EVENT_ACTION_TYPE, 'scroll', 'depth', depth + '%');
      }
    });
  }

  /**
   * Adds event listener.
   * @param {Element|Window|HTMLDocument} element The HTML element.
   * @param {string} type The event type.
   * @param {!Function} listener The event listener.
   * @private
   */
  function addEvent_(element, type, listener) {
    element[listen_] ?
        element[listen_](type, listener, !1) :
        element.attachEvent('on' + type, listener);
  }

  /**
   * Performs trackers function execution.
   * @param {...*} var_args
   * @private
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
  function exec_(var_args) {
    /** @type {!Array} */ var args = Array.prototype[slice_].call(arguments, 0);
    /** @type {Array.<Object>} */ var trackers;
    /** @type {Array} */ var argv;

    args[0] = args[0] ? social_ : 'event';
    // args[0] = ['event', social_, 'ecom', 'campaign'][args[0]];

    if ('function' === typeof win[GA_KEY]) {
      trackers = win[GA_KEY]['getAll'] && win[GA_KEY]['getAll']();
      trackers && send_(trackers, 'send', args);
    }

    execTagLoader_(args);
    argv = convert_(args);
    send_([win], 'ClickTaleEvent', [argv.join(':')]);
    send_([win], '__utmTrackEvent', argv);
    win['_hmt'] && send_([win['_hmt']], 'push', [['_trackEvent'].concat(argv)]);
    execClassicGA_(args);
  }

  /**
   * Performs Adobe Tag Loader execution.
   * @param {Array} args The arguments to send.
   * @private
   */
  function execTagLoader_(args) {
    /** @type {Function} */ var loader = win['TagLoader'];
    /** @type {Object} */ var tracker = win['s'];
    /** @type {!Array.<string>} */ var vars = [];
    /** @type {number} */ var i = 1;
    /** @type {string} */ var key;

    if (loader && tracker && (tracker instanceof loader)) {
      for (; i < args[length_]; i++) {
        key = 'prop' + i;
        vars.push(key);
        tracker[key] = args[i];
      }

      tracker['linkTrackEvents'] = 'None';
      tracker['linkTrackVars'] = vars.join(',');
      send_(
          [tracker], 'tl', // 'tl' is 'trackLink' method.
          [tracker, 'download' === args[1] ? 'd' : 'o', args[0]]);
    }
  }

  /**
   * Performs Classic Google Analytics execution.
   * @param {Array} args The arguments to send.
   * @private
   */
  function execClassicGA_(args) {
    if (win['_gat'] || win['_gaq']) {
      /** @type {Array.<Object>} */
      var trackers = win['_gat'] && win['_gat']['_getTrackers'] &&
                     win['_gat']['_getTrackers']();
      args[0] = ({'social': '_trackSocial', 'event': '_trackEvent'})[args[0]];
      if (trackers) {
        send_(trackers, args[0], args[slice_](1));
      } else if (win['_gaq']) {
        send_([win['_gaq']], 'push', [args]);
      }
    }
  }

  /**
   * Converts 'social' interaction to 'event'.
   * @param {!Array} args The arguments to convert.
   * @return {!Array} Returns converted arguments.
   * @private
   */
  function convert_(args) {
    /** @type {!Array} */ var argv = [].concat(args);
    if (social_ == argv[0]) {
      // from: ['social', 'network', 'action', 'target']
      // to: ['social', 'social:action', 'network', 'target']
      argv[1] = social_ + ':' + argv.splice(2, 1, argv[1])[0];
    }
    return argv[slice_](1);
  }

  /**
   * @param {!Array.<Object>} trackers The list of trackers.
   * @param {string} func The function name.
   * @param {!Array} args The func arguments.
   * @private
   */
  function send_(trackers, func, args) {
    /** @type {number} */ var length = trackers[length_] >>> 0;
    /** @type {number} */ var i = 0;
    /** @type {Object} */ var tracker;

    debug_(func, args);
    for (; i < length;) {
      tracker = trackers[i++];
      if ('function' === typeof tracker[func])
        tracker[func].apply(tracker, args);
    }
  }

  /**
   * @param {...*} var_args Arguments to log.
   * @private
   */
  function debug_(var_args) {
    /** @type {Console} */ var logger = win.console;
    if (config_['debugMode'] && logger)
      logger.log.apply(logger, arguments);
  }

  /**
   * @param {...string} var_args The elements tag names to convert.
   * @return {!Array.<Element>} Returns converted elements to array.
   * @private
   */
  function toArray_(var_args) {
    /** @type {!Array.<Element>} */ var elements = [];
    /** @type {Function} */ var slice = Array.prototype[slice_];
    /** @type {!Array.<string>} */ var tags = slice.call(arguments, 0);
    /** @type {number} */ var i = 0;

    for (i = 0; i < tags[length_];) {
      elements.push.apply(elements, getElements_(tags[i++]));
    }
    return elements;
  }

  /**
   * The shortcut for '(HTMLDocument).getElementsByTagName' method.
   * @param {string} tagName The tag name.
   * @return {NodeList}
   * @private
   */
  function getElements_(tagName) {
    return doc.getElementsByTagName(tagName);
  }

  /**
   * The configuration options.
   * @type {!Object.<string, number>}
   * @private
   */
  var config_ = win['_ega'] || win['_komito'] || {};

  /**
   * The shortcut for '(Array|NodeList|string).length' attribute.
   * @type {string}
   * @private
   */
  var length_ = 'length';

  /**
   * The shortcut for '(Array|string).slice' method.
   * @type {string}
   * @private
   */
  var slice_ = 'slice';

  /**
   * The shortcut for '(Location|HTMLAnchorElement).href' attribute.
   * @type {string}
   * @private
   */
  var href_ = 'href';

  /**
   * The shortcut for '(Element).getAttribute' method.
   * @type {string}
   * @private
   */
  var attr_ = 'getAttribute';

  /**
   * The shortcut for '(string).indexOf' method.
   * @type {string}
   * @private
   */
  var index_ = 'indexOf';

  /**
   * The shortcut for '(string).substr' method.
   * @type {string}
   * @private
   */
  var substr_ = 'substr';

  /**
   * The shortcut for '(string).toLowerCase' method.
   * @type {string}
   * @private
   */
  var lower_ = 'toLowerCase';

  /**
   * The shortcut for '(HTMLDocument|Node).addEventListener' method.
   * @type {string}
   * @private
   */
  var listen_ = 'addEventListener';

  /**
   * @type {string}
   * @private
   */
  var message_ = 'message';

  /**
   * @type {string}
   * @private
   */
  var mousedown_ = 'mousedown';

  /**
   * @type {string}
   * @private
   */
  var social_ = 'social';

  init_();

})(window, document, location);
