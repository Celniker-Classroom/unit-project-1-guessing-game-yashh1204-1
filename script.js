// --- Initial Setup & Name Casing (Step 6) ---
let rawName = prompt("What is your name?");
// Capitalize first letter, lowercase the rest
let playerName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

// --- Global Variables (Step 7) ---
let secretNumber = 0;
let attempts = 0;
let totalWins = 0;
let totalGuesses = 0;
let currentRange = 0;

// Selecting the message element
const promptGuess = document.getElementById("msg");

// --- Event Listeners (Step 2) ---
document.getElementById("playBtn").addEventListener("click", play);
document.getElementById("guessBtn").addEventListener("click", makeGuess);
document.getElementById("giveUpBtn").addEventListener("click", giveUp);

// --- Play Function (Step 3) ---
function play() {
    // Get range from selected radio button
    const radios = document.getElementsByName("level");
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            currentRange = Number(radios[i].value);
        }
    }

    // Generate random number based on range (1 to range)
    secretNumber = Math.floor(Math.random() * currentRange) + 1;
    attempts = 0;

    // Update UI
    promptGuess.textContent = "Okay " + playerName + ", I'm thinking of a number between 1 and " + currentRange + ".";
    
    // Enable/Disable buttons
    document.getElementById("guessBtn").disabled = false;
    document.getElementById("giveUpBtn").disabled = false;
    document.getElementById("playBtn").disabled = true;

    // Clear previous guess input
    document.getElementById("guess").value = "";
}

// --- Guess Function (Steps 4 & 5) ---
function makeGuess() {
    attempts++;
    const guessNumber = Number(document.getElementById("guess").value);
    let guessDistance = "";
    let guessTemp = "";
    let diff = Math.abs(guessNumber - secretNumber);

    // 1. Check High/Low/Correct (Step 4 - Case Insensitive keywords)
    if (guessNumber < secretNumber) {
        guessDistance = "low";
    } else if (guessNumber > secretNumber) {
        guessDistance = "high";
    } else {
        guessDistance = "correct";
    }

    // 2. Check Proximity (Step 5 - Case Insensitive keywords)
    if (diff === 0) {
        guessTemp = ""; // Correct guess doesn't need hot/cold
    } else if (diff <= 2) {
        guessTemp = "hot";
    } else if (diff <= 5) {
        guessTemp = "warm";
    } else {
        guessTemp = "cold";
    }

    // 3. Output Feedback and handle Win (Step 7)
    if (guessDistance === "correct") {
        promptGuess.textContent = playerName + ", that is correct!";
        
        // Update Stats Logic
        totalWins++;
        totalGuesses += attempts;
        
        // Update HTML text
        document.getElementById("wins").textContent = "Total wins: " + totalWins;
        document.getElementById("avgScore").textContent = "Average Score: " + (totalGuesses / totalWins).toFixed(2);

        // Reset Buttons for end of round
        document.getElementById("guessBtn").disabled = true;
        document.getElementById("giveUpBtn").disabled = true;
        document.getElementById("playBtn").disabled = false;
    } else {
        // Construct feedback: uses player name, temp (hot/warm/cold) and distance (high/low)
        promptGuess.textContent = playerName + ", you are " + guessTemp + " and too " + guessDistance;
    }
}

// --- Placeholder for Give Up (Required for Step 2 Event Listener) ---
function giveUp() {
    // Basic functionality to reset UI until Step 9 is fully implemented
    document.getElementById("guessBtn").disabled = true;
    document.getElementById("giveUpBtn").disabled = true;
    document.getElementById("playBtn").disabled = false;
    promptGuess.textContent = "The number was " + secretNumber + ". Try again, " + playerName + "!";
}