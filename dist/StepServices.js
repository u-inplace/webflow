/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/booking-flow/controllers/navigation.js":
/*!****************************************************!*\
  !*** ./src/booking-flow/controllers/navigation.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ NavigationController; }
/* harmony export */ });
/* harmony import */ var _helpers_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/dom */ "./src/booking-flow/helpers/dom.js");
/* harmony import */ var _sequence__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sequence */ "./src/booking-flow/controllers/sequence.js");


class NavigationController {
  sequence;

  constructor({
    formId = 'wf-form-step',
    sequence = new _sequence__WEBPACK_IMPORTED_MODULE_1__["default"]()
  }) {
    this.sequence = sequence; // Submit = nextButton

    _helpers_dom__WEBPACK_IMPORTED_MODULE_0__["default"].id(formId).onsubmit = this.onNext.bind(this);
    _helpers_dom__WEBPACK_IMPORTED_MODULE_0__["default"].id('back-button')?.addEventListener('click', this.onBack.bind(this)); // Browser history

    window.onpopstate = this.onHistoryBack.bind(this);
  }
  /**
   * @param {Event} e
   */


  onNext(e) {
    e.preventDefault();
    window.location.href = this.sequence.next();
  }

  onBack() {
    window.location.href = this.sequence.prev();
  }

  onHistoryBack() {
    this.sequence.prev();
  }

}

/***/ }),

/***/ "./src/booking-flow/controllers/sequence.js":
/*!**************************************************!*\
  !*** ./src/booking-flow/controllers/sequence.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "STEP": function() { return /* binding */ STEP; },
/* harmony export */   "default": function() { return /* binding */ Sequence; }
/* harmony export */ });
/* harmony import */ var js_cookie__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! js-cookie */ "./node_modules/js-cookie/dist/js.cookie.mjs");

/**
 * @typedef {string} StepCode
 */

/**
 * @enum {StepCode}
 */

const STEP = {
  PostalCode: '/booking',
  Services: '/booking/services',
  Ironing: '/booking/ironing',
  Cleaning: '/booking/cleaning',
  Duration: '/booking/duration',
  Availability: '/booking/availability',
  Confirmation: '/booking/confirmation'
};
const COOKIE_BOOKING = '__booking';
/**
 * Sequence Controller
 */

class Sequence {
  #current;
  list;
  /**
   * @param {StepCode} curr
   */

  constructor(curr) {
    const cookieStr = js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].get(COOKIE_BOOKING);

    if (cookieStr) {
      const cookie = JSON.parse(cookieStr);
      this.list = cookie.list;
      console.log(`Seq.new :: cookie found ::  ${JSON.stringify(cookie, null, 2)}`);
    } else this.init({});

    this.current = curr;
    console.log(`Seq :: curr (${this.#current})`);
  }

  init({
    ironing = false,
    cleaning = false
  } = {}) {
    let seq = [STEP.PostalCode, STEP.Services];
    if (ironing) seq.push(STEP.Ironing);
    if (cleaning) seq.push(STEP.Cleaning);
    seq = seq.concat([STEP.Duration, STEP.Availability, STEP.Confirmation]);
    this.list = seq;
    console.log(`Seq.init :: curr (${this.#current}) :: ${JSON.stringify(this.list, null, 2)}`);
    this.setCookies();
  }

  setCookies() {
    js_cookie__WEBPACK_IMPORTED_MODULE_0__["default"].set(COOKIE_BOOKING, JSON.stringify({
      seq: this.list
    }), {
      secure: true,
      sameSite: 'strict'
    });
  }

  next() {
    this.#current++;
    console.log(`Seq : ${this.list} ; curr : ${this.#current}`);
    return this.list[this.#current];
  }

  prev() {
    this.#current--;
    console.log(`Seq : ${this.list} ; curr : ${this.#current}`);
    return this.list[this.#current];
  }

  get total() {
    return this.list.length;
  }

  get current() {
    return this.list[this.#current];
  }
  /**
   * @param {string} current
   */


  set current(curr) {
    const currIndex = Object.values(STEP).findIndex(e => e === curr);
    if (currIndex >= 0) this.#current = currIndex;
  }

  get currentIndex() {
    return this.#current;
  }

}


/***/ }),

/***/ "./src/booking-flow/controllers/step.js":
/*!**********************************************!*\
  !*** ./src/booking-flow/controllers/step.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ StepController; }
/* harmony export */ });
/* harmony import */ var _helpers_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/dom */ "./src/booking-flow/helpers/dom.js");
/* harmony import */ var _navigation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./navigation */ "./src/booking-flow/controllers/navigation.js");
/* harmony import */ var _sequence__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sequence */ "./src/booking-flow/controllers/sequence.js");



class StepController {
  /**
   * @type {HTMLFormElement}
   */
  form;
  /**
   * @type {NavigationController}
   */

  nav;
  /**
   * Create new StepController
   * @param {import('./sequence').StepCode} curr Current step
   * @param {string} formId Step form Id
   */

  constructor(curr, formId = 'wf-form-step') {
    this.form = _helpers_dom__WEBPACK_IMPORTED_MODULE_0__["default"].id(formId);
    this.nav = new _navigation__WEBPACK_IMPORTED_MODULE_1__["default"]({
      formId,
      sequence: new _sequence__WEBPACK_IMPORTED_MODULE_2__["default"](curr)
    });
  }
  /**
   * Initialize controller
   */


  init() {
    this.setupInputHandlers();
    _helpers_dom__WEBPACK_IMPORTED_MODULE_0__["default"].nextButtonDisabled = true;
    this.toggleNext();
  }
  /**
   * Create event handlers
   */


  setupInputHandlers() {
    this.form.querySelectorAll('input').forEach(input => {
      // Do not mess with submit button
      if (input.type === 'submit') return;
      const inputEvent = {
        radio: 'click',
        number: 'input'
      };
      const event = inputEvent[input.type] || 'change';
      input.addEventListener(event, this.toggleNext.bind(this));
    });
  }
  /**
   * Toggle next button active
   */


  toggleNext() {
    _helpers_dom__WEBPACK_IMPORTED_MODULE_0__["default"].nextButtonDisabled = this.isNextDisabled;
  }
  /**
   * Control next button
   */
  // eslint-disable-next-line class-methods-use-this


  get isNextDisabled() {
    return false;
  }

}

/***/ }),

/***/ "./src/booking-flow/helpers/dom.js":
/*!*****************************************!*\
  !*** ./src/booking-flow/helpers/dom.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
class Dom {
  /**
   * Get Element by Id
   *
   * @param {string} id element id
   * @returns {Element}
   */
  static id(id) {
    return document.getElementById(id);
  }
  /**
   * Query selector
   *
   * @param {string} query Dom query string
   * @returns {Element}
   */


  static q(query) {
    return document.querySelector(query);
  }
  /**
   * Query selector all
   *
   * @param {string} query Dom query string
   * @returns {NodeList}
   */


  static qall(query) {
    return document.querySelectorAll(query);
  }
  /**
   * Message popup
   * @param {string} id
   * @returns {Promise}
   */


  static toast(id) {
    const toastBlock = document.getElementById(id);
    toastBlock.classList.add('active');
    return setTimeout(() => {
      toastBlock.classList.remove('active');
    }, 1000 * 4);
  }

  static set nextButtonDisabled(isDisabled) {
    const nextButton = document.querySelector('.next-button-flow');
    nextButton.disabled = isDisabled;
    if (isDisabled) nextButton.classList.add('disabled');else nextButton.classList.remove('disabled');
  }

}

const dom = Dom;
/* harmony default export */ __webpack_exports__["default"] = (dom);

/***/ }),

/***/ "./node_modules/js-cookie/dist/js.cookie.mjs":
/*!***************************************************!*\
  !*** ./node_modules/js-cookie/dist/js.cookie.mjs ***!
  \***************************************************/
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/*! js-cookie v3.0.1 | MIT */
/* eslint-disable no-var */
function assign (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }
  return target
}
/* eslint-enable no-var */

/* eslint-disable no-var */
var defaultConverter = {
  read: function (value) {
    if (value[0] === '"') {
      value = value.slice(1, -1);
    }
    return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
  },
  write: function (value) {
    return encodeURIComponent(value).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    )
  }
};
/* eslint-enable no-var */

/* eslint-disable no-var */

function init (converter, defaultAttributes) {
  function set (key, value, attributes) {
    if (typeof document === 'undefined') {
      return
    }

    attributes = assign({}, defaultAttributes, attributes);

    if (typeof attributes.expires === 'number') {
      attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
    }
    if (attributes.expires) {
      attributes.expires = attributes.expires.toUTCString();
    }

    key = encodeURIComponent(key)
      .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
      .replace(/[()]/g, escape);

    var stringifiedAttributes = '';
    for (var attributeName in attributes) {
      if (!attributes[attributeName]) {
        continue
      }

      stringifiedAttributes += '; ' + attributeName;

      if (attributes[attributeName] === true) {
        continue
      }

      // Considers RFC 6265 section 5.2:
      // ...
      // 3.  If the remaining unparsed-attributes contains a %x3B (";")
      //     character:
      // Consume the characters of the unparsed-attributes up to,
      // not including, the first %x3B (";") character.
      // ...
      stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
    }

    return (document.cookie =
      key + '=' + converter.write(value, key) + stringifiedAttributes)
  }

  function get (key) {
    if (typeof document === 'undefined' || (arguments.length && !key)) {
      return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    var jar = {};
    for (var i = 0; i < cookies.length; i++) {
      var parts = cookies[i].split('=');
      var value = parts.slice(1).join('=');

      try {
        var foundKey = decodeURIComponent(parts[0]);
        jar[foundKey] = converter.read(value, foundKey);

        if (key === foundKey) {
          break
        }
      } catch (e) {}
    }

    return key ? jar[key] : jar
  }

  return Object.create(
    {
      set: set,
      get: get,
      remove: function (key, attributes) {
        set(
          key,
          '',
          assign({}, attributes, {
            expires: -1
          })
        );
      },
      withAttributes: function (attributes) {
        return init(this.converter, assign({}, this.attributes, attributes))
      },
      withConverter: function (converter) {
        return init(assign({}, this.converter, converter), this.attributes)
      }
    },
    {
      attributes: { value: Object.freeze(defaultAttributes) },
      converter: { value: Object.freeze(converter) }
    }
  )
}

var api = init(defaultConverter, { path: '/' });
/* eslint-enable no-var */

/* harmony default export */ __webpack_exports__["default"] = (api);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!***********************************************!*\
  !*** ./src/booking-flow/packages/services.js ***!
  \***********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _controllers_sequence__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../controllers/sequence */ "./src/booking-flow/controllers/sequence.js");
/* harmony import */ var _controllers_step__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../controllers/step */ "./src/booking-flow/controllers/step.js");
/* eslint-disable class-methods-use-this */

/* eslint-disable vars-on-top */

/* eslint-disable no-use-before-define */

/* eslint-disable no-var */



class ServicesStep extends _controllers_step__WEBPACK_IMPORTED_MODULE_1__["default"] {
  constructor() {
    super(_controllers_sequence__WEBPACK_IMPORTED_MODULE_0__.STEP.Services);
  }

  init() {
    super.init();
    this.nav.sequence.init();
  }
  /**
   * @returns {boolean}
   */


  get isNextDisabled() {
    return false;
  }

}

var Webflow = Webflow || window.Webflow || [];
Webflow.push(() => {
  const step = new ServicesStep();
  step.init();
});
window.addEventListener('load', () => {
  console.log('onload'); // eslint-disable-next-line no-restricted-globals

  console.log(`pushState: ${typeof history.pushState}`);
  window.addEventListener('hashchange', () => console.log('hashchange'));
  window.addEventListener('popstate', () => console.log('onpopstate'));
});
}();
/******/ })()
;
//# sourceMappingURL=StepServices.js.map