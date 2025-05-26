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
let countdownInterval;

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function startPomodoro(duration) {
    let timeLeft = duration;
    timerDisplay.textContent = formatTime(timeLeft);
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = formatTime(timeLeft);
    }, 1000);

    // Reset to 0%
    progressBar.style.transition = "none";
    progressBar.style.width = "0%";

    // Force a reflow to apply the 0% immediately
    progressBar.offsetWidth; // trigger reflow

    // Now apply transition and animate to 100%
    progressBar.style.transition = `width ${duration}s ease`;
    progressBar.style.width = "100%";


}

startStopPomodoro = document.getElementById('startStopPomodoro');
startStopPomodoro.addEventListener('click', () => {
    startPomodoro(pomodoroTime)});
