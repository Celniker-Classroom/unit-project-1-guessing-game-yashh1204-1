<!DOCTYPE html>
<html>
  <head>
    <title>JavaScript Number Guessing Game</title>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      :root {
        --bg-color: #4a4a4a; --card-bg: #333333; --section-bg: #bcbcbc;
        --text-color: #ffffff; --label-color: #444; --input-bg: #f0f0f0; --accent: #222;
      }
      body.light-mode {
        --bg-color: #e0e0e0; --card-bg: #f5f5f5; --section-bg: #d0d0d0;
        --text-color: #222222; --label-color: #333; --input-bg: #ffffff; --accent: #555;
      }
      body {
        min-height: 100vh; background-color: var(--bg-color);
        display: flex; justify-content: center; align-items: flex-start;
        padding: 40px 20px; font-family: 'DM Mono', monospace; transition: background-color 0.3s ease;
      }
      .card {
        width: 100%; max-width: 480px; background-color: var(--card-bg);
        border-radius: 24px; padding: 24px; display: flex; flex-direction: column; gap: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.4);
      }
      #themeToggle { align-self: flex-end; background: #555; border: none; color: white; padding: 6px 14px; border-radius: 20px; font-size: 0.7rem; cursor: pointer; }
      body.light-mode #themeToggle { background: #bbb; color: #222; }
      .title { font-family: 'Bebas Neue', sans-serif; font-size: 2.8rem; color: var(--text-color); text-align: center; letter-spacing: 2px; }
      .section-box { background-color: var(--section-bg); border-radius: 20px; padding: 18px; display: flex; flex-direction: column; gap: 12px; color: #222; }
      .section-label { font-family: 'Bebas Neue', sans-serif; font-size: 1.2rem; color: var(--label-color); text-transform: uppercase; }
      .difficulty-row { display: flex; gap: 10px; }
      .difficulty-row input { display: none; }
      .difficulty-row label { flex: 1; text-align: center; padding: 12px 0; background: rgba(255,255,255,0.4); border-radius: 10px; cursor: pointer; font-weight: 500; }
      .difficulty-row input:checked + label { background: var(--accent); color: white; }
      #playBtn { background: var(--accent); color: white; font-family: 'Bebas Neue', sans-serif; font-size: 1.3rem; padding: 12px; border: none; border-radius: 12px; cursor: pointer; }
      #msg { font-size: 1.6rem; font-weight: 600; min-height: 100px; display: flex; align-items: center; }
      #guess { width: 100%; padding: 16px; border-radius: 12px; border: none; font-size: 1.4rem; background: var(--input-bg); outline: none; }
      .action-row { display: flex; gap: 10px; }
      #guessBtn, #giveUpBtn { flex: 1; padding: 18px; font-family: 'Bebas Neue', sans-serif; font-size: 1.5rem; border: none; border-radius: 12px; cursor: pointer; color: white; }
      #guessBtn { background: #888; flex: 2; }
      #giveUpBtn { background: #aaa; }
      #playBtn:disabled, #guessBtn:disabled, #giveUpBtn:disabled { opacity: 0.4; cursor: not-allowed; }
      .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .stat-item { background: rgba(255,255,255,0.3); padding: 10px 14px; border-radius: 12px; }
      .stat-item label { display: block; font-size: 0.6rem; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; }
      .leader-slot { background: rgba(255,255,255,0.3); padding: 10px 20px; border-radius: 25px; margin-top: 8px; font-size: 0.9rem; list-style: none; }
    </style>
  </head>
  <body>
    <div class="card">
      <button id="themeToggle">☀️ Light Mode</button>
      <p id="date"></p>
      <div class="title">GUESS THE NUMBER</div>

      <div class="section-box">
        <span class="section-label">Difficulty</span>
        <div class="difficulty-row">
          <input type="radio" name="level" id="e" value="3" checked>
          <label for="e">Easy (1-3)</label>
          <input type="radio" name="level" id="m" value="10">
          <label for="m">Medium (1-10)</label>
          <input type="radio" name="level" id="h" value="100">
          <label for="h">Hard (1-100)</label>
        </div>
      </div>

      <button id="playBtn">▶ PLAY</button>

      <div class="section-box">
        <h3 id="msg"></h3>
        <input type="number" id="guess" placeholder="Enter your guess...">
        <div class="action-row">
          <button id="guessBtn" disabled>GUESS</button>
          <button id="giveUpBtn" disabled>GIVE UP</button>
        </div>
      </div>

      <div class="section-box">
        <span class="section-label">Stats</span>
        <div class="stats-grid">
          <div class="stat-item"><label>Wins</label><span id="wins">0</span></div>
          <div class="stat-item"><label>Avg Score</label><span id="avgScore">—</span></div>
          <div class="stat-item"><label>Fastest</label><span id="fastest">—</span></div>
          <div class="stat-item"><label>Avg Time</label><span id="avgTime">—</span></div>
        </div>
        <span class="section-label" style="margin-top: 15px;">Leaderboard</span>
        <ol>
          <li class="leader-slot" name="leaderboard">--</li>
          <li class="leader-slot" name="leaderboard">--</li>
          <li class="leader-slot" name="leaderboard">--</li>
        </ol>
      </div>
    </div>

    <script>
      // 1. SETUP NAME (Rubric #6)
      let nameInput = prompt("What is your name?") || "Player";
      const playerName = nameInput.charAt(0).toUpperCase() + nameInput.slice(1).toLowerCase();

      // Variables
      let answer = 0;
      let range = 0;
      let attempts = 0;
      let wins = 0;
      let totalGamesPlayed = 0; // Tracks both wins and give ups for leaderboard/avg
      let totalGuesses = 0;
      let scoresArray = [];
      let startTime = 0;
      let roundTimes = [];

      document.getElementById("msg").textContent = `${playerName}, select a level and press Play.`;

      // 2. EVENT LISTENERS (Rubric #2)
      document.getElementById("playBtn").addEventListener("click", play);
      document.getElementById("guessBtn").addEventListener("click", makeGuess);
      document.getElementById("giveUpBtn").addEventListener("click", giveUp);
      document.getElementById("themeToggle").addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        document.getElementById("themeToggle").textContent = document.body.classList.contains("light-mode") ? "🌙 Dark Mode" : "☀️ Light Mode";
      });

      // 3. RUBRIC FUNCTIONS

      function time() { // Rubric #10 & #11
        const now = new Date();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const day = now.getDate();
        
        let suffix = "th";
        if (day < 11 || day > 13) {
          if (day % 10 === 1) suffix = "st";
          else if (day % 10 === 2) suffix = "nd";
          else if (day % 10 === 3) suffix = "rd";
        }

        // Live time with seconds
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        
        return `${months[now.getMonth()]} ${day}${suffix}, ${now.getFullYear()} — ${h}:${m}:${s}`;
      }

      function play() { // Rubric #3
        const levels = document.getElementsByName("level");
        for (let l of levels) {
          if (l.checked) range = Number(l.value);
          l.disabled = true;
        }
        
        answer = Math.floor(Math.random() * range) + 1;
        attempts = 0;
        startTime = new Date().getTime(); // Start timer (Rubric #12)

        document.getElementById("msg").textContent = `${playerName}, I'm thinking of a number 1-${range}.`;
        document.getElementById("guessBtn").disabled = false;
        document.getElementById("giveUpBtn").disabled = false;
        document.getElementById("playBtn").disabled = true;
        document.getElementById("guess").value = "";
        document.getElementById("guess").focus();
      }

      function makeGuess() { // Rubric #4 & #5
        const input = document.getElementById("guess");
        const guess = Number(input.value);
        if (!input.value) return;

        attempts++;
        const diff = Math.abs(guess - answer);
        const msg = document.getElementById("msg");

        if (guess === answer) {
          msg.textContent = `${playerName}, that is correct! It took ${attempts} guesses.`;
          wins++;
          totalGuesses += attempts;
          updateScore(attempts);
          updateTimers(new Date().getTime());
          reset();
        } else {
          let proximity = diff <= 2 ? "hot" : diff <= 5 ? "warm" : "cold";
          let direction = guess < answer ? "low" : "high";
          msg.textContent = `${playerName}, you are ${proximity} and too ${direction}.`;
          input.value = "";
          input.focus();
        }
      }

      function giveUp() { // Rubric #9
        document.getElementById("msg").textContent = `${playerName}, you gave up! The answer was ${answer}.`;
        // Give up sets score to range value
        updateScore(range); 
        updateTimers(new Date().getTime());
        reset();
      }

      function updateScore(score) { // Rubric #7 & #8
        scoresArray.push(score);
        scoresArray.sort((a, b) => a - b);
        totalGamesPlayed++;

        document.getElementById("wins").textContent = wins;
        
        // Calculate average guesses per win per rubric #7
        if (wins > 0) {
            document.getElementById("avgScore").textContent = (totalGuesses / wins).toFixed(1);
        }

        // Leaderboard (Top 3)
        const li = document.getElementsByName("leaderboard");
        for (let i = 0; i < li.length; i++) {
          li[i].textContent = scoresArray[i] !== undefined ? scoresArray[i] : "--";
        }
      }

      function updateTimers(endMs) { // Rubric #12
        const elapsed = endMs - startTime;
        roundTimes.push(elapsed);
        
        const fastest = Math.min(...roundTimes) / 1000;
        const avg = (roundTimes.reduce((a, b) => a + b) / roundTimes.length) / 1000;
        
        // Ensure elements contain just the numbers as strings
        document.getElementById("fastest").textContent = fastest.toFixed(2);
        document.getElementById("avgTime").textContent = avg.toFixed(2);
      }

      function reset() {
        document.getElementById("guessBtn").disabled = true;
        document.getElementById("giveUpBtn").disabled = true;
        document.getElementById("playBtn").disabled = false;
        const levels = document.getElementsByName("level");
        for (let l of levels) l.disabled = false;
      }

      // Live update (Rubric #11)
      setInterval(() => {
        document.getElementById("date").textContent = time();
      }, 1000);
      document.getElementById("date").textContent = time();
    </script>
  </body>
</html>