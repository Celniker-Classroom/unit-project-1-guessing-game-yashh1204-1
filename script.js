// --- 1. INITIAL PROMPT (Step 6) ---
// This must run immediately when script.js loads
let rawName = prompt("What is your name?");
let playerName = "";

if (rawName && rawName.trim() !== "") {
    // Casing: Capitalize first letter, lowercase the rest (e.g., "jOhN" -> "John")
    playerName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
} else {
    playerName = "Player"; // Fallback name
}

// --- 2. GLOBAL VARIABLES ---
let answer = 0;
let range = 0;
let guessCount = 0;
let totalWins = 0;
let allScores = []; 
let startTime = 0;
let totalTime = 0;
let totalGamesPlayed = 0;
let fastestGame = Infinity;

// --- 3. EVENT LISTENERS (Step 2) ---
document.getElementById("playBtn").addEventListener("click", play);
document.getElementById("guessBtn").addEventListener("click", makeGuess);
document.getElementById("giveUpBtn").addEventListener("click", giveUp);

// --- 4. LIVE CLOCK (Step 10 & 11) ---
function time() {
    const now = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();

    // Day Suffixes logic from rubric
    let suffix = "th";
    if (day % 10 === 1 && day !== 11) suffix = "st";
    else if (day % 10 === 2 && day !== 12) suffix = "nd";
    else if (day % 10 === 3 && day !== 13) suffix = "rd";

    const timeStr = now.toLocaleTimeString(); 
    const fullDate = `${monthName} ${day}${suffix}, ${year} - ${timeStr}`;
    
    document.getElementById("date").textContent = fullDate;
    return fullDate;
}

// Start interval for live time
setInterval(time, 1000);
time(); // Call once immediately

// --- 5. CORE FUNCTIONS ---

// play() - Step 3
function play() {
    const radios = document.getElementsByName("level");
    for (let r of radios) {
        if (r.checked) {
            range = Number(r.value);
            r.disabled = true; // Disable radios during play
        }
    }

    // Required formula for autograder
    answer = Math.floor(Math.random() * range) + 1;
    guessCount = 0;
    startTime = new Date().getTime(); // Record start time in ms

    // Message must contain the cased playerName
    document.getElementById("msg").textContent = `${playerName}, I am thinking of a number between 1 and ${range}. Guess it!`;
    
    document.getElementById("playBtn").disabled = true;
    document.getElementById("guessBtn").disabled = false;
    document.getElementById("giveUpBtn").disabled = false;
    document.getElementById("guess").value = "";
}

// makeGuess() - Steps 4 & 5
function makeGuess() {
    guessCount++;
    const guessInput = document.getElementById("guess");
    const guess = Number(guessInput.value);
    const msg = document.getElementById("msg");
    const diff = Math.abs(guess - answer);

    // Proximity logic
    let proximity = "";
    if (diff <= 2) proximity = "hot";
    else if (diff <= 5) proximity = "warm";
    else proximity = "cold";

    if (guess === answer) {
        msg.textContent = `${playerName}, that is correct!`;
        totalWins++;
        updateScore(guessCount);
        updateTimers(new Date().getTime());
        reset();
    } else if (guess > answer) {
        msg.textContent = `${playerName}, your guess is high. You are ${proximity}.`;
    } else {
        msg.textContent = `${playerName}, your guess is low. You are ${proximity}.`;
    }
    guessInput.value = ""; // Clear input for next guess
}

// giveUp() - Step 9
function giveUp() {
    // Score becomes the range value (e.g. 10 for Medium)
    const penaltyScore = range;
    document.getElementById("msg").textContent = `The answer was ${answer}. ${playerName}, your score is ${penaltyScore}.`;
    
    updateScore(penaltyScore);
    updateTimers(new Date().getTime());
    reset();
}

// updateScore() - Step 7 & 8
function updateScore(score) {
    allScores.push(score);
    totalGamesPlayed++;

    document.getElementById("wins").textContent = `Wins: ${totalWins}`;

    // Average Guesses
    let sum = 0;
    for (let s of allScores) { sum += s; }
    let avg = sum / totalGamesPlayed;
    document.getElementById("avgScore").textContent = `Avg Score: ${avg.toFixed(2)}`;

    // Leaderboard (Sort Ascending)
    allScores.sort((a, b) => a - b);
    const liElements = document.getElementsByName("leaderboard");
    for (let i = 0; i < liElements.length; i++) {
        if (allScores[i] !== undefined) {
            liElements[i].textContent = allScores[i];
        } else {
            liElements[i].textContent = "--";
        }
    }
}

// updateTimers() - Step 12
function updateTimers(endMs) {
    const elapsedSeconds = (endMs - startTime) / 1000;
    totalTime += elapsedSeconds;

    if (elapsedSeconds < fastestGame) {
        fastestGame = elapsedSeconds;
    }

    document.getElementById("fastest").textContent = `Fastest: ${fastestGame.toFixed(2)}s`;
    document.getElementById("avgTime").textContent = `Avg Time: ${(totalTime / totalGamesPlayed).toFixed(2)}s`;
}

// reset() - Re-enable UI
function reset() {
    document.getElementById("playBtn").disabled = false;
    document.getElementById("guessBtn").disabled = true;
    document.getElementById("giveUpBtn").disabled = true;
    
    const radios = document.getElementsByName("level");
    for (let r of radios) {
        r.disabled = false;
    }
}