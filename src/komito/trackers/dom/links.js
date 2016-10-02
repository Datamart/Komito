/**
 * Defines <code>komito.trackers.dom.links</code> namespace.
 * @namespace
 */
komito.trackers.dom.links = {

  /**
   * Initializes links tracking.
   */
  init: function() {
    /** @type {Array|HTMLCollection|NodeList} */
    var links = dom.getElementsByTagName(dom.document, 'A');
    /** @type {number} */ var length = links.length;

    for (; length;) {
      komito.trackers.dom.links.track(
          /** @type {!HTMLAnchorElement} */ (links[--length]));
    }
  },

  /**
   * Attaches event listener if passed link is outbound, social or downloadable.
   * The attached listener sends event to trackers.
   * @param {!HTMLAnchorElement} link The link element.
   * @private
   */
  track: function(link) {
    /** @type {boolean} */ var isHttp = /^https?:$/.test(link.protocol);
    /** @type {string} */ var href = link.href || link.getAttribute('href');
    /** @type {Array} */ var match = href.match(komito.EXT_PATTERN);
    /** @type {string} */ var ext = (match || ['']).pop().toLowerCase();

    if (komito.config['trackOutbound'] &&
        isHttp &&
        !~link.hostname.indexOf(location.hostname))
      dom.events.addEventListener(
          link, dom.events.TYPE.MOUSEDOWN,
          komito.trackers.dom.links.trackOutboundListener_);

    if (komito.config['trackDownloads'] &&
        (ext ? ~komito.DOWNLOADS.indexOf(',' + ext + ',') : 0))
      dom.events.addEventListener(
          link, dom.events.TYPE.MOUSEDOWN,
          komito.trackers.dom.links.trackDownloadsListener_);

    if (komito.config['trackActions'] && !isHttp)
      dom.events.addEventListener(
          link, dom.events.TYPE.MOUSEDOWN,
          komito.trackers.dom.links.trackActionsListener_);
  },

  /**
   * @param {Event} e The mousedown event.
   * @private
   */
  trackOutboundListener_: function(e) {
    /** @type {HTMLAnchorElement} */
    var link = komito.trackers.dom.links.getLinkEventTarget_(e);

    /** @type {string} */ var type = 'outbound';
    /** @type {string} */ var host = link.hostname;
    /** @type {?string} */ var social = komito.trackers.social &&
        komito.trackers.social.NETWORKS[host.replace(/^www\./, '')];
    /** @type {Array.<string>} */ var path = link.pathname.split('/');
    /** @type {string} */ var href = link.href || link.getAttribute('href');

    komito.track(komito.EVENT_ACTION_TYPE, type, host, href);
    if (social) {
      if ('twitter.com' === host.substr(-11) &&
          'intent' === path[path.length - 2])
        type = 'intent-' + path.pop();
      komito.track(komito.SOCIAL_ACTION_TYPE, social, type, href);
    }

    dom.events.removeEventListener(
        link, dom.events.TYPE.MOUSEDOWN,
        komito.trackers.dom.links.trackOutboundListener_);
  },

  /**
   * @param {Event} e The mousedown event.
   * @private
   */
  trackDownloadsListener_: function(e) {
    /** @type {HTMLAnchorElement} */
    var link = komito.trackers.dom.links.getLinkEventTarget_(e);
    /** @type {string} */ var href = link.href || link.getAttribute('href');
    var type = (href.match(komito.EXT_PATTERN) || ['']).pop().toLowerCase();

    komito.track(komito.EVENT_ACTION_TYPE, 'download', type, href);

    dom.events.removeEventListener(
        link, dom.events.TYPE.MOUSEDOWN,
        komito.trackers.dom.links.trackDownloadsListener_);
  },

  /**
   * @param {Event} e The mousedown event.
   * @private
   */
  trackActionsListener_: function(e) {
    /** @type {HTMLAnchorElement} */
    var link = komito.trackers.dom.links.getLinkEventTarget_(e);
    /** @type {string} */ var proto = link.protocol.slice(0, -1);
    /** @type {string} */ var href = link.href || link.getAttribute('href');
    // 'tel:1234567890'.slice('tel'.length + 1) == '1234567890';
    // 'mailto:hr@dtm.io'.slice('mailto'.length + 1) == 'hr@dtm.io';
    var type = href.slice(proto.length + 1).split('?')[0];

    komito.track(komito.EVENT_ACTION_TYPE, 'cta:' + proto, type, href);

    dom.events.removeEventListener(
        link, dom.events.TYPE.MOUSEDOWN,
        komito.trackers.dom.links.trackActionsListener_);
  },

  /**
   * @param {Event} e The mousedown event.
   * @return {HTMLAnchorElement}
   * @private
   */
  getLinkEventTarget_: function(e) {
    /** @type {Node} */
    var target = /** @type {Node} */ (dom.events.getEventTarget(e));

    while (target && 'A' !== target.tagName) {
      target = target.parentNode;
    }

    return /** @type {HTMLAnchorElement} */ (target);
  }
};
