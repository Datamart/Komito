


/**
 * Defines <code>komito.trackers.dom.links</code> constructor.
 * @constructor
 */
komito.trackers.dom.Links = function() {
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

  /** @type {!RegExp} */
  var HTTP_PATTERN = /^(https?:)?\/\//;

  /**
   * Initializes links tracking.
   * @private
   */
  function init_() {
    /** @type {Array|HTMLCollection|NodeList} */
    var links = dom.getElementsByTagName(dom.document, 'A');
    /** @type {number} */ var length = links.length;

    for (; length;) {
      addEventListeners_(/** @type {!HTMLAnchorElement} */ (links[--length]));
    }
  }

  /**
   * Attaches event listener if passed link is outbound, social or downloadable.
   * The attached listener sends event to trackers.
   * @param {!HTMLAnchorElement} link The link element.
   * @private
   */
  function addEventListeners_(link) {
    /** @type {string} */ var href = getURL_(link);
    /** @type {boolean} */ var isHttp = HTTP_PATTERN.test(href);
    /** @type {Array} */ var match = href.match(komito.EXT_PATTERN);
    /** @type {string} */ var ext = (match || ['']).pop().toLowerCase();

    if (komito.config['trackOutbound'] &&
        isHttp &&
        !~link.hostname.indexOf(location.hostname))
      dom.events.addEventListener(
          link, dom.events.TYPE.MOUSEDOWN, trackOutboundListener_);

    if (komito.config['trackDownloads'] &&
        (ext ? ~komito.DOWNLOADS.indexOf(',' + ext + ',') : 0))
      dom.events.addEventListener(
          link, dom.events.TYPE.MOUSEDOWN, trackDownloadsListener_);

    if (komito.config['trackActions'] && !isHttp)
      dom.events.addEventListener(
          link, dom.events.TYPE.MOUSEDOWN, trackActionsListener_);
  }

  /**
   * @param {Event} e The mousedown event.
   * @private
   */
  function trackOutboundListener_(e) {
    /** @type {HTMLAnchorElement} */ var link = getLinkEventTarget_(e);
    /** @type {string} */ var type = 'outbound';
    /** @type {string} */ var host = link.hostname;
    /** @type {Array.<string>} */ var path = link.pathname.split('/');
    /** @type {string} */ var href = getURL_(link);
    /** @type {string} */ var social = NETWORKS[host.replace(/^www\./, '')];

    komito.track(komito.EVENT_ACTION_TYPE, type, host, href);
    if (social) {
      if ('twitter.com' === host.substr(-11) &&
          'intent' === path[path.length - 2])
        type = 'intent-' + path.pop();
      komito.track(komito.SOCIAL_ACTION_TYPE, social, type, href);
    }

    dom.events.removeEventListener(
        link, dom.events.TYPE.MOUSEDOWN, trackOutboundListener_);
  }

  /**
   * @param {Event} e The mousedown event.
   * @private
   */
  function trackDownloadsListener_(e) {
    /** @type {HTMLAnchorElement} */ var link = getLinkEventTarget_(e);
    /** @type {string} */ var href = getURL_(link);
    var type = (href.match(komito.EXT_PATTERN) || ['']).pop().toLowerCase();

    komito.track(komito.EVENT_ACTION_TYPE, 'download', type, href);

    dom.events.removeEventListener(
        link, dom.events.TYPE.MOUSEDOWN, trackDownloadsListener_);
  }

  /**
   * @param {Event} e The mousedown event.
   * @private
   */
  function trackActionsListener_(e) {
    /** @type {HTMLAnchorElement} */ var link = getLinkEventTarget_(e);
    /** @type {string} */ var proto = link.protocol.slice(0, -1);
    /** @type {string} */ var href = getURL_(link);

    if (!HTTP_PATTERN.test(href)) {
      // 'tel:1234567890'.slice('tel'.length + 1) == '1234567890';
      // 'mailto:hr@dtm.io'.slice('mailto'.length + 1) == 'hr@dtm.io';
      // var type = href.slice(proto.length + 1).split('?')[0];
      komito.track(
          komito.EVENT_ACTION_TYPE, 'cta:' + proto,
          href.slice(proto.length + 1).split('?')[0], href);

      dom.events.removeEventListener(
          link, dom.events.TYPE.MOUSEDOWN, trackActionsListener_);
    }
  }

  /**
   * @param {Event} e The mousedown event.
   * @return {HTMLAnchorElement}
   * @private
   */
  function getLinkEventTarget_(e) {
    /** @type {Node} */
    var target = /** @type {Node} */ (dom.events.getEventTarget(e));

    while (target && 'A' !== target.tagName) {
      target = target.parentNode;
    }

    return /** @type {HTMLAnchorElement} */ (target);
  }

  /**
   * @param {HTMLAnchorElement} link The link element.
   * @return {string} Returns link URL.
   * @private
   */
  function getURL_(link) {
    return link.href || link.getAttribute('href') || '';
  }

  // Initializing links events tracking.
  init_();
};
