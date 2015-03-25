# Komito Collector at glance
The Komito Collector is a tool to unlock the power of digital analytics.
It enriches analytics data with important information about visitor's behavior.

Features  | Compatibility
------------- | -------------
Actions  | [Adobe Tag Loader](http://www.adobe.com/solutions/digital-analytics.html)
Downloads  | [Baidu Analytics](http://tongji.baidu.com/)
External links  | [ClickTale](http://www.clicktale.com/)
Form submissions  | [Google Analytics](http://www.google.com/analytics/)
Social widgets  | [Urchin](https://support.google.com/urchin)

Caring about privacy and security, the Komito Collector **does not store** any data.

## Integration Komito Collector
In order to install Komito Collector on your website simply add a line of code just before closing `</body>` tag:

```html
<script src="/min/komito.js" type="text/javascript"></script>
```

**Default Komito Collector configuration:**

```html
<script>
  var _komito = _komito || {
    'trackTwitter': 1,   // Tracks Twitter widgets if they presents on page.
    'trackFacebook': 1,  // Tracks Facebook widgets if they presents on page.
    'trackLinkedIn': 1,  // Tracks LinkedIn plug-ins if they presents on page.
    'trackDownloads': 1, // Tracks download links.
    'trackOutbound': 1,  // Tracks outbound links.
    'trackForms': 1,     // Tracks forms submissions.
    'trackUsers': 1,     // Tracks users logged in to social networks.
    'trackActions': 1,   // Tracks 'mailto', 'tel', 'sms' and 'skype' actions.
    'trackPrint': 1,     // Tracks page prints.
    'debugMode': 0       // Enables 'debug' mode.
  };
</script>
```
