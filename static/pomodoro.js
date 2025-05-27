//Implementing operation to open popup

editButton = document.getElementById('editPomodoro');
removePopup = document.getElementById('closeTaskPopup')

editButton.addEventListener("click", () => {
    // Show the popup
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
let timerDisplay = document.getElementById('timer-display')
let startTime = 0;
let elapsedTime = 0;
let ispaused = false;
let isrunning = false;
let countdownInterval;
let clickSound = new Audio('/static/button-click.mp3');

const editPomoBtn = document.getElementById('editPomodoroSettings');
editPomoBtn.addEventListener('click', (event) => {

    event.preventDefault();
    clearInterval(countdownInterval);
    progressBar.style.transition = "none";
    progressBar.style.width = 0;
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
    if (!isrunning && !ispaused && elapsedTime === 0) {
        duration = pomodoroTime;
        isrunning = true;
        runTimer();
        alert("Pomodoro is starting")
        return; 
    }

    if (!ispaused && isrunning) {
        ispaused = true;
        isrunning = false;
        clearInterval(countdownInterval);
        progressBar.style.transition = "none";
        progressBar.style.width = `${(elapsedTime / duration) * 100}%`
        timerDisplay.textContent = formatTime(duration - elapsedTime);
        alert("Pomodoro is paused")
        return;
    }
    if (!isrunning && ispaused) {
        ispaused = false;
        isrunning = true;
        runTimer();
        alert("Pomodoro is resumed")
        return;
    }
}

function runTimer() {
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        if (!ispaused && isrunning) {
            elapsedTime++;
            remainingTime = duration - elapsedTime;
            timerDisplay.textContent = formatTime(remainingTime);

            const percent = (elapsedTime / duration) * 100;
            progressBar.style.width = `${percent}%`;
        }
        if (elapsedTime >= duration) {
            isrunning = false;
            clearInterval(countdownInterval); // stop timer when done

            // audio
            const audio = new Audio('/static/yay.mp3');
            audio.play();
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
    }, 1000);
}

document.getElementById("resetPomodoro").addEventListener("click", () => {
    clickSound.play();
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
    clickSound.play();
    startStopPomodorofunc();
});
