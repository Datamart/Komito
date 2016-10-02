/**
 * Defines <code>komito.trackers.dom</code> namespace.
 * @namespace
 */
komito.trackers.dom = {
  init: function() {
    komito.trackers.dom.forms && komito.trackers.dom.forms.init();
    komito.trackers.dom.links && komito.trackers.dom.links.init();
    komito.trackers.dom.print && komito.trackers.dom.print.init();
    komito.trackers.dom.scroll && komito.trackers.dom.scroll.init();
  }
};
