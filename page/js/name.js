// Console info log
console.log("Hello Hello! 👋\nYou can see the rest of my code here https://github.com/conorhennessy\n   - Conor 🦆");

// Replace all emojis with Twemojis
twemoji.parse(document.body);

//Make animating Conor Hennessy name title
var font;
var vehicles = [];
var width;
var height;
var points;
var longNamePoints;
var shortNamePoints;
var nameDiv;

function preload() {
    font = loadFont('css/CODE-Light.otf');
};

function setup() {
    nameDiv = document.getElementById("name");
    width = nameDiv.offsetWidth;
    height = 200;
    var c = createCanvas(width, height);
    c.parent("name");
    c.id("nameCanvas");

    //create points from font
    textFont(font);
    textAlign(CENTER);
    textSize(60);
    
    longNamePoints = font.textToPoints("conor hennessy", 20, (height / 2), 75, {
                        sampleFactor: 0.4
                    });
    shortNamePoints = font.textToPoints("conor h", 20, (height / 2) - 10, 50, {
                        sampleFactor: 0.4
                    });

    points = (width >= 600) ? longNamePoints : shortNamePoints;

    for (var i = 0; i < longNamePoints.length; i++) {
        var pt = points[i];
        if (i > shortNamePoints.length - 3 && points == shortNamePoints){
            var vehicle = new Vehicle(-10, longNamePoints[i].y);
        } else {;
            var vehicle = new Vehicle(pt.x, pt.y);
        }
        vehicles.push(vehicle);
    }

    frameRate(60);
};

function draw() {
    clear();
    noStroke();
    for (var i = 0; i < vehicles.length; i++) {
        var v = vehicles[i];
        v.behaviours();
        v.update();
        v.show();
    }
};


//Function to move the destination of all the particles
function movePoints() {
    //Only remap points if width has changed and name has not already been changed
    if(width <= 600 && points == longNamePoints) {
        points = shortNamePoints;
    }
    else if (width > 600 && points == shortNamePoints) {
        points = longNamePoints;
    }

    for (var i = 0; i < longNamePoints.length; i++) {
        var pt = points[i];
        var vehicle = vehicles[i];

        if (i > shortNamePoints.length - 3 && points == shortNamePoints){
            vehicle.updateTarget(-10, longNamePoints[i].y);
        } else {
            vehicle.updateTarget(pt.x, pt.y);  
        }
    }
};


function windowResized() {
    width = nameDiv.offsetWidth;
    resizeCanvas(width, 200);
    movePoints();
};


function Vehicle(x,y) {
    this.pos = createVector(0, y);
    this.target = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector();
    this.r = 2;
    this.maxSpeed = random(5, 10);
    this.maxForce = 1;
}

Vehicle.prototype.updateTarget = function(x, y) {
    this.target = createVector(x, y);
};

Vehicle.prototype.behaviours = function() {
    var arrive = this.arrive(this.target);
    var mouse = createVector(mouseX, mouseY);
    var flee = this.flee(mouse);

    arrive.mult(1);
    flee.mult(5);

    this.applyForce(arrive);
    this.applyForce(flee);
};

Vehicle.prototype.applyForce = function(f) {
    this.acc.add(f);
};

Vehicle.prototype.update = function() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
};

Vehicle.prototype.show = function() {
    stroke(window.getComputedStyle(document.querySelector('body')).color);
    strokeWeight(this.r);
    point(this.pos.x, this.pos.y);
};

Vehicle.prototype.arrive = function(target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    var speed = this.maxSpeed;
    if (d < 100) {
        speed = map(d, 0 ,100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    var steering = p5.Vector.sub(desired, this.vel);
    steering.limit(this.maxForce);
    return steering;
};

Vehicle.prototype.flee = function(target) {
    var desired = p5.Vector.sub(target, this.pos);
    var d = desired.mag();
    if (d < 50) {
        // Seek where the point should be, get vector for point to target
        desired.setMag(this.maxSpeed);
        desired.mult(-1);
        var steering = p5.Vector.sub(desired, this.vel);
        steering.limit(this.maxForce);
        return steering;
    } else {
        return createVector(0, 0);
    }
};



var TypingCarousel = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = period;
  this.text = '';
  this.tick();
  this.isDeleting = false;
};

TypingCarousel.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullText = this.toRotate[i];

  if (this.isDeleting) {
    this.text = fullText.substring(0, this.text.length - 1);
  } else {
    this.text = fullText.substring(0, this.text.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.text + '</span>';

  var that = this;
  var delta = 100 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.text === fullText) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.text === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('typing-carousel');
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute('text-rotate');
    var period = elements[i].getAttribute('text-period');
    if (toRotate) {
      new TypingCarousel(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = "";
  document.body.appendChild(css);
};