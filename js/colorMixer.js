// Import color extraction functions
import { getImageDominantColor, rgbToHex as extractorRgbToHex } from './colorExtractor.js';

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
        r: (n >> 16) & 255,
        g: (n >> 8) & 255,
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
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = b - c;

      let r = 0, g = 0, bl = 0;

      if (h < 60) { r = c; g = x; }
      else if (h < 120) { r = x; g = c; }
      else if (h < 180) { g = c; bl = x; }
      else if (h < 240) { g = x; bl = c; }
      else if (h < 300) { r = x; bl = c; }
      else { r = c; bl = x; }

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
      const proxyServices = [
        (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
        (url) => `https://cors-anywhere.herokuapp.com/${url}`
      ];

      return proxyServices[0](url); // Start with first proxy
    },

    // Add back Pinterest URL check
    isPinterestUrl(url) {
      return url.includes('pinimg.com') || url.includes('pinterest.com');
    },

    async loadImageWithRetry(url, maxRetries = 2) {
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

            img.onerror = (error) => {
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
        const dominantColor = await getImageDominantColor(img);
        const hexColor = extractorRgbToHex(dominantColor);
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
        const dominantColor = await getImageDominantColor(img);
        const hexColor = extractorRgbToHex(dominantColor);
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
      $('.slider-group input[type="range"]').on('input', function() {
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
        const percentage = ((val - min) / (max - min)) * 100;
        $(this).css('--value-percent', `${percentage}%`);
      }).trigger('input');
    },

    updateColors() {
      console.log('Updating colors...');
      const hex = $("#colorInput").val().replace(/[^0-9A-Fa-f]/g, '');  // Clean hex input
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
      const adjustedHsb = { ...hsb };
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
    $('.copy-btn').on('click', function() {
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