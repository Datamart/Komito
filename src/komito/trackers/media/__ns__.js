/**
 * Defines <code>komito.trackers.media</code> namespace.
 * @namespace
 */
komito.trackers.media = {
  init: function() {
    if (komito.config['trackMedia']) {
      komito.trackers.media.html5 && komito.trackers.media.html5.init();
      komito.trackers.media.youtube && komito.trackers.media.youtube.init();
      komito.trackers.media.vimeo && komito.trackers.media.vimeo.init();
    }
  }
};
