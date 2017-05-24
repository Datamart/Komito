/**
 * @fileoverview Komito Analytics namespace for Media trackers.
 *
 * @link http://google.github.io/styleguide/javascriptguide.xml
 * @link http://developers.google.com/closure/compiler/docs/js-for-compiler
 */


/**
 * Defines <code>komito.trackers.media</code> namespace.
 * @namespace
 */
komito.trackers.media = {

  /**
   * Initializes media tracking enabled by <code>trackMedia</code> parameter.
   *
   * @see komito.config
   * @see komito.trackers.media.HTML5
   * @see komito.trackers.media.Vimeo
   * @see komito.trackers.media.YouTube
   */
  init: function() {
    if (komito.config['trackMedia']) {
      komito.trackers.media.HTML5 && new komito.trackers.media.HTML5;
      komito.trackers.media.Vimeo && new komito.trackers.media.Vimeo;
      komito.trackers.media.YouTube && new komito.trackers.media.YouTube;
    }
  }
};
