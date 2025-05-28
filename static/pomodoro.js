//Implementing operation to open popup

editButton = document.getElementById('editPomodoro');
removePopup = document.getElementById('closeTaskPopup')

editButton.addEventListener("click", () => {
    // Show the popup
    new Audio('/static/button-click.mp3').play();
    document.getElementById("pomodoroPopup").style.display = "block";
    document.getElementById("popupOverlay").style.display = "block";
})

function closeTaskPopup() {
  document.getElementById("pomodoroPopup").style.display = "none";
  document.getElementById("popupOverlay").style.display = "none";
}

removePopup.addEventListener('click', closeTaskPopup)

// Executing pomodoro workflow

let pomodoroTime = 25 * 60;
let shortBreakTime = 5 * 60;
let longBreakTime = 15 * 60; 
let progressBar = document.querySelector('.progress-bar');
let shortBreakBar = document.querySelector('.shortBreak-bar');
let longBreakBar = document.querySelector('.longBreak-bar');
let timerDisplay = document.getElementById('timer-display')
let startTime = 0;
let elapsedTime = 0;
let ispaused = false;
let isrunning = false;
let countdownInterval;
let pomoCount = 1;
let isBreak = false;

const editPomoBtn = document.getElementById('editPomodoroSettings');
editPomoBtn.addEventListener('click', (event) => {

    event.preventDefault();
    clearInterval(countdownInterval);
    progressBar.style.transition = "none";
    progressBar.style.transform = "scaleX(0)";
    isrunning = false;
    elapsedTime = 0;

    const pomoMin = parseInt(document.getElementById('pomoTime').value, 10);
    const shortBreakMin = parseInt(document.getElementById('shortBreakTime').value, 10);
    const longBreakMin = parseInt(document.getElementById('longBreakTime').value, 10);

    if (isNaN(pomoMin) || isNaN(shortBreakMin) || isNaN(longBreakMin)) {
        alert("Please enter valid numbers for all times.");
        return;
    }

    pomodoroTime = pomoMin * 60;
    shortBreakTime = shortBreakMin * 60;
    longBreakTime = longBreakMin * 60;
    duration = pomodoroTime;
    timerDisplay.textContent = formatTime(pomodoroTime);
    closeTaskPopup();
    return pomodoroTime, shortBreakTime, longBreakTime;
})

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function startStopPomodorofunc() {
    // For first time running task timer
    if (!isrunning && !ispaused && !isBreak && elapsedTime === 0) {
        duration = pomodoroTime;
        isrunning = true;
        progressBar.style.display = "block";
        shortBreakBar.style.display = "none";
        longBreakBar.style.display = "none";
        console.log(progressBar)
        runTimer();
        alert("Pomodoro is starting")
        return; 
    }
    console.log("Checking break start condition", {
    isrunning, ispaused, isBreak, elapsedTime, pomoCount
    });
    // For running the break timer
    if (!isrunning && !ispaused && isBreak && elapsedTime === 0) {
        isrunning = true;
        if (pomoCount % 4 !== 0) {
        alert("Short Break Initializing");
        progressBar.style.display = "none";
        shortBreakBar.style.display = "block";
        longBreakBar.style.display = "none";
        duration = shortBreakTime;
        console.log(isBreak, ispaused, isrunning, elapsedTime, pomoCount, 1%4);
        runTimer();
        return;
        }

        else if (pomoCount % 4 === 0) {
        alert("Long Break Initializing");
        progressBar.style.display = "none";
        shortBreakBar.style.display = "none";
        longBreakBar.style.display = "block";
        duration = longBreakTime;
        runTimer();
        return;
        }
    }

    // To pause the timer
    if (!ispaused && isrunning) {
        console.log("PAUSING TRIGGERED")
        ispaused = true;
        isrunning = false;
        clearInterval(countdownInterval);
        progressBar.style.transition = "none";
        progressBar.style.transform = `scaleX(${(elapsedTime / duration)})`
        timerDisplay.textContent = formatTime(duration - elapsedTime);
        alert("Pomodoro is paused")
        return;
    }

    // To resume the timer
    if (!isrunning && ispaused) {
        ispaused = false;
        isrunning = true;
        runTimer();
        alert("Pomodoro is resumed")
        return;
    }
}

function updateUI() {
    remainingTime = duration - elapsedTime;
    timerDisplay.textContent = formatTime(remainingTime);
    const percent = (elapsedTime / duration);

    if (!isBreak) {
        progressBar.style.transform = `scaleX(${percent})`;
        progressBar.style.transition = "transform 1s linear";
        document.getElementById("timer-type").textContent = "Pomodoro";
    } else {
        if (pomoCount % 4 === 0) {
            longBreakBar.style.transform = `scaleX(${percent})`;
            longBreakBar.style.transition = "transform 1s linear";
            document.getElementById("timer-type").textContent = "Long Break";
        } if (pomoCount % 4 !== 0) {
            shortBreakBar.style.transform = `scaleX(${percent})`;
            shortBreakBar.style.transition = "transform 1s linear";
            document.getElementById("timer-type").textContent = "Short Break";
        }
    }
}

function runTimer() {
    clearInterval(countdownInterval);

    updateUI(); // Show initial state before ticking

    countdownInterval = setInterval(() => {
        if (!ispaused && isrunning && !isBreak) {
            duration = pomodoroTime
            elapsedTime++;
            updateUI();
        }

        if (!ispaused && isrunning && isBreak && pomoCount % 4 !== 0) {
            duration = shortBreakTime
            elapsedTime++;
            updateUI();
        }

        if (!ispaused && isrunning && isBreak && pomoCount % 4 === 0) {
            duration = longBreakTime
            elapsedTime++;
            updateUI();
        }
        if (elapsedTime >= duration && isBreak) {
            isrunning = false;
            clearInterval(countdownInterval);
            isBreak = false;     
            ispaused = false;
            elapsedTime = 0;
            updateUI();
        }

        // End of timer for both pomodoro 
        if (elapsedTime >= duration && !isBreak) {
            isrunning = false;
            clearInterval(countdownInterval); 
                progressBar.style.transform = "scaleX(1)";
                progressBar.style.transition = "transform 1s linear";

                setTimeout(() => {
                    new Audio('/static/yay.mp3').play();
                    pomoCount++;
                    triggerConfetti();
                    isBreak = true;
                    ispaused = false
                    isrunning = false;
                    elapsedTime = 0;

                    // Reset UI
                    progressBar.style.display = "none";
                    shortBreakBar.style.display = "none";
                    longBreakBar.style.display = "none";
                    updateUI();
                }, 1000);
        }
    }, 1000);
}

document.getElementById("resetPomodoro").addEventListener("click", () => {
    new Audio('/static/button-click.mp3').play();
    isrunning = false;
    progressBar.style.transition = "none";
    progressBar.style.width = 0;
    elapsedTime = 0;
    
    // trigger reflow
    progressBar.offsetWidth; 
    displayTime = formatTime(pomodoroTime);
    timerDisplay.textContent = displayTime;
    alert("Pomodoro timer resetted")
})

startStopPomodoro = document.getElementById('startStopPomodoro');
startStopPomodoro.addEventListener('click', () => {
    new Audio('/static/button-click.mp3').play();
    startStopPomodorofunc();
});

function triggerConfetti() {
    // 🎉 Confetti time!
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
    };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}