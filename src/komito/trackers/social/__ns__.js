/**
 * Defines <code>komito.trackers.social</code> namespace.
 * @namespace
 */
komito.trackers.social = {

  /**
   * Map of social networks.
   * @type {!Object.<string, string>}
   */
  NETWORKS: {
    'plus.google.com': 'Google+',
    'plus.url.google.com': 'Google+',
    'blogspot.com': 'Blogger',
    'facebook.com': 'Facebook',
    'on.fb.me': 'Facebook',
    'fb.me': 'Facebook',
    'fb.com': 'Facebook',
    'twitter.com': 'Twitter',
    't.co': 'Twitter',
    'linkedin.com': 'LinkedIn',
    'myspace.com': 'MySpace',
    'vk.com': 'VKontakte',
    'odnoklassniki.ru': 'Odnoklassniki',
    'xing.com': 'Xing',
    'youtube.com': 'YouTube',
    'youtu.be': 'YouTube',
    'twoo.com': 'Twoo',
    'reddit.com': 'Reddit',
    'pinterest.com': 'Pinterest',
    'digg.com': 'Digg',
    '4sq.com': 'Foursquare',
    'foursquare.com': 'Foursquare',
    'hi.baidu.com': 'Baidu Space'
  },

  /**
   * Mapping for tracking logged in users.
   * For Facebook users see "komito.trackers.social.users.track" method.
   * @type {!Object.<string, string>}
   * @see komito.trackers.social.users.track
   */
  USERS: {
    'Google': 'https://accounts.google.com/CheckCookie?continue=' +
        'https%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fimages%2Flogos%2F' +
        'accounts_logo.png&amp;followup=https%3A%2F%2Fwww.google.com%2F' +
        'intl%2Fen%2Fimages%2Flogos%2Faccounts_logo.png&amp;' +
        'chtml=LoginDoneHtml&amp;checkedDomains=youtube&amp;' +
        'checkConnection=youtube%3A291%3A1',
    'Google+': 'https://plus.google.com/up/?continue=' +
        'https%3A%2F%2Fwww.google.com%2Fintl%2Fen%2Fimages%2Flogos%2F' +
        'accounts_logo.png',
    'Twitter': 'https://twitter.com/login?redirect_after_login=' +
        'https%3A%2F%2Fplatform.twitter.com%2Fwidgets%2Fimages%2Fbtn.png'
  },

  init: function() {
    if (komito.config['trackTwitter'] && komito.trackers.social.twitter)
      komito.trackers.social.twitter.track();
    if (komito.config['trackFacebook'] && komito.trackers.social.facebook)
      komito.trackers.social.facebook.track();
    if (komito.config['trackLinkedIn'] && komito.trackers.social.linkedin)
      komito.trackers.social.linkedin.track();
    if (komito.config['trackUsers'] && komito.trackers.social.users)
      komito.trackers.social.users.track();
  }
};
