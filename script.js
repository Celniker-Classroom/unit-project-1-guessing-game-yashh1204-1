let rawName = prompt("What is your name?");
let guessDistance = "";
let guessTemp = "";
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
window.attempts ++
const guessNumber = Number(document.getElementById("guess").value);
if(guessNumber < window.secretNumber) {
    guessDistance = "too low";
}
else if(guessNumber > window.secretNumber) {
    guessDistance = "too high";
}
else {
    guessDistance = "Correct! You've guessed the number in " + window.attempts + " attempts!";
    document.getElementById("guessBtn").disabled = true;
    document.getElementById("giveUpBtn").disabled = true;
    document.getElementById("playBtn").disabled = false;
}
if (Math.abs(guessNumber - window.secretNumber) <= 2 && Math.abs(guessNumber - window.secretNumber) > 0){
    guessTemp = "hot and ";
} else if(Math.abs(guessNumber - window.secretNumber) <= 5 && (Math.abs(guessNumber - window.secretNumber) > 0)){
    guessTemp = "warm and ";
}else if(Math.abs(guessNumber - window.secretNumber) > 5){
    guessTemp = "cold and ";
    
} else{
 guessTemp = ""
}
document.getElementById("msg").textContent = playerName + " your guess was " + guessTemp + guessDistance;
}