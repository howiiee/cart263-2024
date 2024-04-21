console.log('ml5 version:', ml5.version);

const num = 2000;
const noiseScale = 0.005;
const particles = [];
let handpose;
let predictions = [];
let speedMultiplier = 1; // Default speed multiplier

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
    stroke(255);
  }
  
  // Set up webcam
  const video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Set up Handpose
  handpose = ml5.handpose(video, modelReady);
  handpose.on('predict', results => {
    predictions = results;
  });
}

function modelReady() {
  console.log('Model ready!');
}

function draw() {
  background(0, 10);

  const fingersUp = countFingersUp();
  adjustSpeed(fingersUp);

  if (fingersUp !== 4) { // Pause if 4 fingers are up
    for (let i = 0; i < num; i++) {
      let p = particles[i];
      point(p.x, p.y);
      
      let n = noise(p.x * noiseScale, p.y * noiseScale) * TAU;
      p.x += cos(n) * speedMultiplier;
      p.y += sin(n) * speedMultiplier;

      if (!onScreen(p)) {
        p.x = random(width);
        p.y = random(height);
      }
    }
  }
}

function mousePressed() {
  noiseSeed(millis());
}

function countFingersUp() {
  if (predictions.length > 0) {
    const hand = predictions[0];
    const tips = [8, 12, 16, 20]; // Indexes for fingertips (excluding thumb)
    const bases = [5, 9, 13, 17]; // Indexes for finger bases (excluding thumb)
    let count = 0;

    // Simple up detection: tip above base
    tips.forEach((tipIndex, i) => {
      const yTip = hand.landmarks[tipIndex][1];
      const yBase = hand.landmarks[bases[i]][1];
      if (yTip < yBase) { // Assuming webcam view is normal, and y decreases upwards
        count++;
      }
    });

    // Thumb special case, more horizontal: compare x positions
    const thumbTip = hand.landmarks[4][0];
    const thumbBase = hand.landmarks[1][0];
    if (thumbTip > thumbBase) { // Adjust logic based on camera mirroring
      count++;
    }

    return count;
  }
  return 0; // Default if no hands are detected
}

function adjustSpeed(fingersUp) {
  switch (fingersUp) {
    case 0:
      speedMultiplier = 1;
      break;
    case 1:
      speedMultiplier = 2; // Adjust these values as needed for desired speed
      break;
    case 2:
      speedMultiplier = 3;
      break;
    case 3:
      speedMultiplier = 4;
      break;
    case 4:
      // Speed multiplier not updated, screen pauses
      break;
    default:
      speedMultiplier = 1; // Fallback, can adjust if needed
  }
}

function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}
