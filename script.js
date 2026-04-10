// --- Player Name ---
let rawName = prompt("What is your name?");
let playerName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

// --- Game State ---
let guessDistance = "";
let guessTemp = "";
let wins = 0;
let totalGuesses = 0;
let scores = [];
let startTime = 0;
let roundTimes = [];

// --- Event Listeners (no onclick in HTML) ---
document.getElementById("playBtn").addEventListener("click", play);
document.getElementById("guessBtn").addEventListener("click", makeGuess);
document.getElementById("giveUpBtn").addEventListener("click", giveUp);

// --- Date/Time ---
function time() {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const now = new Date();
  const month = months[now.getMonth()];
  const day = now.getDate();
  const year = now.getFullYear();

  // Day suffix
  let suffix = "th";
  if (day % 100 < 11 || day % 100 > 13) {
    if (day % 10 === 1) suffix = "st";
    else if (day % 10 === 2) suffix = "nd";
    else if (day % 10 === 3) suffix = "rd";
  }

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return month + " " + day + suffix + ", " + year + " — " + hours + ":" + minutes + ":" + seconds;
}

// Update date display every second
document.getElementById("date").textContent = time();
setInterval(function () {
  document.getElementById("date").textContent = time();
}, 1000);

// --- Play ---
function play() {
  // Get selected difficulty range
  const levels = document.getElementsByName("level");
  let range = 10; // default Medium
  for (let i = 0; i < levels.length; i++) {
    if (levels[i].checked) {
      range = Number(levels[i].value);
      break;
    }
  }
  window.range = range;

  // Generate secret number using required formula
  window.secretNumber = Math.floor(Math.random() * range) + 1;
  window.attempts = 0;

  // Record round start time
  startTime = new Date().getTime();

  // Update message
  document.getElementById("msg").textContent =
    playerName + ", I'm thinking of a number between 1 and " + range + ". Guess it!";

  // Enable Guess and Give Up, disable Play
  document.getElementById("guessBtn").disabled = false;
  document.getElementById("giveUpBtn").disabled = false;
  document.getElementById("playBtn").disabled = true;

  // Disable level radios during round
  const radios = document.getElementsByName("level");
  for (let i = 0; i < radios.length; i++) {
    radios[i].disabled = true;
  }
}

// --- Make Guess ---
function makeGuess() {
  window.attempts++;
  const guessNumber = Number(document.getElementById("guess").value);
  const diff = Math.abs(guessNumber - window.secretNumber);

  // High / Low / Correct
  if (guessNumber < window.secretNumber) {
    guessDistance = "too low";
  } else if (guessNumber > window.secretNumber) {
    guessDistance = "too high";
  } else {
    guessDistance = "correct";
    wins++;
    totalGuesses += window.attempts;
    updateScore(window.attempts);
    updateTimers(new Date().getTime());
    document.getElementById("guessBtn").disabled = true;
    document.getElementById("giveUpBtn").disabled = true;
    document.getElementById("playBtn").disabled = false;
    reset();
    document.getElementById("msg").textContent =
      playerName + ", that is correct! You guessed it in " + window.attempts + " attempt(s)!";
    return;
  }

  // Hot / Warm / Cold
  if (diff <= 2) {
    guessTemp = "hot and ";
  } else if (diff <= 5) {
    guessTemp = "warm and ";
  } else {
    guessTemp = "cold and ";
  }

  document.getElementById("msg").textContent =
    playerName + ", your guess was " + guessTemp + guessDistance + ".";
}

// --- Update Score (wins, avgScore, leaderboard) ---
function updateScore(score) {
  scores.push(score);
  scores.sort(function (a, b) { return a - b; });

  // Wins
  document.getElementById("wins").textContent = "Wins: " + wins;

  // Average score
  const avg = totalGuesses / wins;
  document.getElementById("avgScore").textContent = "Avg Score: " + avg.toFixed(1);

  // Leaderboard top 3
  const items = document.getElementsByName("leaderboard");
  for (let i = 0; i < items.length; i++) {
    if (scores[i] !== undefined) {
      items[i].textContent = scores[i];
    } else {
      items[i].textContent = "--";
    }
  }
}

// --- Update Timers (fastest, avgTime) ---
function updateTimers(endMs) {
  const elapsed = endMs - startTime;
  roundTimes.push(elapsed);

  // Fastest
  let fastest = roundTimes[0];
  for (let i = 1; i < roundTimes.length; i++) {
    if (roundTimes[i] < fastest) fastest = roundTimes[i];
  }
  document.getElementById("fastest").textContent =
    "Fastest: " + (fastest / 1000).toFixed(2) + "s";

  // Average time
  let total = 0;
  for (let i = 0; i < roundTimes.length; i++) {
    total += roundTimes[i];
  }
  const avgT = total / roundTimes.length;
  document.getElementById("avgTime").textContent =
    "Avg Time: " + (avgT / 1000).toFixed(2) + "s";
}

// --- Reset (re-enable level radios and Play for next round) ---
function reset() {
  const radios = document.getElementsByName("level");
  for (let i = 0; i < radios.length; i++) {
    radios[i].disabled = false;
  }
}

// --- Give Up ---
function giveUp() {
  const score = window.range;         // score = range value (3, 10, or 100)
  totalGuesses += score;
  wins++;                             // give up still counts as a completed round for stats
  // Note: per rubric, give up sets score to range; wins counter behavior follows updateScore
  // Revert wins increment — give up does NOT count as a win
  wins--;
  totalGuesses -= score;

  // Update score (leaderboard + stats) without counting as a win
  scores.push(score);
  scores.sort(function (a, b) { return a - b; });

  const items = document.getElementsByName("leaderboard");
  for (let i = 0; i < items.length; i++) {
    if (scores[i] !== undefined) {
      items[i].textContent = scores[i];
    } else {
      items[i].textContent = "--";
    }
  }

  // Update timers
  updateTimers(new Date().getTime());

  // Update wins display (unchanged)
  document.getElementById("wins").textContent = "Wins: " + wins;
  if (wins > 0) {
    document.getElementById("avgScore").textContent =
      "Avg Score: " + (totalGuesses / wins).toFixed(1);
  }

  // Disable Guess/GiveUp, re-enable Play
  document.getElementById("guessBtn").disabled = true;
  document.getElementById("giveUpBtn").disabled = true;
  document.getElementById("playBtn").disabled = false;
  reset();

  document.getElementById("msg").textContent =
    playerName + ", you gave up! The answer was " + window.secretNumber + ". Your score is " + score + ".";
}