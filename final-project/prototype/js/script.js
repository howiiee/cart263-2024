let stateIndex = 0; // Initialize stateIndex at 0 for the "intro" state
const states = ['intro', 'space', 'water', 'sand', 'wind']; // Define available states including "intro"
const backgroundColors = ['#2c3e50', '#000000', '#3498db', '#c2b280', '#ADD8E6']; // Define background colors for each state including "intro"
let currentState = states[stateIndex]; // Set the current state based on the stateIndex
let simulationStarted = false; // Flag to track if the simulation has started

// Simulation variables
const num = 2000; // Number of particles to generate
const noiseScale = 0.005; // Scale factor for noise in particle movement
const particles = []; // Array to store particle vectors
let handpose; // Variable to store the Handpose model
let predictions = []; // Array to store Handpose model predictions
let speedMultiplier = 1; // Default speed multiplier for particle movement

function setup() {
  createCanvas(windowWidth, windowHeight); // Set up the canvas to fill the window
  textSize(32); // Default text size
  textAlign(CENTER, CENTER); // Set text alignment

  // Initialize particles with random positions
  for (let i = 0; i < num; i++) {
    particles.push(createVector(random(width), random(height)));
  }
  
  // Set up webcam
  const video = createCapture(VIDEO); // Create a video capture object
  video.size(width, height); // Set the video size to match the canvas
  video.hide(); // Hide the actual video element

  // Set up Handpose
  handpose = ml5.handpose(video, modelReady); // Initialize Handpose with the video
  handpose.on('predict', results => { // Event listener for predictions
    predictions = results; // Update predictions with results from Handpose
  });
}

function modelReady() {
  console.log('Model ready!'); // Callback function to log when the model is ready
}

function draw() {
  background(backgroundColors[stateIndex] + '10'); // Draw the background with low opacity for fade effect
  
  // Intro state display logic
  if (currentState === 'intro') {
    fill(255); // Set text color to white
    textSize(16); // Adjust text size for intro text
    // Display intro text with instructions
    text("Welcome to the Interactive Particle Simulation!\n\n" +
         "Speed Control:\n" +
         "1 Finger Up: Particles move faster.\n" +
         "2 Fingers Up: Even faster movement.\n" +
         "3 Fingers Up: Fastest speed.\n\n" +
         "Pause: 4 fingers up to pause.\n\n" +
         "State Transition: 5 fingers up to change states.\n\n" +
         "Click anywhere to start.", width / 2, height / 2);
  } else if (!simulationStarted) {
    // State display logic before simulation starts
    fill(255); // Reset text color to white
    textSize(32); // Reset text size
    // Display current state name
    text(`${currentState.toUpperCase()}`, width / 2, height / 2);
  } else {
    // Simulation logic
    const fingersUp = countFingersUp(); // Count the number of fingers up
    
    // State transition logic
    if (fingersUp === 5) {
      stateIndex = (stateIndex + 1) % states.length; // Cycle through states
      currentState = states[stateIndex]; // Update current state
      simulationStarted = false; // Reset simulation start flag
    } else {
      adjustSpeed(fingersUp); // Adjust particle speed based on fingers up
      // Particle movement logic
      for (let i = 0; i < num; i++) {
        let p = particles[i];
        stroke(255); // Set particle color to white
        point(p.x, p.y); // Draw particle

        let n = noise(p.x * noiseScale, p.y * noiseScale) * TAU; // Calculate noise-based angle
        p.x += cos(n) * speedMultiplier; // Move particle based on angle and speed multiplier
        p.y += sin(n) * speedMultiplier;

        // Reset particle position if it moves off-screen
        if (!onScreen(p)) {
          p.x = random(width);
          p.y = random(height);
        }
      }
    }
  }
}

function mousePressed() {
  // Logic to start the simulation or move to the next state on mouse press
  if (currentState === 'intro') {
    stateIndex = 1; // Move to the first interactive state (e.g., "space")
    currentState = states[stateIndex]; // Update current state
  } else if (!simulationStarted) {
    simulationStarted = true; // Start the simulation
  }
  noiseSeed(millis()); // Reset noise seed for variety in particle movement
}

function countFingersUp() {
  // Function to count the number of fingers up using Handpose predictions
  if (predictions.length > 0) {
    const hand = predictions[0]; // Assume single hand for simplicity
    const tips = [8, 12, 16, 20]; // Indexes for fingertips (excluding thumb)
    const bases = [5, 9, 13, 17]; // Indexes for finger bases (excluding thumb)
    let count = 0; // Initialize finger count

    // Count fingers by comparing tip and base positions
    tips.forEach((tipIndex, i) => {
      const yTip = hand.landmarks[tipIndex][1];
      const yBase = hand.landmarks[bases[i]][1];
      if (yTip < yBase) { // Finger is up if tip is above base
        count++;
      }
    });

    // Thumb special case, considering more horizontal orientation
    const thumbTip = hand.landmarks[4][0];
    const thumbBase = hand.landmarks[1][0];
    if (thumbTip > thumbBase) { // Adjust for camera mirroring
      count++;
    }

    return count; // Return the total count of fingers up
  }
  return 0; // Return 0 if no hands are detected
}

function adjustSpeed(fingersUp) {
  // Adjust particle speed based on the number of fingers up
  switch (fingersUp) {
    case 0:
      speedMultiplier = 1; // Default speed
      break;
    case 1:
      speedMultiplier = 2; // Increase speed
      break;
    case 2:
      speedMultiplier = 3; // Further increase speed
      break;
    case 3:
      speedMultiplier = 4; // Maximum speed
      break;
    case 4:
      // Intentionally left blank for pause
      break;
    default:
      speedMultiplier = 1; // Fallback to default speed
  }
}

function onScreen(v) {
  // Check if a particle is within the screen bounds
  return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}
