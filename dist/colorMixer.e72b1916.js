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
})({"js/colorExtractor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getImageDominantColor = getImageDominantColor;
exports.rgbToHex = rgbToHex;
// Function to get RGB values from an Image object or URL
async function getImagePixels(input) {
  return new Promise((resolve, reject) => {
    const processImage = img => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw image and get pixel data
      ctx.drawImage(img, 0, 0);
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData.data);
      } catch (error) {
        reject(new Error('Error getting image data: ' + error.message));
      }
    };
    if (input instanceof HTMLImageElement) {
      if (input.complete) {
        processImage(input);
      } else {
        input.onload = () => processImage(input);
        input.onerror = error => reject(new Error('Error loading image: ' + error));
      }
    } else {
      // Assume input is URL string
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => processImage(img);
      img.onerror = error => reject(new Error('Error loading image: ' + error));
      img.src = input;
    }
  });
}

// Function to get color histogram from RGB pixels
function getImageColorHistogram(pixels) {
  // Initialize histogram arrays for R, G, B channels
  const histogram = [new Array(256).fill(0),
  // R channel
  new Array(256).fill(0),
  // G channel
  new Array(256).fill(0) // B channel
  ];
  const colorCount = [0, 0, 0]; // Count for each channel

  // Process each pixel (RGB values are in groups of 4 due to RGBA format)
  for (let i = 0; i < pixels.length; i += 4) {
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
    histogram,
    colorCount
  };
}

// Function to get dominant color using median calculation
async function getImageDominantColor(input) {
  try {
    const pixels = await getImagePixels(input);
    const {
      histogram,
      colorCount
    } = getImageColorHistogram(pixels);
    const dominantColor = [];

    // Calculate median for each channel (R, G, B)
    for (let channel = 0; channel < 3; channel++) {
      const median = Math.floor(colorCount[channel] / 2);
      let count = 0;

      // Find the color value where count exceeds median
      for (let colorValue = 0; colorValue < 256; colorValue++) {
        count += histogram[channel][colorValue];
        if (count > median) {
          dominantColor.push(colorValue);
          break;
        }
      }
    }
    return dominantColor;
  } catch (error) {
    console.error('Error getting dominant color:', error);
    throw error;
  }
}

// Helper function to convert RGB array to hex color
function rgbToHex(rgb) {
  return '#' + rgb.map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}
},{}],"js/colorMixer.js":[function(require,module,exports) {
"use strict";

var _colorExtractor = require("./colorExtractor.js");
// Import color extraction functions

/**
 * Color Mixer Module
 * Handles color conversions and UI updates for the color mixer application
 */

const ColorMixer = {
  // Add darkMode state
  state: {
    darkMode: false
  },
  // Color conversion utilities
  utils: {
    clamp(v, min, max) {
      return Math.max(min, Math.min(v, max));
    },
    hexToRgb(hex) {
      hex = hex.replace("#", "");
      if (hex.length === 3) hex = hex.replace(/(.)/g, "$1$1");
      const n = parseInt(hex, 16);
      return {
        r: n >> 16 & 255,
        g: n >> 8 & 255,
        b: n & 255
      };
    },
    rgbToHsb(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d = max - min;
      let h = 0;
      let s = max === 0 ? 0 : d / max;
      let v = max;
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
    hsbToRgb(h, s, b) {
      const c = b * s,
        x = c * (1 - Math.abs(h / 60 % 2 - 1)),
        m = b - c;
      let r = 0,
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
    rgbToHex(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    },
    formatRgb(r, g, b) {
      return `R${String(r).padStart(3, '0')}G${String(g).padStart(3, '0')}B${String(b).padStart(3, '0')}`;
    },
    formatHsb(h, s, b) {
      const hue = Math.round(h);
      const sat = Math.round(s * 100);
      const bri = Math.round(b * 100);
      return `H${String(hue).padStart(3, '0')}S${String(sat).padStart(3, '0')}B${String(bri).padStart(3, '0')}`;
    },
    testHsb(hex) {
      const rgb = this.hexToRgb(hex);
      console.log('RGB:', rgb);
      const hsb = this.rgbToHsb(rgb.r, rgb.g, rgb.b);
      console.log('HSB:', {
        h: Math.round(hsb.h),
        s: Math.round(hsb.s * 100),
        b: Math.round(hsb.b * 100)
      });
    },
    // Add a new utility function to handle CORS proxy with retries and fallback
    getCorsUrl(url) {
      // List of proxy services
      const proxyServices = [url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, url => `https://corsproxy.io/?${encodeURIComponent(url)}`, url => `https://cors-anywhere.herokuapp.com/${url}`];
      return proxyServices[0](url); // Start with first proxy
    },
    // Add back Pinterest URL check
    isPinterestUrl(url) {
      return url.includes('pinimg.com') || url.includes('pinterest.com');
    },
    async loadImageWithRetry(url) {
      let maxRetries = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
      let lastError;
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => reject(new Error('Image load timeout')), 10000);
            img.onload = () => {
              clearTimeout(timeoutId);
              resolve();
            };
            img.onerror = error => {
              clearTimeout(timeoutId);
              reject(error);
            };
            img.src = url;
          });
          return img;
        } catch (error) {
          console.log(`Attempt ${attempt + 1} failed:`, error);
          lastError = error;

          // If this wasn't the last attempt, wait before retrying
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          }
        }
      }
      throw lastError;
    },
    // Update background image function
    async updateBackgroundImage() {
      const imgUrl = $("#imgInput").val();
      if (!imgUrl) {
        $(".app-background").css({
          "background": "none",
          "background-color": "#111111"
        });
        $(".loading-bar").removeClass("active");
        $(".container").removeClass("loading");
        $("#imgInput").prop("disabled", false);
        return;
      }
      try {
        // Show loading state
        $(".loading-bar").addClass("active");
        $(".container").addClass("loading");
        $("#imgInput").prop("disabled", true);

        // Update background immediately with direct URL - no CORS needed for CSS background-image
        $(".app-background").css({
          "background": `url(${imgUrl})`,
          "opacity": "1",
          "background-size": "cover",
          "background-position": "center"
        });

        // For Pinterest images, use proxy URL for canvas operations
        const isPinterest = ColorMixer.utils.isPinterestUrl(imgUrl);
        const canvasUrl = isPinterest ? ColorMixer.utils.getCorsUrl(imgUrl) : imgUrl;

        // Load the image with retry mechanism
        const img = await ColorMixer.utils.loadImageWithRetry(canvasUrl);

        // Extract dominant color using the loaded image
        const dominantColor = await (0, _colorExtractor.getImageDominantColor)(img);
        const hexColor = (0, _colorExtractor.rgbToHex)(dominantColor);
        console.log('Extracted color:', hexColor);
        $("#colorInput").val(hexColor).trigger('input');
      } catch (error) {
        console.error('Error processing image:', error);
        // Don't reset the background on error, just show error in console
      } finally {
        // Always hide loading state when done
        $(".loading-bar").removeClass("active");
        $(".container").removeClass("loading");
        $("#imgInput").prop("disabled", false);
      }
    },
    updateBlurAmount() {
      const blurAmount = $("#blurAmount").val();
      $(".modal").css({
        "backdrop-filter": `blur(${blurAmount}px)`,
        "-webkit-backdrop-filter": `blur(${blurAmount}px)`
      });
    },
    updateDarkMode() {
      ColorMixer.state.darkMode = $("#darkModeToggle").is(":checked");
      $(".modal").toggleClass("dark-mode", ColorMixer.state.darkMode);

      // Update the mix label based on dark mode
      const baseColor = ColorMixer.state.darkMode ? "Black" : "White";
      $(".slider-group label:contains('white'), .slider-group label:contains('black'), .slider-group label:contains('White'), .slider-group label:contains('Black')").text(`${baseColor} / adjustedDom mix`);
      this.updateColors();
    }
  },
  // UI update functions
  ui: {
    async updateBackgroundImage() {
      const imgUrl = $("#imgInput").val();
      if (!imgUrl) {
        $(".app-background").css({
          "background": "none",
          "background-color": "#111111"
        });
        $(".loading-bar").removeClass("active");
        $(".container").removeClass("loading");
        $("#imgInput").prop("disabled", false);
        return;
      }
      try {
        // Show loading state
        $(".loading-bar").addClass("active");
        $(".container").addClass("loading");
        $("#imgInput").prop("disabled", true);

        // Update background immediately with direct URL - no CORS needed for CSS background-image
        $(".app-background").css({
          "background": `url(${imgUrl})`,
          "opacity": "1",
          "background-size": "cover",
          "background-position": "center"
        });

        // Create a new image for color extraction - this needs CORS
        const img = new Image();
        img.crossOrigin = "anonymous";

        // For Pinterest images, use proxy URL for canvas operations
        const isPinterest = ColorMixer.utils.isPinterestUrl(imgUrl);
        const canvasUrl = isPinterest ? ColorMixer.utils.getCorsUrl(imgUrl) : imgUrl;

        // Load the image for canvas operations
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = canvasUrl;
        });

        // Extract dominant color using the loaded image
        const dominantColor = await (0, _colorExtractor.getImageDominantColor)(img);
        const hexColor = (0, _colorExtractor.rgbToHex)(dominantColor);
        console.log('Extracted color:', hexColor);
        $("#colorInput").val(hexColor).trigger('input');
      } catch (error) {
        console.error('Error processing image:', error);
        $(".app-background").css({
          "background": "none",
          "background-color": "#111111"
        });
      } finally {
        // Always hide loading state when done
        $(".loading-bar").removeClass("active");
        $(".container").removeClass("loading");
        $("#imgInput").prop("disabled", false);
      }
    },
    updateSliderValues() {
      $('.slider-group input[type="range"]').on('input', function () {
        const $value = $(this).siblings('.label-row').find('.value');
        if ($value.length) {
          const val = $(this).val();
          // Add percentage sign for saturation and brightness multipliers
          if ($(this).attr('id') === 'satMult' || $(this).attr('id') === 'briMult') {
            $value.text(val + '%');
          } else {
            $value.text(val);
          }
        }

        // Special handling for mix value
        const $mixValue = $(this).siblings('.label-row').find('.mix-value');
        if ($mixValue.length) {
          const val = parseFloat($(this).val());
          const adjustedPercent = (val * 100).toFixed(0);
          const basePercent = ((1 - val) * 100).toFixed(0);
          $mixValue.text(`${basePercent}% / ${adjustedPercent}%`);
        }

        // Update slider fill state
        const min = parseFloat($(this).attr('min')) || 0;
        const max = parseFloat($(this).attr('max')) || 1;
        const val = parseFloat($(this).val());
        const percentage = (val - min) / (max - min) * 100;
        $(this).css('--value-percent', `${percentage}%`);
      }).trigger('input');
    },
    updateColors() {
      console.log('Updating colors...');
      const hex = $("#colorInput").val().replace(/[^0-9A-Fa-f]/g, ''); // Clean hex input
      console.log('Hex:', hex);

      // Ensure valid hex
      if (!hex || hex.length < 6) {
        console.log('Invalid hex value');
        return;
      }
      const rgb = ColorMixer.utils.hexToRgb(hex);
      console.log('RGB:', rgb);
      const hsb = ColorMixer.utils.rgbToHsb(rgb.r, rgb.g, rgb.b);
      console.log('HSB:', hsb);

      // Update original color values (not affected by sliders)
      $("#originalBox").css("background", "#" + hex);
      $("#originalHex").text("#" + hex.toUpperCase());
      $("#originalRgb").text(ColorMixer.utils.formatRgb(rgb.r, rgb.g, rgb.b));
      $("#originalHsb").text(ColorMixer.utils.formatHsb(hsb.h, hsb.s, hsb.b));

      // Process adjusted and final colors with slider values
      const sMult = (parseFloat($("#satMult").val()) - 100) / 100;
      console.log('Saturation Multiplier:', sMult);
      const bMult = (parseFloat($("#briMult").val()) - 100) / 100;
      console.log('Brightness Multiplier:', bMult);
      const minSatClamp = parseFloat($("#minSatClamp").val());
      console.log('Min Saturation Clamp:', minSatClamp);
      const minBriClamp = parseFloat($("#minBriClamp").val());
      console.log('Min Brightness Clamp:', minBriClamp);
      const mixVal = parseFloat($("#mix").val());
      console.log('Mix Value:', mixVal);
      const opac = parseFloat($("#opacity").val()) / 100;
      console.log('Opacity (decimal):', opac);

      // Create a copy of HSB for adjustments
      const adjustedHsb = {
        ...hsb
      };
      console.log('Adjusted HSB (before):', adjustedHsb);

      // Apply saturation and brightness adjustments
      adjustedHsb.s = ColorMixer.utils.clamp(adjustedHsb.s * (1 + sMult), minSatClamp, 1.0);
      adjustedHsb.b = ColorMixer.utils.clamp(adjustedHsb.b * (1 + bMult), minBriClamp, 1.0);
      console.log('Adjusted HSB (after):', adjustedHsb);

      // Convert back to RGB
      const adj = ColorMixer.utils.hsbToRgb(adjustedHsb.h, adjustedHsb.s, adjustedHsb.b);
      console.log('Adjusted RGB:', adj);
      const adjHex = ColorMixer.utils.rgbToHex(adj.r, adj.g, adj.b);
      console.log('Adjusted Hex:', adjHex);
      const adjHsb = ColorMixer.utils.rgbToHsb(adj.r, adj.g, adj.b);
      console.log('Adjusted HSB:', adjHsb);

      // Mix with white or black depending on dark mode
      const mixColor = ColorMixer.state.darkMode ? 0 : 255;
      const fin = {
        r: Math.round(adj.r * mixVal + mixColor * (1 - mixVal)),
        g: Math.round(adj.g * mixVal + mixColor * (1 - mixVal)),
        b: Math.round(adj.b * mixVal + mixColor * (1 - mixVal))
      };
      console.log('Final RGB:', fin);
      const finHex = ColorMixer.utils.rgbToHex(fin.r, fin.g, fin.b);
      console.log('Final Hex:', finHex);
      const finHsb = ColorMixer.utils.rgbToHsb(fin.r, fin.g, fin.b);
      console.log('Final HSB:', finHsb);

      // Update adjusted and final color values
      $("#adjustedBox").css("background", `rgb(${adj.r},${adj.g},${adj.b})`);
      $("#adjustedHex").text(adjHex);
      $("#adjustedRgb").text(ColorMixer.utils.formatRgb(adj.r, adj.g, adj.b));
      $("#adjustedHsb").text(ColorMixer.utils.formatHsb(adjHsb.h, adjHsb.s, adjHsb.b));
      $("#finalBox").css({
        "background": `rgb(${fin.r},${fin.g},${fin.b})`,
        "opacity": opac
      });
      $("#finalHex").text(finHex);
      $("#finalRgb").text(ColorMixer.utils.formatRgb(fin.r, fin.g, fin.b));
      $("#finalHsb").text(ColorMixer.utils.formatHsb(finHsb.h, finHsb.s, finHsb.b));

      // Apply final color to modal background
      $(".modal").css({
        "background": `rgba(${fin.r},${fin.g},${fin.b},${opac})`
      });
    },
    updateBlurAmount() {
      const blurAmount = $("#blurAmount").val();
      $(".modal").css({
        "backdrop-filter": `blur(${blurAmount}px)`,
        "-webkit-backdrop-filter": `blur(${blurAmount}px)`
      });
    },
    updateDarkMode() {
      ColorMixer.state.darkMode = $("#darkModeToggle").is(":checked");
      $(".modal").toggleClass("dark-mode", ColorMixer.state.darkMode);

      // Update the mix label based on dark mode
      const baseColor = ColorMixer.state.darkMode ? "Black" : "White";
      $(".slider-group label:contains('white'), .slider-group label:contains('black'), .slider-group label:contains('White'), .slider-group label:contains('Black')").text(`${baseColor} / adjustedDom mix`);
      this.updateColors();
    }
  },
  // Initialize the application
  init() {
    this.ui.updateSliderValues();

    // Set up event handlers for all inputs
    $('#colorInput').on('input', () => {
      this.ui.updateColors();
    });
    $('#imgInput').on('input', () => {
      this.ui.updateBackgroundImage();
    });

    // Set up slider handlers
    $('.slider-group input[type="range"]').on('input', () => {
      this.ui.updateColors();
    });

    // Blur amount handler
    $("#blurAmount").on('input', () => {
      this.ui.updateBlurAmount();
    });

    // Dark mode toggle
    $("#darkModeToggle").on('change', () => {
      this.ui.updateDarkMode();
    });

    // Set up copy buttons
    $('.copy-btn').on('click', function () {
      const targetId = $(this).data('target');
      const hexText = $(`#${targetId}`).text();
      navigator.clipboard.writeText(hexText).then(() => {
        const originalText = $(this).text();
        $(this).text('Copied!');
        setTimeout(() => {
          $(this).text(originalText);
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
$(document).ready(() => ColorMixer.init());
},{"./colorExtractor.js":"js/colorExtractor.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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