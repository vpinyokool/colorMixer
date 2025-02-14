// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"colorExtractor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getImageDominantColor = getImageDominantColor;
exports.rgbToHex = rgbToHex;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Function to get RGB values from an Image object or URL
function getImagePixels(_x) {
  return _getImagePixels.apply(this, arguments);
} // Function to get color histogram from RGB pixels
function _getImagePixels() {
  _getImagePixels = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(input) {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", new Promise(function (resolve, reject) {
            var processImage = function processImage(img) {
              var canvas = document.createElement('canvas');
              var ctx = canvas.getContext('2d');
              canvas.width = img.width;
              canvas.height = img.height;

              // Draw image and get pixel data
              ctx.drawImage(img, 0, 0);
              try {
                var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                resolve(imageData.data);
              } catch (error) {
                reject(new Error('Error getting image data: ' + error.message));
              }
            };
            if (input instanceof HTMLImageElement) {
              if (input.complete) {
                processImage(input);
              } else {
                input.onload = function () {
                  return processImage(input);
                };
                input.onerror = function (error) {
                  return reject(new Error('Error loading image: ' + error));
                };
              }
            } else {
              // Assume input is URL string
              var img = new Image();
              img.crossOrigin = "anonymous";
              img.onload = function () {
                return processImage(img);
              };
              img.onerror = function (error) {
                return reject(new Error('Error loading image: ' + error));
              };
              img.src = input;
            }
          }));
        case 1:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getImagePixels.apply(this, arguments);
}
function getImageColorHistogram(pixels) {
  // Initialize histogram arrays for R, G, B channels
  var histogram = [new Array(256).fill(0),
  // R channel
  new Array(256).fill(0),
  // G channel
  new Array(256).fill(0) // B channel
  ];
  var colorCount = [0, 0, 0]; // Count for each channel

  // Process each pixel (RGB values are in groups of 4 due to RGBA format)
  for (var i = 0; i < pixels.length; i += 4) {
    // R channel
    histogram[0][pixels[i]]++;
    colorCount[0]++;

    // G channel
    histogram[1][pixels[i + 1]]++;
    colorCount[1]++;

    // B channel
    histogram[2][pixels[i + 2]]++;
    colorCount[2]++;
  }
  return {
    histogram: histogram,
    colorCount: colorCount
  };
}

// Function to get dominant color using median calculation
function getImageDominantColor(_x2) {
  return _getImageDominantColor.apply(this, arguments);
} // Helper function to convert RGB array to hex color
function _getImageDominantColor() {
  _getImageDominantColor = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(input) {
    var pixels, _getImageColorHistogr, histogram, colorCount, dominantColor, channel, median, count, colorValue;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return getImagePixels(input);
        case 3:
          pixels = _context2.sent;
          _getImageColorHistogr = getImageColorHistogram(pixels), histogram = _getImageColorHistogr.histogram, colorCount = _getImageColorHistogr.colorCount;
          dominantColor = []; // Calculate median for each channel (R, G, B)
          channel = 0;
        case 7:
          if (!(channel < 3)) {
            _context2.next = 22;
            break;
          }
          median = Math.floor(colorCount[channel] / 2);
          count = 0; // Find the color value where count exceeds median
          colorValue = 0;
        case 11:
          if (!(colorValue < 256)) {
            _context2.next = 19;
            break;
          }
          count += histogram[channel][colorValue];
          if (!(count > median)) {
            _context2.next = 16;
            break;
          }
          dominantColor.push(colorValue);
          return _context2.abrupt("break", 19);
        case 16:
          colorValue++;
          _context2.next = 11;
          break;
        case 19:
          channel++;
          _context2.next = 7;
          break;
        case 22:
          return _context2.abrupt("return", dominantColor);
        case 25:
          _context2.prev = 25;
          _context2.t0 = _context2["catch"](0);
          console.error('Error getting dominant color:', _context2.t0);
          throw _context2.t0;
        case 29:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 25]]);
  }));
  return _getImageDominantColor.apply(this, arguments);
}
function rgbToHex(rgb) {
  return '#' + rgb.map(function (x) {
    var hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Example usage:
// getImageDominantColor('https://example.com/image.jpg')
//     .then(dominantColor => {
//         console.log('Dominant RGB:', dominantColor);
//         console.log('Dominant Hex:', rgbToHex(dominantColor));
//     })
//     .catch(error => console.error(error));
},{}],"js/colorMixer.js":[function(require,module,exports) {
"use strict";

var _colorExtractor = require("../colorExtractor.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; } // Import color extraction functions
/**
 * Color Mixer Module
 * Handles color conversions and UI updates for the color mixer application
 */

var ColorMixer = {
  // Add darkMode state
  state: {
    darkMode: false
  },
  // Color conversion utilities
  utils: {
    clamp: function clamp(v, min, max) {
      return Math.max(min, Math.min(v, max));
    },
    hexToRgb: function hexToRgb(hex) {
      hex = hex.replace("#", "");
      if (hex.length === 3) hex = hex.replace(/(.)/g, "$1$1");
      var n = parseInt(hex, 16);
      return {
        r: n >> 16 & 255,
        g: n >> 8 & 255,
        b: n & 255
      };
    },
    rgbToHsb: function rgbToHsb(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      var max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d = max - min;
      var h = 0;
      var s = max === 0 ? 0 : d / max;
      var v = max;
      if (d !== 0) {
        if (max === r) {
          h = (g - b) / d + (g < b ? 6 : 0);
        } else if (max === g) {
          h = (b - r) / d + 2;
        } else {
          h = (r - g) / d + 4;
        }
        h *= 60;
        if (h < 0) h += 360;
      }
      return {
        h: h,
        s: s,
        b: v
      };
    },
    hsbToRgb: function hsbToRgb(h, s, b) {
      var c = b * s,
        x = c * (1 - Math.abs(h / 60 % 2 - 1)),
        m = b - c;
      var r = 0,
        g = 0,
        bl = 0;
      if (h < 60) {
        r = c;
        g = x;
      } else if (h < 120) {
        r = x;
        g = c;
      } else if (h < 180) {
        g = c;
        bl = x;
      } else if (h < 240) {
        g = x;
        bl = c;
      } else if (h < 300) {
        r = x;
        bl = c;
      } else {
        r = c;
        bl = x;
      }
      return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((bl + m) * 255)
      };
    },
    rgbToHex: function rgbToHex(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    },
    formatRgb: function formatRgb(r, g, b) {
      return "R".concat(String(r).padStart(3, '0'), "G").concat(String(g).padStart(3, '0'), "B").concat(String(b).padStart(3, '0'));
    },
    formatHsb: function formatHsb(h, s, b) {
      var hue = Math.round(h);
      var sat = Math.round(s * 100);
      var bri = Math.round(b * 100);
      return "H".concat(String(hue).padStart(3, '0'), "S").concat(String(sat).padStart(3, '0'), "B").concat(String(bri).padStart(3, '0'));
    },
    testHsb: function testHsb(hex) {
      var rgb = this.hexToRgb(hex);
      console.log('RGB:', rgb);
      var hsb = this.rgbToHsb(rgb.r, rgb.g, rgb.b);
      console.log('HSB:', {
        h: Math.round(hsb.h),
        s: Math.round(hsb.s * 100),
        b: Math.round(hsb.b * 100)
      });
    },
    // Add a new utility function to handle CORS proxy
    getCorsUrl: function getCorsUrl(url) {
      return "https://api.allorigins.win/raw?url=".concat(encodeURIComponent(url));
    },
    // Add back Pinterest URL check
    isPinterestUrl: function isPinterestUrl(url) {
      return url.includes('pinimg.com') || url.includes('pinterest.com');
    },
    // Remove isPinterestUrl function since we'll handle all URLs the same way
    updateBackgroundImage: function updateBackgroundImage() {
      return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var imgUrl, img, isPinterest, imageUrl, dominantColor, hexColor;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              imgUrl = $("#imgInput").val();
              if (imgUrl) {
                _context.next = 5;
                break;
              }
              $(".app-background").css({
                "background": "none",
                "background-color": "#111111"
              });
              $(".loading-bar").removeClass("active");
              return _context.abrupt("return");
            case 5:
              _context.prev = 5;
              // Show loading bar
              $(".loading-bar").addClass("active");

              // Create a new image to test loading
              img = new Image();
              img.crossOrigin = "anonymous";

              // For Pinterest images, use proxy URL directly
              // For other images, try direct loading
              isPinterest = ColorMixer.utils.isPinterestUrl(imgUrl);
              imageUrl = isPinterest ? ColorMixer.utils.getCorsUrl(imgUrl) : imgUrl; // Load the image
              _context.next = 13;
              return new Promise(function (resolve, reject) {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imageUrl;
              });
            case 13:
              // Update background with the successful URL
              $(".app-background").css({
                "background": "url(".concat(imageUrl, ")"),
                "opacity": "1",
                "background-size": "cover",
                "background-position": "center"
              });

              // Extract dominant color using the already loaded image
              _context.next = 16;
              return (0, _colorExtractor.getImageDominantColor)(img);
            case 16:
              dominantColor = _context.sent;
              hexColor = (0, _colorExtractor.rgbToHex)(dominantColor);
              console.log('Extracted color:', hexColor);
              $("#colorInput").val(hexColor).trigger('input');
              _context.next = 26;
              break;
            case 22:
              _context.prev = 22;
              _context.t0 = _context["catch"](5);
              console.error('Error processing image:', _context.t0);
              $(".app-background").css({
                "background": "none",
                "background-color": "#111111"
              });
            case 26:
              _context.prev = 26;
              // Always hide loading bar when done
              $(".loading-bar").removeClass("active");
              return _context.finish(26);
            case 29:
            case "end":
              return _context.stop();
          }
        }, _callee, null, [[5, 22, 26, 29]]);
      }))();
    },
    updateBlurAmount: function updateBlurAmount() {
      var blurAmount = $("#blurAmount").val();
      $(".modal").css({
        "backdrop-filter": "blur(".concat(blurAmount, "px)"),
        "-webkit-backdrop-filter": "blur(".concat(blurAmount, "px)")
      });
    },
    updateDarkMode: function updateDarkMode() {
      ColorMixer.state.darkMode = $("#darkModeToggle").is(":checked");
      $(".modal").toggleClass("dark-mode", ColorMixer.state.darkMode);

      // Update the mix label based on dark mode
      var baseColor = ColorMixer.state.darkMode ? "black" : "white";
      $(".slider-group label:contains('white'),.slider-group label:contains('black')").text("".concat(baseColor, " / adjustedDom mix"));
      this.updateColors();
    }
  },
  // UI update functions
  ui: {
    updateBackgroundImage: function updateBackgroundImage() {
      return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var imgUrl, img, isPinterest, imageUrl, dominantColor, hexColor;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              imgUrl = $("#imgInput").val();
              if (imgUrl) {
                _context2.next = 5;
                break;
              }
              $(".app-background").css({
                "background": "none",
                "background-color": "#111111"
              });
              $(".loading-bar").removeClass("active");
              return _context2.abrupt("return");
            case 5:
              _context2.prev = 5;
              // Show loading bar
              $(".loading-bar").addClass("active");

              // Create a new image to test loading
              img = new Image();
              img.crossOrigin = "anonymous";

              // For Pinterest images, use proxy URL directly
              // For other images, try direct loading
              isPinterest = ColorMixer.utils.isPinterestUrl(imgUrl);
              imageUrl = isPinterest ? ColorMixer.utils.getCorsUrl(imgUrl) : imgUrl; // Load the image
              _context2.next = 13;
              return new Promise(function (resolve, reject) {
                img.onload = resolve;
                img.onerror = reject;
                img.src = imageUrl;
              });
            case 13:
              // Update background with the successful URL
              $(".app-background").css({
                "background": "url(".concat(imageUrl, ")"),
                "opacity": "1",
                "background-size": "cover",
                "background-position": "center"
              });

              // Extract dominant color using the already loaded image
              _context2.next = 16;
              return (0, _colorExtractor.getImageDominantColor)(img);
            case 16:
              dominantColor = _context2.sent;
              hexColor = (0, _colorExtractor.rgbToHex)(dominantColor);
              console.log('Extracted color:', hexColor);
              $("#colorInput").val(hexColor).trigger('input');
              _context2.next = 26;
              break;
            case 22:
              _context2.prev = 22;
              _context2.t0 = _context2["catch"](5);
              console.error('Error processing image:', _context2.t0);
              $(".app-background").css({
                "background": "none",
                "background-color": "#111111"
              });
            case 26:
              _context2.prev = 26;
              // Always hide loading bar when done
              $(".loading-bar").removeClass("active");
              return _context2.finish(26);
            case 29:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[5, 22, 26, 29]]);
      }))();
    },
    updateSliderValues: function updateSliderValues() {
      $('.slider-group input[type="range"]').on('input', function () {
        var $value = $(this).siblings('.label-row').find('.value');
        if ($value.length) {
          var _val = $(this).val();
          // Add percentage sign for saturation and brightness multipliers
          if ($(this).attr('id') === 'satMult' || $(this).attr('id') === 'briMult') {
            $value.text(_val + '%');
          } else {
            $value.text(_val);
          }
        }

        // Special handling for mix value
        var $mixValue = $(this).siblings('.label-row').find('.mix-value');
        if ($mixValue.length) {
          var _val2 = parseFloat($(this).val());
          var adjustedPercent = (_val2 * 100).toFixed(0);
          var basePercent = ((1 - _val2) * 100).toFixed(0);
          $mixValue.text("".concat(basePercent, "% / ").concat(adjustedPercent, "%"));
        }

        // Update slider fill state
        var min = parseFloat($(this).attr('min')) || 0;
        var max = parseFloat($(this).attr('max')) || 1;
        var val = parseFloat($(this).val());
        var percentage = (val - min) / (max - min) * 100;
        $(this).css('--value-percent', "".concat(percentage, "%"));
      }).trigger('input');
    },
    updateColors: function updateColors() {
      console.log('Updating colors...');
      var hex = $("#colorInput").val().replace(/[^0-9A-Fa-f]/g, ''); // Clean hex input
      console.log('Hex:', hex);

      // Ensure valid hex
      if (!hex || hex.length < 6) {
        console.log('Invalid hex value');
        return;
      }
      var rgb = ColorMixer.utils.hexToRgb(hex);
      console.log('RGB:', rgb);
      var hsb = ColorMixer.utils.rgbToHsb(rgb.r, rgb.g, rgb.b);
      console.log('HSB:', hsb);

      // Update original color values (not affected by sliders)
      $("#originalBox").css("background", "#" + hex);
      $("#originalHex").text("#" + hex.toUpperCase());
      $("#originalRgb").text(ColorMixer.utils.formatRgb(rgb.r, rgb.g, rgb.b));
      $("#originalHsb").text(ColorMixer.utils.formatHsb(hsb.h, hsb.s, hsb.b));

      // Process adjusted and final colors with slider values
      var sMult = (parseFloat($("#satMult").val()) - 100) / 100;
      console.log('Saturation Multiplier:', sMult);
      var bMult = (parseFloat($("#briMult").val()) - 100) / 100;
      console.log('Brightness Multiplier:', bMult);
      var minSatClamp = parseFloat($("#minSatClamp").val());
      console.log('Min Saturation Clamp:', minSatClamp);
      var minBriClamp = parseFloat($("#minBriClamp").val());
      console.log('Min Brightness Clamp:', minBriClamp);
      var mixVal = parseFloat($("#mix").val());
      console.log('Mix Value:', mixVal);
      var opac = parseFloat($("#opacity").val()) / 100;
      console.log('Opacity (decimal):', opac);

      // Create a copy of HSB for adjustments
      var adjustedHsb = _objectSpread({}, hsb);
      console.log('Adjusted HSB (before):', adjustedHsb);

      // Apply saturation and brightness adjustments
      adjustedHsb.s = ColorMixer.utils.clamp(adjustedHsb.s * (1 + sMult), minSatClamp, 1.0);
      adjustedHsb.b = ColorMixer.utils.clamp(adjustedHsb.b * (1 + bMult), minBriClamp, 1.0);
      console.log('Adjusted HSB (after):', adjustedHsb);

      // Convert back to RGB
      var adj = ColorMixer.utils.hsbToRgb(adjustedHsb.h, adjustedHsb.s, adjustedHsb.b);
      console.log('Adjusted RGB:', adj);
      var adjHex = ColorMixer.utils.rgbToHex(adj.r, adj.g, adj.b);
      console.log('Adjusted Hex:', adjHex);
      var adjHsb = ColorMixer.utils.rgbToHsb(adj.r, adj.g, adj.b);
      console.log('Adjusted HSB:', adjHsb);

      // Mix with white or black depending on dark mode
      var mixColor = ColorMixer.state.darkMode ? 0 : 255;
      var fin = {
        r: Math.round(adj.r * mixVal + mixColor * (1 - mixVal)),
        g: Math.round(adj.g * mixVal + mixColor * (1 - mixVal)),
        b: Math.round(adj.b * mixVal + mixColor * (1 - mixVal))
      };
      console.log('Final RGB:', fin);
      var finHex = ColorMixer.utils.rgbToHex(fin.r, fin.g, fin.b);
      console.log('Final Hex:', finHex);
      var finHsb = ColorMixer.utils.rgbToHsb(fin.r, fin.g, fin.b);
      console.log('Final HSB:', finHsb);

      // Update adjusted and final color values
      $("#adjustedBox").css("background", "rgb(".concat(adj.r, ",").concat(adj.g, ",").concat(adj.b, ")"));
      $("#adjustedHex").text(adjHex);
      $("#adjustedRgb").text(ColorMixer.utils.formatRgb(adj.r, adj.g, adj.b));
      $("#adjustedHsb").text(ColorMixer.utils.formatHsb(adjHsb.h, adjHsb.s, adjHsb.b));
      $("#finalBox").css({
        "background": "rgb(".concat(fin.r, ",").concat(fin.g, ",").concat(fin.b, ")"),
        "opacity": opac
      });
      $("#finalHex").text(finHex);
      $("#finalRgb").text(ColorMixer.utils.formatRgb(fin.r, fin.g, fin.b));
      $("#finalHsb").text(ColorMixer.utils.formatHsb(finHsb.h, finHsb.s, finHsb.b));

      // Apply final color to modal background
      $(".modal").css({
        "background": "rgba(".concat(fin.r, ",").concat(fin.g, ",").concat(fin.b, ",").concat(opac, ")")
      });
    },
    updateBlurAmount: function updateBlurAmount() {
      var blurAmount = $("#blurAmount").val();
      $(".modal").css({
        "backdrop-filter": "blur(".concat(blurAmount, "px)"),
        "-webkit-backdrop-filter": "blur(".concat(blurAmount, "px)")
      });
    },
    updateDarkMode: function updateDarkMode() {
      ColorMixer.state.darkMode = $("#darkModeToggle").is(":checked");
      $(".modal").toggleClass("dark-mode", ColorMixer.state.darkMode);

      // Update the mix label based on dark mode
      var baseColor = ColorMixer.state.darkMode ? "black" : "white";
      $(".slider-group label:contains('white'),.slider-group label:contains('black')").text("".concat(baseColor, " / adjustedDom mix"));
      this.updateColors();
    }
  },
  // Initialize the application
  init: function init() {
    var _this = this;
    this.ui.updateSliderValues();

    // Set up event handlers for all inputs
    $('#colorInput').on('input', function () {
      _this.ui.updateColors();
    });
    $('#imgInput').on('input', function () {
      _this.ui.updateBackgroundImage();
    });

    // Set up slider handlers
    $('.slider-group input[type="range"]').on('input', function () {
      _this.ui.updateColors();
    });

    // Blur amount handler
    $("#blurAmount").on('input', function () {
      _this.ui.updateBlurAmount();
    });

    // Dark mode toggle
    $("#darkModeToggle").on('change', function () {
      _this.ui.updateDarkMode();
    });

    // Set up copy buttons
    $('.copy-btn').on('click', function () {
      var _this2 = this;
      var targetId = $(this).data('target');
      var hexText = $("#".concat(targetId)).text();
      navigator.clipboard.writeText(hexText).then(function () {
        var originalText = $(_this2).text();
        $(_this2).text('Copied!');
        setTimeout(function () {
          $(_this2).text(originalText);
        }, 1500);
      });
    });

    // Initial updates
    this.ui.updateColors();
    this.ui.updateBackgroundImage();
    this.ui.updateDarkMode();
    this.ui.updateBlurAmount();
  }
};

// Initialize when document is ready
$(document).ready(function () {
  return ColorMixer.init();
});
},{"../colorExtractor.js":"colorExtractor.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49432" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/colorMixer.js"], null)
//# sourceMappingURL=/colorMixer.e72b1916.js.map