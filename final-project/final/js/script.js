let stateIndex = 0; // Initialize stateIndex at 0 for the "intro" state
const states = ['intro', 'space', 'water', 'sand', 'wind']; // Define available states
const backgroundColors = ['#2c3e50', '#000000', '#3498db', '#c2b280', '#ADD8E6']; // Background colors for each state
const particleColors = ['#ecf0f1', '#ffcd3c', '#FFFFFF', '#e67e22', '#2ecc71']; // Particle colors for each state
let currentState = states[stateIndex]; // Set the current state based on the stateIndex
let simulationStarted = false; // Flag to track if the simulation has started
let soundIntro, soundSpace, soundWater, soundSand, soundWind;

const num = 2000; // Number of particles
const noiseScale = 0.005; // Scale factor for noise in particle movement
const particles = []; // Array to store particle vectors
let speedMultiplier = 1; // Speed multiplier for particle movement
let speechRec; // Variable to store the speech recognition object
let mode = 'normal'; // Mode can be 'normal', 'disperse', 'group'

function preload() {
  soundSpace = loadSound('assets/sounds/space.mp3');
  soundWater = loadSound('assets/sounds/water.mp3');
  soundSand = loadSound('assets/sounds/sand.mp3');
  soundWind = loadSound('assets/sounds/wind.mp3');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    textSize(32);
    textAlign(CENTER, CENTER);

    // Initialize particles
    for (let i = 0; i < num; i++) {
        particles.push(createVector(random(width), random(height)));
    }

    // Set up speech recognition
    speechRec = new p5.SpeechRec('en-US', gotSpeech);
    speechRec.continuous = true;
    speechRec.interimResults = false;
    speechRec.start();

    frameRate(60);
}

function manageSounds() {
  switch (currentState) {
      case 'space':
          playSound(soundSpace);
          break;
      case 'water':
          playSound(soundWater);
          break;
      case 'sand':
          playSound(soundSand);
          break;
      case 'wind':
          playSound(soundWind);
          break;
  }

  // This function plays the given sound if it's not already playing
  function playSound(sound) {
      [soundSpace, soundWater, soundSand, soundWind].forEach(s => {
          if (s === sound) {
              if (!s.isPlaying()) {
                  s.loop();  // Use loop() instead of play() to loop the sound
              }
          } else {
              s.stop();
          }
      });
  }
}

function gotSpeech() {
  if (speechRec.resultValue) {
      let command = speechRec.resultString.toLowerCase();
      processCommand(command);
  }
}

function processCommand(command) {
  if (command.includes("stop") || command.includes("pause")) {
      speedMultiplier = 0;
  } else if (command.includes("faster")) {
      speedMultiplier = Math.min(speedMultiplier + 1, 5);
  } else if (command.includes("slower")) {
      speedMultiplier = Math.max(speedMultiplier - 1, 0.5);
  } else if (command.includes("continue") || command.includes("resume")) {
      if (speedMultiplier === 0) speedMultiplier = 1;
      mode = 'normal';
  } else if (command.includes("disperse")) {
      mode = 'disperse';
  } else if (command.includes("group")) {
      mode = 'group';
  } else if (command.includes("change") || command.includes("switch")) {
    stateIndex = (stateIndex + 1) % states.length;
    currentState = states[stateIndex];
    simulationStarted = false;
  }
}

function draw() {
    background(backgroundColors[stateIndex] + '10'); // Low opacity background for fade effect
    manageSounds();  // Manage sounds based on the current state

    if (currentState === 'intro') {
        displayIntro();
    } else if (!simulationStarted) {
        displayStateName();
    } else {
        runSimulation();
    }
}

function displayIntro() {
    fill(255);
    textSize(16);
    text("WHISPER \n\n" +
         "Say 'faster' to increase particle speed.\n" +
         "Say 'slower' to decrease particle speed.\n" +
         "Say 'stop' to pause the movement.\n" +
         "Say 'continue' to resume the movement.\n" +
         "Say 'disperse' to scatter particles.\n" +
         "Say 'group' to gather particles in the center.\n" +
         "Say 'change' or 'switch' to change states.\n\n" +
         "Click anywhere or say 'start' to begin.", width / 2, height / 2);
}

function displayStateName() {
    fill(255);
    textSize(32);
    noStroke();
    text(`${currentState.toUpperCase()}`, width / 2, height / 2);
}

function runSimulation() {
    stroke(particleColors[stateIndex]); // Set particle color based on the current state

    for (let i = 0; i < num; i++) {
        let p = particles[i];

        if (mode === 'normal') {
            let n = noise(p.x * noiseScale, p.y * noiseScale) * TAU;
            p.x += cos(n) * speedMultiplier;
            p.y += sin(n) * speedMultiplier;
        } else if (mode === 'disperse') {
            p.x += random(-1, 1) * speedMultiplier * 10;
            p.y += random(-1, 1) * speedMultiplier * 10;
        } else if (mode === 'group') {
            p.x -= (p.x - width / 2) * 0.05 * speedMultiplier;
            p.y -= (p.y - height / 2) * 0.05 * speedMultiplier;
        }

        point(p.x, p.y); // Draw particle

        // Wrap around edges to keep particles on screen
        if (!onScreen(p)) {
            p.x = random(width);
            p.y = random(height);
        }
    }
}

function mousePressed() {
    if (currentState === 'intro') {
        stateIndex = 1;
        currentState = states[stateIndex];
    }
    simulationStarted = true;
    noiseSeed(millis());
}

function onScreen(v) {
    return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}
