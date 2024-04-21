let stateIndex = 0; // Initialize stateIndex at 0 for the "intro" state
const states = ['intro', 'space', 'water', 'sand', 'wind']; // Define available states
const backgroundColors = ['#2c3e50', '#000000', '#3498db', '#c2b280', '#ADD8E6']; // Background colors for each state
let currentState = states[stateIndex]; // Set the current state based on the stateIndex
let simulationStarted = false; // Flag to track if the simulation has started

const num = 2000; // Number of particles
const noiseScale = 0.005; // Scale factor for noise in particle movement
const particles = []; // Array to store particle vectors
let speedMultiplier = 1; // Speed multiplier for particle movement
let speechRec; // Variable to store the speech recognition object

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

function gotSpeech() {
    if (speechRec.resultValue) {
        let command = speechRec.resultString.toLowerCase();
        console.log(command); // Debugging output

        if (command.includes("stop") || command.includes("pause")) {
            speedMultiplier = 0; // Pause particles
        } else if (command.includes("faster")) {
            speedMultiplier = Math.min(speedMultiplier + 1, 5); // Increase speed, max out at 5
        } else if (command.includes("slower")) {
            speedMultiplier = Math.max(speedMultiplier - 1, 0.5); // Decrease speed, minimum at 0.5
        } else if (command.includes("continue") || command.includes("resume")) {
            if (speedMultiplier === 0) speedMultiplier = 1; // Resume movement
        } else if (command.includes("change") || command.includes("switch")) {
            stateIndex = (stateIndex + 1) % states.length; // Switch state
            currentState = states[stateIndex];
            simulationStarted = false; // Reset simulation flag
        }
    }
}

function draw() {
    background(backgroundColors[stateIndex] + '10'); // Low opacity background for fade effect

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
    text("Welcome to the Interactive Particle Simulation!\n\n" +
         "Say 'faster' to increase particle speed.\n" +
         "Say 'slower' to decrease particle speed.\n" +
         "Say 'stop' to pause the movement.\n" +
         "Say 'continue' to resume the movement.\n" +
         "Say 'change' or 'switch' to change states.\n\n" +
         "Click anywhere or say 'start' to begin.", width / 2, height / 2);
}

function displayStateName() {
    fill(255);
    textSize(32);
    text(`${currentState.toUpperCase()}`, width / 2, height / 2);
}

function runSimulation() {
    for (let i = 0; i < num; i++) {
        let p = particles[i];
        stroke(255);
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
