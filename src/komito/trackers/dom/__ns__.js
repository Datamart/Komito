/**
 * Defines <code>komito.trackers.dom</code> namespace.
 * @namespace
 */
komito.trackers.dom = {
  init: function() {
    komito.trackers.dom.Forms && new komito.trackers.dom.Forms;
    komito.trackers.dom.Links && new komito.trackers.dom.Links;
    komito.trackers.dom.Print && new komito.trackers.dom.Print;
    komito.trackers.dom.Scroll && new komito.trackers.dom.Scroll;
    komito.trackers.dom.Orientation && new komito.trackers.dom.Orientation;
  }
};
