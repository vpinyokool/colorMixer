$(function(){
  // Update slider values display
  $('.slider-group input[type="range"]').on('input', function() {
    $(this).siblings('.value').text($(this).val());
  }).trigger('input');

  function clamp(v,min,max){return Math.max(min,Math.min(v,max));}

  function hexToRgb(h){
    h=h.replace("#","");
    if(h.length===3)h=h.replace(/(.)/g,"$1$1");
    var n=parseInt(h,16);
    return{r:(n>>16)&255,g:(n>>8)&255,b:n&255};
  }

  function rgbToHsb(r,g,b){
    r/=255;g/=255;b/=255;
    var mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn,s=mx?d/mx:0,h=0;
    if(!d)h=0;
    else if(mx===r)h=((g-b)/d)%6;
    else if(mx===g)h=(b-r)/d+2;
    else h=(r-g)/d+4;
    return{h:((h*60+360)%360),s:s,b:mx};
  }

  function hsbToRgb(h,s,b){
    var c=b*s,x=c*(1-Math.abs((h/60)%2-1)),m=b-c;
    var r=0,g=0,bl=0;
    switch(Math.floor(h/60)){
      case 0:r=c;g=x;break;
      case 1:r=x;g=c;break;
      case 2:g=c;bl=x;break;
      case 3:g=x;bl=c;break;
      case 4:r=x;bl=c;break;
      default:r=c;bl=x;
    }
    return{
      r:Math.round((r+m)*255),
      g:Math.round((g+m)*255),
      b:Math.round((bl+m)*255)
    };
  }

  $("#generateBtn").click(function(){
    var hex = $("#colorInput").val(),
        rgb = hexToRgb(hex),
        hsb = rgbToHsb(rgb.r,rgb.g,rgb.b),
        sMult = parseFloat($("#satMult").val()),
        bMult = parseFloat($("#briMult").val()),
        clVal = parseFloat($("#clampVal").val()),
        mixVal = parseFloat($("#mix").val()),
        opac = parseFloat($("#opacity").val());

    // Boost & clamp
    hsb.s = clamp(hsb.s*sMult, 0, clVal);
    hsb.b = clamp(hsb.b*bMult, 0, clVal);

    // Convert back to RGB
    var adj = hsbToRgb(hsb.h,hsb.s,hsb.b);

    // Mix with white
    var fin = {
      r: Math.round(adj.r*mixVal + 255*(1-mixVal)),
      g: Math.round(adj.g*mixVal + 255*(1-mixVal)),
      b: Math.round(adj.b*mixVal + 255*(1-mixVal))
    };

    // Update swatches
    $("#originalBox").css("background", "#"+hex.replace("#",""));
    $("#adjustedBox").css("background", `rgb(${adj.r},${adj.g},${adj.b})`);
    $("#finalBox").css({
      "background": `rgb(${fin.r},${fin.g},${fin.b})`,
      "opacity": opac
    });

    // Update background image if provided
    var imgUrl = $("#imgInput").val();
    if(imgUrl) {
      $("body").css("background-image", `url(${imgUrl})`);
    }
  });

  // Initial color generation
  $("#generateBtn").click();
});