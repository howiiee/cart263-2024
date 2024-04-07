let images = [];
let positions = [];
let currentIndex = 0;
let transitionDuration = 1500; // Transition duration in milliseconds
let transitionStartTime = -1; // Start time of the transition

function preload() {
  // Load your images here
  images[0] = loadImage("assets/images/black.png");
  images[1] = loadImage("assets/images/pink.jpg");
  images[2] = loadImage("assets/images/blue.png");
  images[3] = loadImage("assets/images/red.png");
  images[4] = loadImage("assets/images/green.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let sizeRatio = 0.45; // Ratio of the main image size to the smaller screen dimension
  let mainImageSize = min(windowWidth, windowHeight) * sizeRatio; // Main image size as a square

  // Calculate the center coordinates for image 1
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;

  // Initialize positions with sizes as perfect squares
  positions = [
    { x: centerX, y: centerY, w: mainImageSize, h: mainImageSize }, // Center image (image 1)
    {
      x: centerX + mainImageSize / 2 - mainImageSize / 3.5,
      y: windowHeight - mainImageSize / 4.8,
      w: mainImageSize / 2.4,
      h: mainImageSize / 2.4,
    }, // Image 2
    {
      x: centerX + mainImageSize / 2 - mainImageSize / 1.3,
      y: windowHeight,
      w: mainImageSize / 4,
      h: mainImageSize / 4,
    }, // Image 3
    {
      x: centerX - mainImageSize / 2 + mainImageSize / 1.3,
      y: 0,
      w: mainImageSize / 4,
      h: mainImageSize / 4,
    }, // Image 4
    {
      x: centerX - mainImageSize / 2 + mainImageSize / 3.5,
      y: mainImageSize / 4.8,
      w: mainImageSize / 2.4,
      h: mainImageSize / 2.4,
    }, // Image 5
  ];

  // Initialize target positions
  positions.forEach((pos) => {
    pos.targetX = pos.x;
    pos.targetY = pos.y;
    pos.targetW = pos.w;
    pos.targetH = pos.h;
  });
}

function draw() {
  background(255);
  imageMode(CENTER);

  let currentTime = millis();
  let transitionProgress = min(
    1,
    (currentTime - transitionStartTime) / transitionDuration
  );

  for (let i = 0; i < images.length; i++) {
    let pos = positions[i];

    if (transitionStartTime > 0 && transitionProgress < 1) {
      let easing = ease(transitionProgress);
      pos.x = lerp(pos.x, pos.targetX, easing);
      pos.y = lerp(pos.y, pos.targetY, easing);
      pos.w = lerp(pos.w, pos.targetW, easing);
      pos.h = lerp(pos.h, pos.targetH, easing);
    } else if (transitionProgress >= 1) {
      pos.x = pos.targetX;
      pos.y = pos.targetY;
      pos.w = pos.targetW;
      pos.h = pos.targetH;
    }

    image(images[i], pos.x, pos.y, pos.w, pos.h);
  }

  if (transitionProgress >= 1) {
    transitionStartTime = -1;
  }
}

function updatePositions(direction) {
  // Clone the current target positions
  let currentTargets = positions.map((p) => ({
    x: p.targetX,
    y: p.targetY,
    w: p.targetW,
    h: p.targetH,
  }));

  if (direction === "up") {
    // Move the first image to the end
    let first = currentTargets.shift();
    currentTargets.push(first);
  } else if (direction === "down") {
    // Move the last image to the beginning
    let last = currentTargets.pop();
    currentTargets.unshift(last);
  }

  // Update the target positions
  for (let i = 0; i < positions.length; i++) {
    positions[i].targetX = currentTargets[i].x;
    positions[i].targetY = currentTargets[i].y;
    positions[i].targetW = currentTargets[i].w;
    positions[i].targetH = currentTargets[i].h;
  }

  // Restart the transition
  transitionStartTime = millis();
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    updatePositions("up");
  } else if (keyCode === DOWN_ARROW) {
    updatePositions("down");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setup(); // or the specific part of setup that recalculates the positions
}

function ease(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
