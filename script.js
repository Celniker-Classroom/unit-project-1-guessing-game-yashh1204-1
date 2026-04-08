let rawName = prompt("What is your name?");
const promptGuess = document.getElementById("msg");let playerName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
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