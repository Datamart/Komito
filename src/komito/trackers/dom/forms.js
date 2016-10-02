/**
 * Defines <code>komito.trackers.dom.forms</code> namespace.
 * @namespace
 */
komito.trackers.dom.forms = {

  /**
   * Initializes forms tracking.
   */
  init: function() {
    if (komito.config['trackForms']) {
      /** @type {HTMLCollection} */ var forms = dom.document.forms;
      /** @type {number} */ var length = forms.length;

      for (; length;) {
        dom.events.addEventListener(
            forms[--length], dom.events.TYPE.SUBMIT,
            komito.trackers.dom.forms.trackFormListener_);
      }
    }
  },

  /**
   * @param {Event} e The form submit event.
   * @private
   */
  trackFormListener_: function(e) {
    /** @type {HTMLFormElement} */
    var form = /** @type {HTMLFormElement} */ (dom.events.getEventTarget(e));

    /** @type {HTMLCollection} */ var elements = form.elements;
    /** @type {number} */ var length = elements.length;
    /** @type {number} */ var i = 0;
    /** @type {Element} */ var element;

    for (; i < length;) {
      element = elements[i++];
      element.name && komito.track(
          komito.EVENT_ACTION_TYPE, 'form',
          form.getAttribute('name') || form.getAttribute('id') || 'form',
          element.name + ':' + (element.type || element.tagName));
    }

    dom.events.removeEventListener(
        form, dom.events.TYPE.SUBMIT,
        komito.trackers.dom.forms.trackFormListener_);
  }
};
