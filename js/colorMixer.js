/**
 * Color Mixer Module
 * Handles color conversions and UI updates for the color mixer application
 */

const ColorMixer = {
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
    }
  },

  // UI update functions
  ui: {
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
          $mixValue.text(`${(val * 100).toFixed(0)}% / ${((1 - val) * 100).toFixed(0)}%`);
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
      const hex = $("#colorInput").val();
      console.log('Hex:', hex);
      const rgb = ColorMixer.utils.hexToRgb(hex);
      console.log('RGB:', rgb);
      const hsb = ColorMixer.utils.rgbToHsb(rgb.r, rgb.g, rgb.b);
      console.log('HSB:', hsb);

      // Update original color values (not affected by sliders)
      $("#originalBox").css("background", "#" + hex.replace("#", ""));
      $("#originalHex").text(hex.toUpperCase());
      $("#originalRgb").text(ColorMixer.utils.formatRgb(rgb.r, rgb.g, rgb.b));
      $("#originalHsb").text(ColorMixer.utils.formatHsb(hsb.h, hsb.s, hsb.b));

      // Process adjusted and final colors with slider values
      const sMult = (parseFloat($("#satMult").val()) - 100) / 100;
      console.log('Saturation Multiplier:', sMult);
      const bMult = (parseFloat($("#briMult").val()) - 100) / 100;
      console.log('Brightness Multiplier:', bMult);
      const clVal = parseFloat($("#clampVal").val());
      console.log('Clamp Value:', clVal);
      const mixVal = parseFloat($("#mix").val());
      console.log('Mix Value:', mixVal);
      const opac = parseFloat($("#opacity").val());
      console.log('Opacity:', opac);

      // Create a copy of HSB for adjustments
      const adjustedHsb = { ...hsb };
      console.log('Adjusted HSB (before):', adjustedHsb);

      // For white color (s=0), keep it white
      if (adjustedHsb.s === 0) {
        adjustedHsb.s = 0;
        adjustedHsb.b = 1;
      } else {
        // Only apply saturation and brightness adjustments if multipliers are above 100%
        if (sMult > 0) {
          adjustedHsb.s = ColorMixer.utils.clamp(adjustedHsb.s + (sMult * (1 - adjustedHsb.s)), 0.2, clVal);
        }
        if (bMult > 0) {
          adjustedHsb.b = ColorMixer.utils.clamp(adjustedHsb.b + (bMult * (1 - adjustedHsb.b)), 0, 1.0);
        }
      }
      console.log('Adjusted HSB (after):', adjustedHsb);

      // Convert back to RGB
      const adj = ColorMixer.utils.hsbToRgb(adjustedHsb.h, adjustedHsb.s, adjustedHsb.b);
      console.log('Adjusted RGB:', adj);
      const adjHex = ColorMixer.utils.rgbToHex(adj.r, adj.g, adj.b);
      console.log('Adjusted Hex:', adjHex);
      const adjHsb = ColorMixer.utils.rgbToHsb(adj.r, adj.g, adj.b);
      console.log('Adjusted HSB:', adjHsb);

      // Mix with white using the mix value
      const fin = {
        r: Math.round(adj.r * mixVal + 255 * (1 - mixVal)),
        g: Math.round(adj.g * mixVal + 255 * (1 - mixVal)),
        b: Math.round(adj.b * mixVal + 255 * (1 - mixVal))
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

      // Update blur if enabled
      this.updateBlur();
    },

    updateBackgroundImage() {
      const imgUrl = $("#imgInput").val();
      if (imgUrl) {
        $(".app-background").css({
          "background-image": `url(${imgUrl})`,
          "background-size": "cover",
          "background-position": "center",
          "background-color": "#111111"
        });
      } else {
        $(".app-background").css({
          "background-image": "none",
          "background-color": "#111111"
        });
      }
    },

    updateBlur() {
      const isBlurred = $("#blurToggle").is(":checked");
      const blurAmount = $("#blurAmount").val();

      // Apply both webkit and standard backdrop-filter
      $(".modal").css({
        "backdrop-filter": isBlurred ? `blur(${blurAmount}px)` : "none",
        "-webkit-backdrop-filter": isBlurred ? `blur(${blurAmount}px)` : "none"
      });
    }
  },

  // Initialize the application
  init() {
    this.ui.updateSliderValues();

    // Set up event handlers for all inputs
    $('#colorInput, #imgInput').on('input', () => {
      this.ui.updateColors();
      this.ui.updateBackgroundImage();
    });

    // Set up slider handlers
    $('.slider-group input[type="range"]').on('input', () => {
      this.ui.updateColors();
    });

    // Set up blur toggle and amount handlers
    $("#blurToggle").on('change', () => {
      this.ui.updateBlur();
    });

    $("#blurAmount").on('input', () => {
      this.ui.updateBlur();
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
    this.ui.updateBlur();
  }
};

// Initialize when document is ready
$(document).ready(() => ColorMixer.init());