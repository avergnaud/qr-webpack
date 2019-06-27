import jsQR from "jsqr";

onmessage = function(e) {
  var imageData = e.data;

  if (imageData.data) {
    var code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert"
    });
    postMessage(code);
  }
};