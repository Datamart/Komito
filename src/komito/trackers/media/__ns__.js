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
    /** @type {!Array|!Function|number|string} */
    var trackMedia = komito.config['trackMedia'];
    /** @type {!Array.<string>} */ var types = ['html5', 'vimeo', 'youtube'];
    /** @type {string} */ var type;
    /** @type {number} */ var length;

    if (trackMedia) {
      if (util.Array.isArray(trackMedia)) {
        types = /** @type {!Array.<string>} */ (trackMedia);
      }

      length = types.length;
      for (; length--;) {
        type = types[length].toLowerCase();
        if ('html5' == type)
          komito.trackers.media.HTML5 && new komito.trackers.media.HTML5;
        else if ('vimeo' == type)
          komito.trackers.media.Vimeo && new komito.trackers.media.Vimeo;
        else if ('youtube' == type)
          komito.trackers.media.YouTube && new komito.trackers.media.YouTube;
      }
    }
  }
};
