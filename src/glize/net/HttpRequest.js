/**
 * @fileoverview Simple implementation of HttpRequest.
 *
 * @see http://google.github.io/styleguide/javascriptguide.xml
 * @see http://developers.google.com/closure/compiler/docs/js-for-compiler
 */



/**
 * The constructor initiates a HttpRequest.
 * @constructor
 */
net.HttpRequest = function() {
  /**
   * Performs DELETE request.
   * @param {string} url The URL to which to send the request.
   * @param {function(!XMLHttpRequest)} callback A JavaScript function object
   *     that is called whenever the <code>readyState</code> attribute equals
   *     to 4 (DONE).
   * @return {!XMLHttpRequest} Returns instance of XMLHttpRequest.
   */
  this.doDelete = function(url, callback) {
    return doRequest_('DELETE', url, callback);
  };

  /**
   * Performs GET request.
   * @param {string} url The URL to which to send the request.
   * @param {function(!XMLHttpRequest)} callback A JavaScript function object
   *     that is called whenever the <code>readyState</code> attribute equals
   *     to 4 (DONE).
   * @param {boolean=} opt_skipRFC Optional, skips RFC 2616 checking.
   * @return {!XMLHttpRequest} Returns instance of XMLHttpRequest.
   */
  this.doGet = function(url, callback, opt_skipRFC) {
    // @link http://tools.ietf.org/html/rfc2616#section-3.2.1
    if (!opt_skipRFC && 255 < url.length) {
      /** @type {!Array} */ var parts = url.split('?');
      return self_.doPost(parts[0], callback, parts[1]);
    }

    return doRequest_('GET', url, callback);
  };

  /**
   * Performs HEAD request.
   * @param {string} url The URL to which to send the request.
   * @param {function(!XMLHttpRequest)} callback A JavaScript function object
   *     that is called whenever the <code>readyState</code> attribute equals
   *     to 4 (DONE).
   * @return {!XMLHttpRequest} Returns instance of XMLHttpRequest.
   */
  this.doHead = function(url, callback) {
    return doRequest_('HEAD', url, callback);
  };

  /**
   * Performs POST request.
   * @param {string} url The URL to which to send the request.
   * @param {function(!XMLHttpRequest)} callback A JavaScript function object
   *     that is called whenever the <code>readyState</code> attribute equals
   *     to 4 (DONE).
   * @param {?Object|string} data Provides the request entity body.
   * @return {!XMLHttpRequest} Returns instance of XMLHttpRequest.
   */
  this.doPost = function(url, callback, data) {
    return doRequest_('POST', url, callback, data);
  };

  /**
   * Performs PUT request.
   * @param {string} url The URL to which to send the request.
   * @param {function(!XMLHttpRequest)} callback A JavaScript function object
   *     that is called whenever the <code>readyState</code> attribute equals
   *     to 4 (DONE).
   * @param {?Object|string} data Provides the request entity body.
   * @return {!XMLHttpRequest} Returns instance of XMLHttpRequest.
   */
  this.doPut = function(url, callback, data) {
    return doRequest_('PUT', url, callback, data);
  };

  /**
   * Gets count of active requests.
   * @return {number} Returns count of active requests.
   */
  this.getCount = function() {
    return net.HttpRequest.count_ || 0;
  };

  /**
   * Performs HTTP request.
   * @param {string} method The HTTP method to use, such as "GET", "POST",
   *     "PUT", "DELETE", etc. Ignored for non-HTTP(S) URLs.
   * @param {string} url The URL to which to send the request.
   * @param {function(!XMLHttpRequest)} callback A JavaScript function object
   *     that is called whenever the <code>readyState</code> attribute equals
   *     to 4 (DONE).
   * @param {string|?Object=} opt_data Provides the request entity body.
   *     If opt_data is Object, request will be sent as application/json.
   * @return {!XMLHttpRequest} Returns instance of XMLHttpRequest.
   * @private
   */
  function doRequest_(method, url, callback, opt_data) {
    url = url.replace(/^\/+/, '/');
    url += (~url.indexOf('?') ? '&' : '?') + 'nocache=' + util.Date.now();
    net.HttpRequest.count_++;

    /** @type {!XMLHttpRequest} */
    var req = dom.context.XMLHttpRequest ?
        new XMLHttpRequest : new ActiveXObject('Microsoft.XMLHTTP');
    req.onreadystatechange = function() {
      if (4 === req.readyState) {
        net.HttpRequest.count_--;
        callback(req);
      }
    };
    req.open(method, url, true);
    req.send(prepare_(req, method, opt_data));

    return req;
  }

  /**
   * Sets request <code>request</code> headers depending to request
   * <code>method</code> and <code>opt_data</code>.
   * @param {!XMLHttpRequest} request The instance of XMLHttpRequest.
   * @param {string} method The HTTP method to use, such as "GET", "POST",
   *     "PUT", "DELETE", etc. Ignored for non-HTTP(S) URLs.
   * @param {string|?Object=} opt_data Provides the request entity body.
   *     If opt_data is Object, request will be sent as application/json.
   * @return {string} Returns modified <code>opt_data</code>.
   * @private
   */
  function prepare_(request, method, opt_data) {
    for (/** @type {string} */ var name in net.HttpRequest.headers_) {
      request.setRequestHeader(name, net.HttpRequest.headers_[name]);
    }

    request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    if (opt_data && typeof opt_data == 'object') {
      request.setRequestHeader('Content-Type',
          'application/json; charset=' + dom.CHARSET);
      opt_data = util.StringUtils.JSON.stringify(
          /** @type {!Object} */ (opt_data));
    } else if (method == 'POST') {
      request.setRequestHeader('Content-Type',
          'application/x-www-form-urlencoded; charset=' + dom.CHARSET);
    }

    return /** @type {string} */ (opt_data);
  }

  /**
   * The reference to current class instance.
   * Used in private methods and for preventing jslint errors.
   * @type {!net.HttpRequest}
   * @private
   */
  var self_ = this;

  /**
   * The count of active requests.
   * @static
   * @type {number}
   * @see net.HttpRequest#getCount
   * @private
   */
  net.HttpRequest.count_ = net.HttpRequest.count_ || 0;
};


/**
 * @static
 * @type {!Object.<string, string>}
 * @see net.HttpRequest.setRequestHeader
 * @private
 */
net.HttpRequest.headers_ = {};


/**
 * Sets custom header.
 * @param {string} name The header name.
 * @param {string} value The header value.
 * @static
 */
net.HttpRequest.setRequestHeader = function(name, value) {
  net.HttpRequest.headers_[name] = value;
};
