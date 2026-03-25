let gameSeq = [];
let userSeq = [];

let btns = ["red", "green", "yellow", "blue"];

let started = false;
let level = 0;
let difficulty = "easy";
let practiceMode = false;

// High Score (LocalStorage)
let highScore = localStorage.getItem("highScore") || 0;

let h2 = document.querySelector("h2");
let h3 = document.querySelector("#highScore");
h3.innerText = `High Score: ${highScore}`;

//timer 
let time = 0;
let timerInterval;

function startTimer() {
    clearInterval(timerInterval);
    time = 0;

    timerInterval = setInterval(() => {
        time++;
        document.querySelector("#timer").innerHTML = `Time: ${time}s`;
    }, 1000);
}

//accuracy
let correct = 0;
let wrong = 0;

function UpdateAccuracy() {
    let total = correct + wrong;
    let acc = total === 0 ? 100 : Math.floor((correct/total)*100);
    document.querySelector("#accuracy").innerHTML = `Accuracy: ${acc}%`;
}

// Start Game
document.querySelector("#start-btn").addEventListener("click", () => {
    if (!started) {
        started = true;
        correct = 0;
        wrong = 0;
        UpdateAccuracy();
        levelUp();
    }
});

// Difficulty
document.querySelector("#difficulty").addEventListener("change", function () {
    difficulty = this.value;
});

//practice mode
document.querySelector("#practice").addEventListener("change", function() {
    practiceMode = this.checked;
});

//  Dark Mode
document.querySelector("#mode-btn").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

// Sound
function playSound(color) {
    let audio = new Audio(`sounds/${color}.mp3`);
    audio.play();
}

// Flash
function gameFlash(btn) {
    btn.classList.add("flash");
    playSound(btn.id);

    setTimeout(() => {
        btn.classList.remove("flash");
    }, 200);
}

function userFlash(btn) {
    btn.classList.add("userflash");
    playSound(btn.id);

    setTimeout(() => {
        btn.classList.remove("userflash");
    }, 200);
}

// Speed Control
function getSpeed() {
    if (difficulty === "easy") return 600;
    if (difficulty === "medium") return 400;
    if (difficulty === "hard") return 250;
}

// Play Full Sequence
function playSequence() {
    let i = 0;

    let interval = setInterval(() => {
        let color = gameSeq[i];
        let btn = document.querySelector(`.${color}`);
        gameFlash(btn);

        i++;
        if (i >= gameSeq.length) {
            clearInterval(interval);
        }
    }, getSpeed());
}

// Level Up
function levelUp() {
    userSeq = [];
    level++;

    h2.innerText = `Level ${level}`;

    startTimer();

    let randIdx = Math.floor(Math.random() * 4);
    let randColor = btns[randIdx];

    gameSeq.push(randColor);

    setTimeout(playSequence, 300);
}

function gameOverSound() {
    let audio = new Audio("sounds/wrong.mp3");
    audio.play();
}

//Check Answer
function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        correct++;
        UpdateAccuracy();

        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 800);
        }

    } else {
        // Game Over
        wrong++;
        UpdateAccuracy();
        
        gameOverSound();

        if(!practiceMode){
            
        document.body.classList.add("game-over");

        setTimeout(() => {
            document.body.classList.remove("game-over");
        }, 200);

        //Update High Score
        if (level > highScore) {
            highScore = level;
            localStorage.setItem("highScore", highScore);
            h3.innerText = `High Score: ${highScore}`;
        }

        h2.innerHTML = `Game Over! Score: <b>${level}</b>`;
        reset();
    }else {
        userSeq = []; // retry in practice mode
    }
  }
}

// Button Press
function btnPress() {
    let btn = this;
    userFlash(btn);

    let userColor = btn.id;
    userSeq.push(userColor);

    checkAns(userSeq.length - 1);
}

// Event Listeners
let allBtns = document.querySelectorAll(".btn");

for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

// Reset the game
function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
}