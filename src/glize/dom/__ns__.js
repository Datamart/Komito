/**
 * @fileoverview Defines <code>dom</code> namespace.
 *
 * @see http://google.github.io/styleguide/javascriptguide.xml
 * @see http://developers.google.com/closure/compiler/docs/js-for-compiler
 */


/**
 * Defines <code>dom</code> namespace.
 * @namespace
 */
var dom = dom || {};


/**
 * Defines <code>dom.events</code> namespace.
 * @namespace
 */
dom.events = dom.events || {};


/**
 * Defines <code>dom.scripts</code> namespace.
 * @namespace
 */
dom.scripts = dom.scripts || {};


/**
 * Defines <code>dom.css</code> namespace.
 * @namespace
 */
dom.css = dom.css || {};


/**
 * Reference to the <code>document</code> object.
 * Used to reduce size after compilation.
 * @type {!Document}
 */
dom.document = document;


/**
 * Reference to the <code>window</code> object.
 * Used to reduce size after compilation.
 * @type {!Window}
 */
dom.context = window;


/**
 * Reference to the <code>navigator</code> object.
 * Used to reduce size after compilation.
 * @type {!Navigator}
 */
dom.device = navigator;


/**
 * Defines default document charset.
 * @type {string}
 * @const
 */
dom.CHARSET = (dom.document.charset ||
               dom.document.characterSet ||
               'utf-8').toLowerCase();


/**
 * The "null" shortcut.
 */
dom.NULL = null;


/**
 * Alias of W3C <code>document.createElement</code>.
 * Used to reduce size after compilation.
 * @param {string} tagName Tag name.
 * @return {?Element} Returns created element.
 * @static
 */
dom.createElement = function(tagName) {
  return tagName ? dom.document.createElement(tagName) : dom.NULL;
};


/**
 * Alias of W3C <code>document.getElementById</code>.
 * Used to reduce size after compilation.
 * @param {string} id A case-sensitive string representing the unique ID of the
 *     element being sought.
 * @return {?Element} Returns reference to an Element object, or null if an
 *     element with the specified ID is not in the document.
 * @static
 */
dom.getElementById = function(id) {
  return id ? dom.document.getElementById(id) : dom.NULL;
};


/**
 * Alias of W3C <code>element.getElementsByTagName</code>.
 * Used to reduce size after compilation.
 * @param {!Element|!Node} element Element to search tags.
 * @param {string} tagName Tag name.
 * @return {?NodeList} Returns list of found elements in the
 *     order they appear in the tree.
 * @static
 */
dom.getElementsByTagName = function(element, tagName) {
  return element && element.getElementsByTagName(tagName);
};


/**
 * Alias of W3C <code>element.getElementsByClassName</code>.
 * Used to reduce size after compilation.
 * @param {!Element|!Node} element Element to start searching.
 * @param {string} className Class name to match.
 * @return {!Array.<!Node>|?NodeList} Array of found elements.
 * @static
 */
dom.getElementsByClassName = function(element, className) {
  if (element.getElementsByClassName) {
    return element.getElementsByClassName(className);
  }

  if (element.querySelectorAll) {
    return element.querySelectorAll('.' + className);
  }

  /** @type {!RegExp} */ var re = new RegExp('(?:^|\\s)' + className + '(?!\\S)');
  /** @type {!Array.<!Node>} */ var result = [];
  /** @type {?NodeList} */ var nodes = dom.getElementsByTagName(element, '*');
  /** @type {number} */ var i = 0;

  for (; i < nodes.length; ++i) {
    if (re.test(nodes[i].className)) {
      result.push(nodes[i]);
    }
  }

  return result;
};


/**
 * Alias of W3C <code>element.querySelectorAll</code>.
 * Used to reduce size after compilation.
 * @param {!Element|!DocumentFragment} element Element to start searching.
 * @param {string} selectors One or more CSS selectors separated by commas.
 * @return {?NodeList} Returns a list of the elements within the document that
 *     match the specified group of selectors.
 * @see https://www.w3.org/TR/selectors-api/#queryselectorall
 * @static
 */
dom.querySelectorAll = function(element, selectors) {
  return element && element.querySelectorAll(selectors);
};


/**
 * Alias of W3C <code>element.querySelector</code>.
 * Used to reduce size after compilation.
 * @param {!Element|!DocumentFragment} element Element to start searching.
 * @param {string} selectors One or more CSS selectors separated by commas.
 * @return {?Element} Returns the first element that is a descendant of the
 *     element on which it is invoked that matches the specified group of
 *     selectors.
 * @see https://www.w3.org/TR/selectors-api/#queryselector
 * @static
 */
dom.querySelector = function(element, selectors) {
  return element && element.querySelector(selectors);
};


/**
 * Alias of W3C <code>element.getBoundingClientRect</code>.
 * Used to reduce size after compilation.
 * @param {?Element} element Element for calculating bounding rect.
 * @return {!Object} Returns dict {top, left, width, height, right, bottom}.
 * @static
 */
dom.getBoundingClientRect = function(element) {
  /** @type {!Object|?ClientRect} */ var rect;

  if (element) {
    rect = element.getBoundingClientRect && element.getBoundingClientRect();
    if (!rect) {
      rect = {'top': 0, 'left': 0, 'width': element.offsetWidth,
        'height': element.offsetHeight};
      while (element && !isNaN(element.offsetLeft) &&
             !isNaN(element.offsetTop)) {
        rect['left'] += element.offsetLeft - element.scrollLeft;
        rect['top'] += element.offsetTop - element.scrollTop;
        element = element.offsetParent;
      }
      rect['right'] = rect['left'] + rect['width'];
      rect['bottom'] = rect['top'] + rect['height'];
    }
  }

  return /** @type {!Object.<string, number>} */ (rect);
};


/**
 * Alias of W3C <code>document.defaultView.getComputedStyle</code>.
 * Used to reduce size after compilation.
 * @param {!Element|!Node} element Element for getting style.
 * @param {string} prop Style property name.
 * @return {string|number} Returns element style value.
 * @static
 */
dom.getComputedStyle = function(element, prop) {
  if (dom.context['getComputedStyle']) {
    return dom.context['getComputedStyle'](
        element, dom.NULL).getPropertyValue(prop);
  }

  // Converting 'css-property-name' to 'cssPropertyName'.
  prop = prop.replace(/\-\w/g, function(match) {
    return match.toUpperCase().slice(1);
  });

  return (element.currentStyle || element.style)[prop];
};


/**
 * Clears element content.
 * @param {?Element} element The element to clear.
 * @static
 */
dom.clearElement = function(element) {
  if (element) {
    switch (element.nodeName.toUpperCase()) {
      case 'TABLE':
      case 'THEAD':
      case 'TBODY':
      case 'TFOOT':
      case 'TR':
      case 'SELECT':
        while (element.lastChild) {
          element.removeChild(element.lastChild);
        }
        break;
      default:
        element.innerHTML = '';
    }
  }
};


/**
 * Removes the object from the document hierarchy.
 * @param {?Node} element The element to remove.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/removeChild
 * @see https://msdn.microsoft.com/en-us/library/ms536708%28v=vs.85%29.aspx
 * @static
 */
dom.removeNode = function(element) {
  element && element.parentNode && element.parentNode.removeChild(element);
};


/**
 * Alias of W3C <code>element.appendChild</code>.
 * Used to reduce size after compilation.
 * @param {?Node|?Element} parent The parent element.
 * @param {?Node|?Element} child The child element.
 * @return {!Node} Returns a reference to the <code>child</code> that
 *     is appended to the parent.
 * @static
 */
dom.appendChild = function(parent, child) {
  return parent.appendChild(child);
};


/**
 * Returns true if an element has a class.
 * @param {?Node} element The element to test.
 * @param {string} className The class name to test for.
 * @return {boolean} Whether element has the class.
 */
dom.css.hasClass = function(element, className) {
  // Note: `element.classList.contains` throws 'TypeError: Illegal invocation'
  // if element is not appended into the DOM.
  if (element) {
    /** @type {!Array.<string>} */ var classes = element.className.split(' ');
    /** @type {number} */ var i = 0;

    for (; i < classes.length;) {
      if (className == classes[i++]) {
        return true;
      }
    }
  }

  return false;
};


/**
 * Sets the entire class name of an element.
 * @param {?Node} element The element to set class of.
 * @param {...string} var_args The class name(s) to apply to element.
 */
dom.css.setClass = function(element, var_args) {
  if (element) {
    element.className = util.Array.slice.call(arguments, 1).join(' ');
  }
};


/**
 * Adds a class or classes to an element. Does not add multiples of class names.
 * @param {?Node} element The element to add class to.
 * @param {...string} var_args The class name(s) to add.
 */
dom.css.addClass = function(element, var_args) {
  // Note: `element.classList.add` throws 'TypeError: Illegal invocation'
  // if element is not appended into the DOM.
  if (element) {
    dom.css.removeClass.apply(dom.NULL, arguments);
    element.className += ' ' + util.Array.slice.call(arguments, 1).join(' ');
  }
};


/**
 * Removes a class or classes from an element.
 * @param {?Node} element The element to remove class from.
 * @param {...string} var_args The class name(s) to remove.
 */
dom.css.removeClass = function(element, var_args) {
  // Note: `element.classList.remove` throws 'TypeError: Illegal invocation'
  // if element is not appended into the DOM.
  if (element) {
    /** @type {!Array.<string>} */
    var args = util.Array.slice.call(arguments, 1);
    dom.css.setClass(element, element.className.replace(
        new RegExp('\\s?\\b(' + args.join('|') + ')\\b', 'g'), ''));
  }
};


/**
 * Toggles element class name.
 * @param {?Node} element The element to add or remove the class on.
 * @param {string} className The class name to toggle.
 */
dom.css.toggleClass = function(element, className) {
  (dom.css.hasClass(element, className) ?
      dom.css.removeClass : dom.css.addClass)(element, className);
};


/**
 * Enum of event types.
 * @enum {string}
 */
dom.events.TYPE = {
  // Mouse events.
  CLICK: 'click',
  DBLCLICK: 'dblclick',
  MOUSEDOWN: 'mousedown',
  MOUSEMOVE: 'mousemove',
  MOUSEOUT: 'mouseout',
  MOUSEOVER: 'mouseover',
  MOUSEUP: 'mouseup',
  MOUSEWHEEL: 'onmousewheel' in dom.document ? 'mousewheel' : 'DOMMouseScroll',

  // Keyboard events.
  KEYDOWN: 'keydown',
  KEYPRESS: 'keypress',
  KEYUP: 'keyup',

  // Touch events.
  TOUCHCANCEL: 'touchcancel',
  TOUCHEND: 'touchend',
  TOUCHMOVE: 'touchmove',
  TOUCHSTART: 'touchstart',

  // Forms events.
  BLUR: 'blur',
  CHANGE: 'change',
  FOCUS: 'focus',
  INPUT: 'input',
  RESET: 'reset',
  SELECT: 'select',
  SUBMIT: 'submit',

  // Drag and drop events.
  DRAG: 'drag',
  DRAGEND: 'dragend',
  DRAGENTER: 'dragenter',
  DRAGLEAVE: 'dragleave',
  DRAGOVER: 'dragover',
  DRAGSTART: 'dragstart',
  DROP: 'drop',

  // Window and document events.
  BEFOREUNLOAD: 'beforeunload',
  DOMCONTENTLOADED: 'DOMContentLoaded',
  ERROR: 'error',
  LOAD: 'load',
  ORIENTATIONCHANGE: 'orientationchange',
  READYSTATECHANGE: 'readystatechange',
  RESIZE: 'resize',
  SCROLL: 'scroll',
  UNLOAD: 'unload'
};


/**
 * Alias of W3C <code>element.addEventListener</code>.
 * Used to reduce size after compilation.
 * @param {!Element|!Node|!Window} element Element to which attach event.
 * @param {string} type Type of event.
 * @param {function(!Event, ...)} listener Event listener.
 * @static
 */
dom.events.addEventListener = function(element, type, listener) {
  if (element.attachEvent) {
    element.attachEvent('on' + type, listener);
  } else {
    element.addEventListener(type, listener, false);
  }
};


/**
 * Alias of W3C <code>element.removeEventListener</code>.
 * Used to reduce size after compilation.
 * @param {!Element|!Node|!Window} element Element to which attach event.
 * @param {string} type Type of event.
 * @param {function(!Event, ...)} listener Event listener.
 * @static
 */
dom.events.removeEventListener = function(element, type, listener) {
  if (element.attachEvent) {
    element.detachEvent('on' + type, listener);
  } else {
    element.removeEventListener(type, listener, false);
  }
};


/**
 * Alias of W3C <code>element.dispatchEvent</code>.
 * Used to reduce size after compilation.
 * @param {!Element|!Node|!Window} element Element to dispatch event.
 * @param {string} type Type of event.
 * @return {boolean} Returns <code>true</code> if event dispatched successfully.
 * @static
 */
dom.events.dispatchEvent = function(element, type) {
  /** @type {?Event} */ var evt = dom.NULL;
  /** @type {boolean} */ var result = false;

  if (dom.document.createEvent) {
    evt = dom.document.createEvent('HTMLEvents');
    // initEvent(type, bubbling, cancelable)
    evt.initEvent(type, true, true);
    result = element.dispatchEvent(evt);
  } else if (dom.document.createEventObject) {
    evt = dom.document.createEventObject();
    try {
      // MSIE throws error on invalid event type.
      result = element.fireEvent('on' + type, evt);
    } catch (e) {}
  }

  return result;
};


/**
 * Alias of W3C <code>event.preventDefault</code>.
 * Used to reduce size after compilation.
 * @param {?Event} e The event to stop.
 * @static
 */
dom.events.preventDefault = function(e) {
  e = dom.events.getEvent(e);
  e.stopPropagation && e.stopPropagation();
  e.preventDefault && e.preventDefault();
  e.returnValue = false;
  e.cancelBubble = true;
};


/**
 * Gets event object.
 * Used to reduce size after compilation.
 * @param {?Event} e The event to stop.
 * @return {!Event} Returns event object.
 * @static
 */
dom.events.getEvent = function(e) {
  return e || dom.context.event;
};


/**
 * Gets event target object.
 * Used to reduce size after compilation.
 * @param {?Event} e The event to stop.
 * @return {?EventTarget} Returns event target object.
 * @static
 */
dom.events.getEventTarget = function(e) {
  e = dom.events.getEvent(e);
  return e.target || e.srcElement;
};


/**
 * Gets reference to script element is currently being processed.
 * @return {?Element} Reference to script element is currently being processed.
 * @link https://developer.mozilla.org/en/DOM/document.currentScript
 */
dom.scripts.getCurrent = function() {
  return dom.document['currentScript'] || dom.scripts.last_;
};


/**
 * Gets reference to last script element.
 * @return {?Element} Reference to last script element.
 */
dom.scripts.getLast = function() {
  /** @type {?NodeList} */
  var scripts = dom.getElementsByTagName(dom.document, 'SCRIPT');
  return scripts && scripts[scripts.length - 1];
};


/**
 * Loads script.
 * @param {string} src The script source.
 * @param {!Function=} opt_callback The optional callback function.
 */
dom.scripts.load = function(src, opt_callback) {
  /** @type {?Element} */ var script = dom.createElement('SCRIPT');
  /** @type {boolean} */ var loaded = false;
  /** @type {string} */ var state;

  script['src'] = src;
  script['onload'] = script['onreadystatechange'] = function() {
    state = script['readyState'] || 'complete';
    if (!loaded && ('loaded' === state || 'complete' === state)) {
      loaded = true;
      // Handle memory leak in IE.
      script['onload'] = script['onreadystatechange'] = dom.NULL;
      dom.removeNode(script);
      opt_callback && opt_callback();
    }
  };
  dom.appendChild(dom.scripts.last_.parentNode, script);
};


/**
 * The reference to last script element.
 * @type {?Node}
 * @private
 */
dom.scripts.last_ = dom.scripts.getLast();
