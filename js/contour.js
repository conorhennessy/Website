/*
* Randomised Contour Lines slightly adapted from blinsay - Ben Linsay - https://gist.github.com/blinsay/c8bcfeff0b6159f44aec
* 'Randomly placed actors explore a 2D function by walking along contour lines.'
*/

var TWO_PI = Math.PI * 2,
    PI_OVER_TWO = Math.PI / 2,
    INFINITY = 1 / 0;  

var contourDiv = document.getElementById("contour");
var width = contourDiv.offsetWidth,
    height = contourDiv.offsetHeight,
    noiseScale = 0.003,
    numContours = 200,
    step = 0,
    steps = 5000,
    stepLength = 0.5,
    turnAngle = TWO_PI / 32;

var n = 0,
    alpha = 0;

var context = setupCanvas(width, height),
    noise = perlin.noise(noiseScale),
    easing = easeAlpha(steps);

var bodyStyle = window.getComputedStyle(document.querySelector('body')),
    matchColours = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/,
 match = matchColours.exec(bodyStyle.color);

var contours = [];
for (var i = 0; i < numContours; i++) {
  contours.push(randomContour(width, height, noise, stepLength, turnAngle));
}

d3.timer(function() {
/*  if (++step > steps) {
    return true;
  }*/

  context.lineWidth = 1;
  context.globalCompositeOperation = 'darker';
  context.beginPath();

  var alpha = easing.get();
  contours.forEach(function(contour) {
    var ln = contour.step(); 
    context.strokeStyle = "rgba(" + match[1] + "," + match[2] + "," + match[3] + "," + alpha + ")";
    context.moveTo(ln.x1, ln.y1);
    context.lineTo(ln.x2, ln.y2);
  });
  context.stroke();
  easing.step();
})

// Append a (width x height) canvas element to the .contour ID div and return its context
// object. 
function setupCanvas(width, height) {
  var canvas = document.createElement("canvas");
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  canvas.setAttribute('id', 'c');
  contourDiv.appendChild(canvas);

  var context = canvas.getContext('2d');
  context.fillStyle = window.getComputedStyle(document.querySelector('body')).backgroundColor;
  context.fillRect(-1, -1, width, height);

  return context;
}

function resize() {
  width = contourDiv.offsetWidth;
  height = contourDiv.offsetHeight;
  document.getElementById('c').setAttribute('width', width);
  document.getElementById('c').setAttribute('height', height);
}

// An object that eases opacity as steps progress.
function easeAlpha(steps) {
  var n = 0, alpha = 0.3;
  return {
    step: function() { alpha = 0.3 + 0.125 * (1 - Math.cos(2 * Math.PI * (n++ / steps))) },
    get: function() { return alpha }
  }
}

// Returns an object with a step() method that walks in 2d space while trying
// to keep f(x, y) as close to f(x_start, y_start) as possible. The object only
// walks "forward" - objects maintain a current heading, and only look for new
// points in a +/- 90 arc.
function randomContour(width, height, f, stepLength, turnAngle, minimumStep) {
  var x = Math.random() * width,
      y = Math.random() * height,
      heading = Math.random() * TWO_PI,
      currentValue = f(x, y);
  return {
    step: function() {
      var x1 = x, y1 = y;
      var minDelta = INFINITY,
          minHeading = heading,
          minF = -1,
          minX = -1,
          minY = -1; 

      for (var theta = heading - PI_OVER_TWO; theta < heading + PI_OVER_TWO; theta += turnAngle) {
        var newX = x + stepLength * Math.cos(theta),
            newY = y + stepLength * Math.sin(theta),
            newValue = f(newX, newY),
            delta = Math.abs(newValue - currentValue);

        if (delta < minDelta) {
          minDelta = delta;
          minHeading = theta;
          minF = newValue;
          minX = newX;
          minY = newY;
        }
      }

      x = minX;
      y = minY;
      heading = minHeading;
      currentValue = minF;

      return {x1: x1, y1: y1, x2: x, y2: y}
    }
  }
}

// Redraw canvas whenever the browser window is resized.
window.addEventListener("resize", resize);