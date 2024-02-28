// Importing ml5.js library for machine learning capabilities
// Note: Ensure the ml5 library is linked in your HTML

let stateIndex = 0; // Now starts at 0 for the "intro" state
const states = ['intro', 'space', 'water', 'sand', 'wind']; // Added "intro" state
const backgroundColors = ['#2c3e50', '#000000', '#3498db', '#c2b280', '#ADD8E6']; // Added color for "intro"
let currentState = states[stateIndex];
let simulationStarted = false;

// Simulation variables
const num = 2000;
const noiseScale = 0.005;
const particles = [];
let handpose;
let predictions = [];
let speedMultiplier = 1; // Default speed multiplier

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(32);
  textAlign(CENTER, CENTER);

  // Initialize particles
  for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
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
  background(backgroundColors[stateIndex] + '10'); // Always draw the background with low opacity
  
  if (currentState === 'intro') {
    fill(255); // White text color
    textSize(16); // Adjusted text size for intro text
    text("Welcome to the Interactive Particle Simulation!\n\n" +
         "Speed Control:\n" +
         "1 Finger Up: Particles move faster.\n" +
         "2 Fingers Up: Even faster movement.\n" +
         "3 Fingers Up: Fastest speed.\n\n" +
         "Pause: 4 fingers up to pause.\n\n" +
         "State Transition: 5 fingers up to change states.\n\n" +
         "Click anywhere to start.", width / 2, height / 2);
  } else if (!simulationStarted) {
    fill(255); // Reset text color and size for state display
    textSize(32);
    text(`${currentState.toUpperCase()}`, width / 2, height / 2);
  } else {
    // Rest of the simulation code
    const fingersUp = countFingersUp();
    
    if (fingersUp === 5) {
      stateIndex = (stateIndex + 1) % states.length;
      currentState = states[stateIndex];
      simulationStarted = false;
    } else {
      adjustSpeed(fingersUp);
      for (let i = 0; i < num; i++) {
        let p = particles[i];
        stroke(255); // Set particle color
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
}

function mousePressed() {
  if (currentState === 'intro') {
    stateIndex = 1; // Move to the first interactive state (e.g., "space")
    currentState = states[stateIndex];
  } else if (!simulationStarted) {
    simulationStarted = true;
  }
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
      speedMultiplier = 2;
      break;
    case 2:
      speedMultiplier = 3;
      break;
    case 3:
      speedMultiplier = 4;
      break;
    case 4:
      // Intentionally left blank for pause
      break;
    default:
      speedMultiplier = 1; // Fallback
  }
}

function onScreen(v) {
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}
