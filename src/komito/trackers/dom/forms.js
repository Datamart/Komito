


/**
 * Defines <code>komito.trackers.dom.forms</code> constructor.
 * @constructor
 */
komito.trackers.dom.Forms = function() {

  /**
   * Initializes forms tracking.
   * @private
   */
  function init_() {
    if (komito.config['trackForms']) {
      /** @type {?HTMLCollection} */ var forms = dom.document.forms;
      /** @type {number} */ var length = forms.length;

      for (; length;) {
        dom.events.addEventListener(
            forms[--length], dom.events.TYPE.SUBMIT, listener_);
      }
    }
  }

  /**
   * @param {?Event} e The form submit event.
   * @private
   */
  function listener_(e) {
    /** @type {!HTMLFormElement} */
    var form = /** @type {!HTMLFormElement} */ (dom.events.getEventTarget(e));

    /** @type {!HTMLCollection} */ var elements = form.elements;
    /** @type {number} */ var length = elements.length;
    /** @type {number} */ var i = 0;

    /** @type {string} */ var action = form.getAttribute('action');
    /** @type {string} */ var identifier = form.getAttribute('name') ||
        form.getAttribute('id') ||
        form.className.replace(/\W+/g, '-') ||
        (action && util.StringUtils.hash(action)) ||
        ('form-' + ++index_);

    /** @type {!Element} */ var element;

    for (; i < length;) {
      element = elements[i++];
      element.name && komito.track(
          komito.EVENT_ACTION_TYPE, 'form', identifier,
          element.name + ':' + (element.type || element.tagName));
    }

    dom.events.removeEventListener(form, dom.events.TYPE.SUBMIT, listener_);
  }

  /**
   * The last submitted form index.
   * @type {number}
   * @private
   */
  var index_ = 0;

  // Initializing forms events tracking.
  init_();
};
