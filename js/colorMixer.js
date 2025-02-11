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
            d = max - min,
            s = max ? d / max : 0;

      let h = 0;
      if (d) {
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
      }

      return {
        h: ((h * 60) % 360),
        s: s,
        b: max
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
    }
  },

  // UI update functions
  ui: {
    updateSliderValues() {
      $('.slider-group input[type="range"]').on('input', function() {
        const $value = $(this).siblings('.label-row').find('.value');
        if ($value.length) {
          $value.text($(this).val());
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
            sMult = parseFloat($("#satMult").val()),
            bMult = parseFloat($("#briMult").val()),
            clVal = parseFloat($("#clampVal").val()),
            mixVal = parseFloat($("#mix").val()),
            opac = parseFloat($("#opacity").val());

      // Boost & clamp
      hsb.s = ColorMixer.utils.clamp(hsb.s * sMult, 0, clVal);
      hsb.b = ColorMixer.utils.clamp(hsb.b * bMult, 0, clVal);

      // Convert back to RGB
      const adj = ColorMixer.utils.hsbToRgb(hsb.h, hsb.s, hsb.b);

      // Mix with white
      const fin = {
        r: Math.round(adj.r * mixVal + 255 * (1 - mixVal)),
        g: Math.round(adj.g * mixVal + 255 * (1 - mixVal)),
        b: Math.round(adj.b * mixVal + 255 * (1 - mixVal))
      };

      // Update color boxes
      $("#originalBox").css("background", "#" + hex.replace("#", ""));
      $("#adjustedBox").css("background", `rgb(${adj.r},${adj.g},${adj.b})`);
      $("#finalBox").css({
        "background": `rgb(${fin.r},${fin.g},${fin.b})`,
        "opacity": opac
      });

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
    this.ui.updateSliderValues();
    console.log('Initializing Color Mixer...');

    // Set up event handlers for all inputs
    $('#colorInput, #imgInput, .slider-group input[type="range"]').on('input', () => {
      this.ui.updateColors();
      this.ui.updateBackgroundImage();
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

    // Initial updates
    this.ui.updateColors();
    this.ui.updateBackgroundImage();
    this.ui.updateBlur();
    console.log('Initialization complete');
  }
};

// Initialize when document is ready
$(document).ready(() => ColorMixer.init());