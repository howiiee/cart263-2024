let speechRec;
let speech;
let word = ""; // The word to guess will be set after loading from file
let guessed = []; // Array to hold guessed letters
let incorrectGuesses = 0; // Count of incorrect guesses
let incorrectLetters = []; // Array to hold incorrect guessed letters
let gameStarted = false; // Game state
let fullWordGuessed = false; // A flag to indicate if the full word was guessed
let showEndGameMessage = false; // Flag to indicate if the end game message should be shown
let words = []; // Array to hold words from the file
let pendingConfirmation = false; // Flag to indicate if a letter is waiting for confirmation
let letterToConfirm = ''; // The letter to be confirmed

function preload() {
  // Load the words from a file
  words = loadStrings('words.txt');
}

function setup() {
  createCanvas(400, 400);
  textAlign(CENTER, CENTER);
  textSize(32);
  initializeGame(); // Now initializes the game after loading words
}

function draw() {
  if (!gameStarted && !showEndGameMessage) {
    background(240);
    text("Click to Start", width / 2, height / 2);
  } else if (showEndGameMessage) {
    // The end game message is displayed in displayEndGameMessage
  } else {
    background(200);
    drawHangman(incorrectGuesses);
    updateDisplayWord();
    displayIncorrectLetters(); // Display incorrect letters
    checkGameState(); // Check if the game has been won or lost
  }
}

function mousePressed() {
  if (showEndGameMessage) {
    // Reset the game to start anew
    incorrectGuesses = 0;
    guessed = [];
    incorrectLetters = []; // Reset incorrect letters for a fresh start
    fullWordGuessed = false;
    gameStarted = true;
    showEndGameMessage = false;
    word = random(words).trim(); // Select a new word for the new game
  } else if (!gameStarted) {
    gameStarted = true; // Start the game on initial click or after resetting
    incorrectGuesses = 0; // Reset incorrect guesses for a fresh start
    guessed = []; // Clear any guessed letters
    incorrectLetters = []; // Clear incorrect letters
    fullWordGuessed = false; // Reset full word guessed flag
    showEndGameMessage = false; // Ensure end game message is not shown at the start
  }
}

function initializeGame() {
  // Select a random word from the loaded words
  if (words.length > 0) {
    word = random(words).trim();
  } else {
    console.log("No words loaded or error in loading words.");
    word = "cat"; // Default word in case no words are loaded
  }

  // Initialize speech recognition
  speechRec = new p5.SpeechRec('en-US');
  speechRec.onResult = gotSpeech;
  speechRec.onStart = () => console.log("Speech recognition started");
  speechRec.onError = (error) => console.log("Speech recognition error:", error);
  speechRec.onEnd = () => console.log("Speech recognition ended");
  speechRec.start(true, false); // continuous = true, interimResults = false

  // Initialize speech synthesis
  speech = new p5.Speech();

  gameStarted = false; // Wait for user to click to start
}

function updateDisplayWord() {
  let displayWord = word.split('').map(letter => guessed.includes(letter) ? letter : "_").join(' ');
  textSize(32);
  textAlign(CENTER, BOTTOM);
  fill(0); // Ensure text color is set to black
  text(displayWord, width / 2, height - 25); // Adjusted to give space for the hangman drawing
}

function drawHangman(stage) {
  stroke(0);
  strokeWeight(2);

  // Draw the hangman based on the number of incorrect guesses
  if (stage > 0) line(100, 325, 300, 325); // Base
  if (stage > 1) line(200, 325, 200, 75); // Pole
  if (stage > 2) line(200, 75, 150, 75); // Top
  if (stage > 3) line(150, 75, 150, 125); // Rope
  if (stage > 4) ellipse(150, 150, 50, 50); // Head
  if (stage > 5) line(150, 175, 150, 225); // Body
  if (stage > 6) line(150, 195, 120, 165); // Left Arm
  if (stage > 7) line(150, 195, 180, 165); // Right Arm
  if (stage > 8) line(150, 225, 120, 255); // Left Leg
  if (stage > 9) line(150, 225, 180, 255); // Right Leg
}

function gotSpeech() {
  if (speechRec.resultValue) {
    let input = speechRec.resultString.toUpperCase().trim();
    console.log("Recognized input:", input);

    if (pendingConfirmation) {
      if (input === "YES") {
        processLetter(letterToConfirm);
        pendingConfirmation = false;
        letterToConfirm = '';
      } else if (input === "NO") {
        speech.speak("Let's try again.");
        pendingConfirmation = false;
        letterToConfirm = '';
      } else {
        speech.speak(`Did you say the letter ${letterToConfirm}? Yes or no?`);
      }
    } else {
      if (input.length === 1) {
        letterToConfirm = input;
        pendingConfirmation = true;
        speech.speak(`Did you say the letter ${letterToConfirm}? Yes or no?`);
      } else if (input === word.toUpperCase()) {
        fullWordGuessed = true;
        speech.speak("Correct, you guessed the word!");
      }
    }
  }
}

function processLetter(inputLetter) {
  console.log("Recognized letter:", inputLetter);
  let upperCaseWord = word.toUpperCase();
  let lowerCaseInputLetter = inputLetter.toLowerCase();
  if (upperCaseWord.includes(inputLetter)) {
    if (!guessed.includes(lowerCaseInputLetter)) {
      guessed.push(lowerCaseInputLetter);
      speech.speak('Correct');
    }
  } else {
    if (!incorrectLetters.includes(lowerCaseInputLetter)) {
      incorrectLetters.push(lowerCaseInputLetter); // Add to incorrect letters if not already present
      speech.speak('Incorrect');
    }
    incorrectGuesses++;
  }
}

function displayIncorrectLetters() {
  textSize(20);
  fill(255, 0, 0); // Set text color to red for incorrect letters
  textAlign(LEFT, TOP);
  text("Incorrect: " + incorrectLetters.join(', '), 10, 10); // Display at the top left corner
}

function checkGameState() {
  let won = word.split('').every(letter => guessed.includes(letter)) || fullWordGuessed;
  let lost = incorrectGuesses > 9;

  if (won || lost) {
    let message = won ? "You Win! Click to restart." : "Game Over! Click to restart.";
    displayEndGameMessage(message);
  }
}

function displayEndGameMessage(message) {
  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text(message, width / 2, height / 2);
  if (message.includes("Game Over")) {
    text(`The word was: ${word}`, width / 2, height / 2 + 30);
  }
  showEndGameMessage = true; // Indicate that the end game message is currently being displayed
}
