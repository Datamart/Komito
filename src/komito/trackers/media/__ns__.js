/**
 * Defines <code>komito.trackers.media</code> namespace.
 * @namespace
 */
komito.trackers.media = {
  init: function() {
    if (komito.config['trackMedia']) {
      komito.trackers.media.HTML5 && new komito.trackers.media.HTML5;
      komito.trackers.media.Vimeo && new komito.trackers.media.Vimeo;
      komito.trackers.media.YouTube && new komito.trackers.media.YouTube;
    }
  }
};
