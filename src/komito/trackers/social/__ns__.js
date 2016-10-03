/**
 * Defines <code>komito.trackers.social</code> namespace.
 * @namespace
 */
komito.trackers.social = {

  /**
   * Initializes social events tracking.
   */
  init: function() {
    /** @type {!Object.<string, Function>} */ var map = {
      'trackFacebook': komito.trackers.social.Facebook,
      'trackLinkedIn': komito.trackers.social.LinkedIn,
      'trackTwitter': komito.trackers.social.Twitter,
      'trackUsers': komito.trackers.social.Users
    };
    /** @type {string} */ var key;

    for (key in map) {
      komito.config[key] && new map[key];
    }
  }
};
