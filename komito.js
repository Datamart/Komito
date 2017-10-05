/* @license http://www.apache.org/licenses/LICENSE-2.0 */
(function() {
  /** @type {string} */ var src = 'https://komito.net/komito.js';
  /** @type {Element} */ var script = document.createElement('SCRIPT');

  script.src = src;
  document.body.appendChild(script);

  console.log('Deprecated. Please use "' + src + '" instead.');
})();
