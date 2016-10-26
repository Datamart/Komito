/**
 * @fileoverview Common JavaScript functions for Komito Analytics website.
 *
 * @see http://google.github.io/styleguide/javascriptguide.xml
 * @see http://developers.google.com/closure/compiler/docs/js-for-compiler
 */

/**
 * Toggles element class name.
 * @param {Node} element The element to add or remove the class on.
 * @param {string} className The class name to toggle.
 */
function toggleClass_(element, className) {
  /** @type {!RegExp} */ var pattern = new RegExp('\\s*' + className);
  if (pattern.test(element.className)) {
    element.className = element.className.replace(pattern, '');
  } else {
    element.className += ' ' + className;
  }
}

/**
 * Initializes menu navigation.
 */
function initMenu_() {
  /** @type {Element} */ var body = doc.querySelector('body');
  /** @type {Element} */ var hamburger = doc.querySelector('.hamburger');
  /** @type {Element} */ var nav = doc.querySelector('.kmt-page-header .kmt-navigation');
  if (hamburger && nav) {
    hamburger.addEventListener('click', function() {
      toggleClass_(body, 'lock');
      toggleClass_(hamburger, 'active');
      toggleClass_(nav, 'active');
    }, false);
  }
}

/**
 * Initializes common behavior.
 */
function init_() {
  initMenu_();
}

/** @type {!Window} */ var win = window;
/** @type {!Document} */ var doc = win.document;

init_();
