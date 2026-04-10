// --- Initial Setup ---
let rawName = prompt("What is your name?") || "Player";
let playerName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

// Inject name into starting message
document.getElementById("msg").textContent = `${playerName}, select a level and press Play`;

let wins = 0;
let totalGuesses = 0;
let scores = [];
let startTime = 0;
let roundTimes = [];
let secretNumber = 0;
let currentRange = 0;

// --- Event Listeners ---
document.getElementById("playBtn").addEventListener("click", play);
document.getElementById("guessBtn").addEventListener("click", makeGuess);
document.getElementById("giveUpBtn").addEventListener("click", giveUp);

// Keyboard Support (Enter Key)
document.getElementById("guess").addEventListener("keypress", function(e) {
    if (e.key === "Enter" && !document.getElementById("guessBtn").disabled) {
        makeGuess();
    }
});

function animate(id, className) {
    const el = document.getElementById(id);
    el.classList.remove(className);
    void el.offsetWidth; 
    el.classList.add(className);
}

function play() {
    const levels = document.getElementsByName("level");
    for (let l of levels) { if (l.checked) currentRange = Number(l.value); }

    secretNumber = Math.floor(Math.random() * currentRange) + 1;
    window.attempts = 0;
    startTime = new Date().getTime();

    document.getElementById("msg").textContent = `${playerName}, guess a number between 1 and ${currentRange}!`;
    document.getElementById("guessBtn").disabled = false;
    document.getElementById("giveUpBtn").disabled = false;
    document.getElementById("playBtn").disabled = true;
    document.getElementById("guess").value = "";
    document.getElementById("guess").focus();
}

function makeGuess() {
    const guessInput = document.getElementById("guess");
    const guess = Number(guessInput.value);
    if (!guessInput.value) return;

    window.attempts++;
    const diff = Math.abs(guess - secretNumber);
    const msgEl = document.getElementById("msg");

    if (guess === secretNumber) {
        animate("msg", "animate-pop");
        msgEl.textContent = `${playerName}, correct! You guessed it in ${window.attempts} attempt(s)!`;
        
        wins++;
        totalGuesses += window.attempts;
        scores.push(window.attempts);
        updateStats();
        endRound();
    } else {
        animate("msg", "animate-shake");
        let proximity = diff <= 2 ? "hot" : diff <= 5 ? "warm" : "cold";
        let direction = guess < secretNumber ? "low" : "high";
        msgEl.textContent = `${playerName}, you are ${proximity} and too ${direction}.`;
        guessInput.value = "";
        guessInput.focus();
    }
}

function giveUp() {
    scores.push(currentRange);
    updateStats();
    document.getElementById("msg").textContent = `${playerName}, you gave up! The number was ${secretNumber}.`;
    endRound();
}

function endRound() {
    document.getElementById("guessBtn").disabled = true;
    document.getElementById("giveUpBtn").disabled = true;
    document.getElementById("playBtn").disabled = false;
    updateTimers();
}

function updateStats() {
    document.getElementById("wins").textContent = wins;
    if (wins > 0) {
        document.getElementById("avgScore").textContent = (totalGuesses / wins).toFixed(1);
    }
    
    scores.sort((a, b) => a - b);
    const items = document.getElementsByName("leaderboard");
    for (let i = 0; i < items.length; i++) {
        items[i].textContent = scores[i] !== undefined ? scores[i] : "--";
    }
}

function updateTimers() {
    const elapsed = new Date().getTime() - startTime;
    roundTimes.push(elapsed);
    const fastest = Math.min(...roundTimes) / 1000;
    const avg = (roundTimes.reduce((a, b) => a + b) / roundTimes.length) / 1000;
    document.getElementById("fastest").textContent = fastest.toFixed(2) + "s";
    document.getElementById("avgTime").textContent = avg.toFixed(2) + "s";
}

// Clock logic
setInterval(() => {
    const now = new Date();
    document.getElementById("date").textContent = now.toLocaleString();
}, 1000);