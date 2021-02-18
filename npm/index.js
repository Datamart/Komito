/**
 * @fileoverview Komito Analytics is an enhancement for the most popular
 * analytics software. It unlocks power of digital analytics with additional
 * insights about visitor's behavior.
 *
 * @see http://google.github.io/styleguide/javascriptguide.xml
 * @see http://developers.google.com/closure/compiler/docs/js-for-compiler
 * @see https://github.com/Datamart/Komito/
 */



module.exports = {
  /**
   * Initializes Komito Analytics extension.
   * @param {!Object=} opt_options Optional tracking options.
   */
  init: (opt_options) => {
    const root = ('object' === typeof self && self.self === self && self) ||
                 ('object' === typeof global && global.global === global && global);
    const doc = root.document;

    if (doc) {
      root['_komito'] = root['_komito'] || {};

      if (opt_options) {
        for (let key in opt_options) {
          if (opt_options.hasOwnProperty(key)) {
            root['_komito'][key] = opt_options[key];
          }
        }
      }

      const script = doc.createElement('SCRIPT');
      const scripts = doc.getElementsByTagName('SCRIPT');
      const parent = scripts[scripts.length - 1].parentNode;

      script.async = true;
      script.src = 'https://komito.net/komito.js';
      (parent || doc.body).appendChild(script);
    }
  }
};
