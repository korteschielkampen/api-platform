(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 750);
/******/ })
/************************************************************************/
/******/ ({

/***/ 750:
/***/ (function(module, exports) {

throw new Error("Module build failed: SyntaxError: Unexpected token, expected , (48:48)\n\n\u001b[0m \u001b[90m 46 | \u001b[39m    \u001b[36mif\u001b[39m (err) {\n \u001b[90m 47 | \u001b[39m      readableLog(\u001b[32m\"STORE TO AWS --- FAILED\"\u001b[39m\u001b[33m,\u001b[39m err)\n\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m 48 | \u001b[39m      respond({ status\u001b[33m:\u001b[39m \u001b[35m400\u001b[39m\u001b[33m,\u001b[39m body\u001b[33m:\u001b[39m {error\u001b[33m:\u001b[39m err })\u001b[33m;\u001b[39m\n \u001b[90m    | \u001b[39m                                                \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\n \u001b[90m 49 | \u001b[39m    } \u001b[36melse\u001b[39m {\n \u001b[90m 50 | \u001b[39m      readableLog(\u001b[32m\"STORE TO AWS --- SUCCESFULL\"\u001b[39m)\n \u001b[90m 51 | \u001b[39m      respond({ status\u001b[33m:\u001b[39m \u001b[35m200\u001b[39m\u001b[33m,\u001b[39m body\u001b[33m:\u001b[39m \u001b[32m\"Aangevraagd en opgeslagen - (Status code: 200)\"\u001b[39m })\u001b[33m;\u001b[39m\u001b[0m\n");

/***/ })

/******/ })));