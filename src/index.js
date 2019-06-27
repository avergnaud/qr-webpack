import "./style.css";
var Worker = require("worker-loader?name=worker.js!./worker");

var worker = new Worker;
var video = document.createElement("video");
var canvasElement = document.getElementById("canvas");
var canvas = canvasElement.getContext("2d");
var loadingMessage = document.getElementById("loadingMessage");
var outputContainer = document.getElementById("output");
var outputMessage = document.getElementById("outputMessage");
var outputData = document.getElementById("outputData");

function drawLine(begin, end) {
  canvas.beginPath();
  canvas.moveTo(begin.x, begin.y);
  canvas.lineTo(end.x, end.y);
  canvas.lineWidth = 4;
  canvas.strokeStyle = "#FF3B58";
  canvas.stroke();
}

// Use facingMode: environment to attemt to get the front camera on phones
navigator.mediaDevices
  .getUserMedia({ video: { facingMode: "environment" } })
  .then(function(stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    /* https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame */
    requestAnimationFrame(tick);
  });

  worker.onmessage = function(e) {
    var code = e.data;
    if (code) {
      drawLine(
        code.location.topLeftCorner,
        code.location.topRightCorner
      );
      drawLine(
        code.location.topRightCorner,
        code.location.bottomRightCorner
      );
      drawLine(
        code.location.bottomRightCorner,
        code.location.bottomLeftCorner
      );
      drawLine(
        code.location.bottomLeftCorner,
        code.location.topLeftCorner
      );
      outputMessage.hidden = true;
      outputData.parentElement.hidden = false;
      outputData.innerText = code.data;
    } else {
      outputMessage.hidden = false;
      outputData.parentElement.hidden = true;
      requestAnimationFrame(tick);
    }
  };

function tick() {
  loadingMessage.innerText = "⌛ Loading video...";
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    loadingMessage.hidden = true;
    canvasElement.hidden = false;
    outputContainer.hidden = false;

    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    /* affiche l'image de la balise <video> */
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    var imageData = canvas.getImageData(
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );
    worker.postMessage(imageData);
  } else {
    /* https://developer.mozilla.org/fr/docs/Web/API/Window/requestAnimationFrame */
    requestAnimationFrame(tick);
  }
}



