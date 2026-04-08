let rawName = prompt("What is your name?");
const promptGuess = document.getElementById("msg");
let playerName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
const userGuess = document.getElementById("guess").value;
document.getElementById("playBtn").addEventListener("click", play);
document.getElementById("guessBtn").addEventListener("click", makeGuess);
document.getElementById("giveUpBtn").addEventListener("click", giveUp);

function play() {
promptGuess.textContent = "Hello " + playerName + "! I am thinking of a number between 1 and 100. Can you guess it?";
document.getElementById("guessBtn").disabled = false;
document.getElementById("giveUpBtn").disabled = false;
document.getElementById("playBtn").disabled = true;
window.secretNumber = Math.floor(Math.random() * 100) + 1;
window.attempts = 0;
}
function makeGuess() {
const guessNumber = Number(document.getElementById("guess").value);
if(guessNumber < window.secretNumber) {
    promptGuess.textContent = "Too low! Try again.";
}
else if(guessNumber > window.secretNumber) {
    promptGuess.textContent = "Too high! Try again.";
}
else {
    promptGuess.textContent = "Congratulations " + playerName + "! You've guessed the number in " + window.attempts + " attempts!";
    document.getElementById("guessBtn").disabled = true;
    document.getElementById("giveUpBtn").disabled = true;
    document.getElementById("playBtn").disabled = false;
}
}