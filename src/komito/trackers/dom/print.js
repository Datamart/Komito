/**
 * Defines <code>komito.trackers.dom.print</code> namespace.
 * @namespace
 */
komito.trackers.dom.print = {

  /**
   * Initializes print tracking.
   */
  init: function() {
    if (komito.config['trackPrint']) {
      /** @type {function(string):MediaQueryList} */
      var matchMedia = dom.context['matchMedia'];
      /** @type {MediaQueryList} */
      var queryList = matchMedia && matchMedia('print');

      /**
       * @param {Event} e The print event.
       */
      function listener(e) {
        komito.track(
            komito.EVENT_ACTION_TYPE, 'print',
            dom.document.title, location.href);
        queryList && queryList['removeListener'](listener);
        dom.events.removeEventListener(dom.context, 'afterprint', listener);
        listener = dom.NULL;
      }

      queryList && queryList['addListener'](listener);
      dom.events.addEventListener(dom.context, 'afterprint', listener);
    }
  }
};
