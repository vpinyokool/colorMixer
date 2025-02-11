/**
 * Color Mixer Module
 * Handles color conversions and UI updates for the color mixer application
 */

const ColorMixer = {
  // Color conversion utilities
  utils: {
    // Test function to verify conversion
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
      const hex = $("#colorInput").val(),
            rgb = ColorMixer.utils.hexToRgb(hex),
            hsb = ColorMixer.utils.rgbToHsb(rgb.r, rgb.g, rgb.b),
            sMult = (parseFloat($("#satMult").val()) - 100) / 100,
            bMult = (parseFloat($("#briMult").val()) - 100) / 100,
            clVal = parseFloat($("#clampVal").val()),
            mixVal = parseFloat($("#mix").val()),
            opac = parseFloat($("#opacity").val());

      // For white color (s=0), keep it white
      if (hsb.s === 0) {
        hsb.s = 0;
        hsb.b = 1;
      } else {
        hsb.s = ColorMixer.utils.clamp(hsb.s + (sMult * (1 - hsb.s)), 0.2, clVal);
        hsb.b = ColorMixer.utils.clamp(hsb.b + (bMult * (1 - hsb.b)), 0, 1.0);
      }

      // Convert back to RGB
      const adj = ColorMixer.utils.hsbToRgb(hsb.h, hsb.s, hsb.b);
      const adjHex = ColorMixer.utils.rgbToHex(adj.r, adj.g, adj.b);
      const adjHsb = ColorMixer.utils.rgbToHsb(adj.r, adj.g, adj.b);

      // Mix with white using the mix value
      const fin = {
        r: Math.round(adj.r * mixVal + 255 * (1 - mixVal)),
        g: Math.round(adj.g * mixVal + 255 * (1 - mixVal)),
        b: Math.round(adj.b * mixVal + 255 * (1 - mixVal))
      };
      const finHex = ColorMixer.utils.rgbToHex(fin.r, fin.g, fin.b);
      const finHsb = ColorMixer.utils.rgbToHsb(fin.r, fin.g, fin.b);

      // Format RGB string with padding to 3 digits
      const formatRgb = (r, g, b) =>
        `R${r.toString().padStart(3, '0')}G${g.toString().padStart(3, '0')}B${b.toString().padStart(3, '0')}`;

      // Format HSB string with padding to 3 digits
      const formatHsb = (h, s, b) =>
        `H${Math.round(h).toString().padStart(3, '0')}S${Math.round(s * 100).toString().padStart(3, '0')}B${Math.round(b * 100).toString().padStart(3, '0')}`;

      // Update color boxes and values
      $("#originalBox").css("background", "#" + hex.replace("#", ""));
      $("#originalHex").text(hex.toUpperCase());
      $("#originalRgb").text(formatRgb(rgb.r, rgb.g, rgb.b));
      $("#originalHsb").text(formatHsb(hsb.h, hsb.s, hsb.b));

      $("#adjustedBox").css("background", `rgb(${adj.r},${adj.g},${adj.b})`);
      $("#adjustedHex").text(adjHex);
      $("#adjustedRgb").text(formatRgb(adj.r, adj.g, adj.b));
      $("#adjustedHsb").text(formatHsb(adjHsb.h, adjHsb.s, adjHsb.b));

      $("#finalBox").css({
        "background": `rgb(${fin.r},${fin.g},${fin.b})`,
        "opacity": opac
      });
      $("#finalHex").text(finHex);
      $("#finalRgb").text(formatRgb(fin.r, fin.g, fin.b));
      $("#finalHsb").text(formatHsb(finHsb.h, finHsb.s, finHsb.b));

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
      console.log('Blur Update:', { isBlurred, blurAmount });

      // Apply both webkit and standard backdrop-filter
      $(".modal").css({
        "backdrop-filter": isBlurred ? `blur(${blurAmount}px)` : "none",
        "-webkit-backdrop-filter": isBlurred ? `blur(${blurAmount}px)` : "none"
      });
      console.log('Applied blur:', $(".modal").css("backdrop-filter"));
    },

    toggleBlur() {
      console.log('Toggle Blur Called');
      this.updateBlur();
    }
  },

  // Initialize the application
  init() {
    // Test the default color
    this.utils.testHsb('918091');

    this.ui.updateSliderValues();
    console.log('Initializing Color Mixer...');

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
      console.log('Blur Toggle Changed:', $("#blurToggle").is(":checked"));
      this.ui.updateBlur();
    });

    $("#blurAmount").on('input', () => {
      console.log('Blur Amount Changed:', $("#blurAmount").val());
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
    console.log('Initialization complete');
  }
};

// Initialize when document is ready
$(document).ready(() => ColorMixer.init());