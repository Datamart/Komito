


/**
 * Defines <code>komito.trackers.dom.print</code> constructor.
 * @constructor
 */
komito.trackers.dom.Print = function() {

  /**
   * Initializes print tracking.
   * @private
   */
  function init_() {
    if (komito.config['trackPrint']) {
      /** @type {function(string):MediaQueryList} */
      var matchMedia = dom.context['matchMedia'];
      mql_ = matchMedia && matchMedia('print');

      mql_ ?
          mql_['addListener'](listener_) :
          dom.events.addEventListener(dom.context, 'afterprint', listener_);
    }
  }

  /**
   * @param {Event} e The print event.
   * @private
   */
  function listener_(e) {
    komito.track(
        komito.EVENT_ACTION_TYPE, 'print',
        dom.document.title, location.href);
    mql_ ?
        mql_['removeListener'](listener_) :
        dom.events.removeEventListener(dom.context, 'afterprint', listener_);
    mql_ = listener_ = dom.NULL;
  }

  /**
   * @type {MediaQueryList}
   * @private
   */
  var mql_;

  // Initializing print events tracking.
  init_();
};
