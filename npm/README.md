# Komito Analytics [![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Komito%20Analytics%20-%20Unlock%20the%20power%20of%20digital%20analytics%20with%20additional%20insights%20about%20visitor%27s%20behavior.&url=https://komito.net/&via=GitHub&hashtags=KomitoAnalytics,GoogleAnalytics,AdobeAnalytics,EventTracking,MediaTracking)
[![License](http://img.shields.io/:license-apache-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0.html) [![Website](https://img.shields.io/website-up-down-green-red/https/komito.net.svg?style=flat)](https://komito.net) [![NPM version](https://img.shields.io/npm/v/komito-analytics.svg?style=flat)](https://npmjs.org/package/komito-analytics) [![NPM downloads](https://img.shields.io/npm/dm/komito-analytics.svg?style=flat)](https://npmjs.org/package/komito-analytics)

Komito Analytics is a free, open-source enhancement for the most popular web analytics software.<br>
It unlocks power of digital analytics with additional insights about visitor's behavior.<br>
For more information please visit [Komito Analytics project page](https://komito.net).

## Install

```
$ npm install komito-analytics
```

## Usage

```js
const komito = require('komito-analytics');

// The default configuration can be omitted and only changed properties can be included.
// @see https://komito.net/integration/
komito.init({
  'trackTwitter': 1,     // Tracks Twitter events if widget is presented on page.
  'trackFacebook': 1,    // Tracks Facebook events if widget is presented on page.
  'trackLinkedIn': 1,    // Tracks LinkedIn events if plugin is presented on page.
  'trackDownloads': 1,   // Tracks files download links.
  'trackOutbound': 1,    // Tracks outbound links.
  'trackForms': 1,       // Tracks forms submissions.
  'trackUsers': 1,       // Tracks pageviews by users logged in to social networks.
  'trackActions': 1,     // Tracks 'mailto', 'tel', 'sms' and 'skype' actions.
  'trackPrint': 1,       // Tracks page print actions.
  'trackOrientation': 1, // Tracks orientation change on mobile devices.
  'trackAdblock': 0,     // Tracks page views with blocked ads. (Experimental)
  'trackErrorPages': 0,  // Tracks error pages. (Experimental)
  'sendHeartbeat': 0,    // Sends heartbeat event. (Default interval 30 seconds)
  'debugMode': 0,        // Prints all requests to console.
  'trackScroll': [25, 50, 75, 100], // Tracks scroll depth.
  'trackMedia': ['html5', 'vimeo', 'youtube'], // Tracks HTML5 video, audio, Vimeo and YouTube players events.
  'nonInteraction': ['adblock', 'audio', 'form', 'heartbeat',
                     'orientation', 'print', 'scroll', 'video'] // List of non interaction events.
});
```