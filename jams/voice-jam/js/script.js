let speechRec;
let speech;
let word = "cat"; // The word to guess
let guessed = []; // Array to hold guessed letters
let incorrectGuesses = 0; // Count of incorrect guesses
let gameStarted = false; // Game state

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  textSize(32);
}

function draw() {
  if (!gameStarted) {
    background(240);
    text("Hangman", width / 2, height / 2);
  } else {
    background(255);
    drawHangman(incorrectGuesses);
    updateDisplayWord();
  }
}

function mousePressed() {
  if (!gameStarted) {
    gameStarted = true;
    initializeGame();
  }
}

function initializeGame() {
  // Initialize speech recognition
  speechRec = new p5.SpeechRec('en-US');
  speechRec.onResult = gotSpeech;
  speechRec.onStart = () => console.log("Speech recognition started");
  speechRec.onError = (error) => console.log("Speech recognition error:", error);
  speechRec.onEnd = () => console.log("Speech recognition ended");
  speechRec.start(true, false); // continuous = true, interimResults = false

  // Initialize speech synthesis
  speech = new p5.Speech();
}

function updateDisplayWord() {
  let displayWord = word.split('').map(letter => guessed.includes(letter) ? letter : "_").join(' ');
  textSize(32);
  textAlign(CENTER, BOTTOM);
  fill(0); // Ensure text color is set to black
  text(displayWord, width / 2, height - 50); // Adjusted to give space for the hangman drawing
}

function drawHangman(stage) {
  stroke(0);
  strokeWeight(2);

  // Base
  if (stage > 0) line(100, 350, 300, 350);
  
  // Pole
  if (stage > 1) line(200, 350, 200, 100);
  
  // Top
  if (stage > 2) line(200, 100, 150, 100);
  
  // Rope
  if (stage > 3) line(150, 100, 150, 150);
  
  // Head
  if (stage > 4) ellipse(150, 175, 50, 50);
  
  // Body
  if (stage > 5) line(150, 200, 150, 250);
  
  // Left Arm
  if (stage > 6) line(150, 220, 120, 190);
  
  // Right Arm
  if (stage > 7) line(150, 220, 180, 190);
  
  // Left Leg
  if (stage > 8) line(150, 250, 120, 280);
  
  // Right Leg
  if (stage > 9) line(150, 250, 180, 280);
}

function gotSpeech() {
  if (speechRec.resultValue) {
    let input = speechRec.resultString.toUpperCase();
    console.log("Recognized input:", input);
    let inputLetter = input.charAt(0);
    console.log("Recognized letter:", inputLetter);

    // Convert word to guess to uppercase for comparison
    let upperCaseWord = word.toUpperCase();
    
    // Check if the recognized letter is in the word, considering both in the same case
    if (upperCaseWord.includes(inputLetter)) {
      // Convert inputLetter to lowercase before adding to guessed to maintain consistency
      let lowerCaseInputLetter = inputLetter.toLowerCase();
      if (!guessed.includes(lowerCaseInputLetter)) {
        guessed.push(lowerCaseInputLetter); // Add the lowercase letter to guessed array
        speech.speak('Correct');
      }
    } else {
      speech.speak('Incorrect');
      incorrectGuesses++;
    }
  }
}
