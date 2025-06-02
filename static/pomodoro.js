const currentTask = JSON.parse(localStorage.getItem("currentTask"));
if (currentTask) {
    taskId = currentTask.taskId;
    noPomodoros = parseInt(currentTask.noPomodoros);
    taskName = currentTask.noPomodoros;
}
console.log(taskId, noPomodoros, taskName);

for (let i = 1; i <= noPomodoros; i++) {
    const pomodoroDiv = document.createElement("div")
    pomodoroDiv.className = "pomodoro"
    pomodoroDiv.dataset.index = i
    pomodoroDiv.innerHTML = 
    ` 
            <div class="progress-container">
                <div class="progress-bar"></div>
                <div class="shortBreak-bar"></div>
                <div class="longBreak-bar"></div>
            </div>
            <div class="outfit-regular timer-type">Pomodoro</div>
            <div class="outfit-regular timer-display" style="font-size:20px; color: white">25:00</div>
            <div class="pomodoro-buttons">
                <button class="pomodoro-button editPomodoro">Edit</button>
                <button class="pomodoro-button startStopPomodoro">Start/Stop</button>
                <button class="pomodoro-button resetPomodoro">Reset</button>
            </div>
`;
    
    document.querySelector(".pomodoro-container").append(pomodoroDiv);
}

let activePomodoroInstance = null;
let pomoCount = 1
class PomodoroTimer {
  constructor(containerElement) {
    this.container = containerElement;
    this.progressBar = containerElement.querySelector('.progress-bar');
    this.shortBreakBar = containerElement.querySelector('.shortBreak-bar');
    this.longBreakBar = containerElement.querySelector('.longBreak-bar');
    this.timerDisplay = containerElement.querySelector('#timer-display');
    this.timerType = containerElement.querySelector('#timer-type');

    this.pomodoroTime = 25 * 60;
    this.shortBreakTime = 5 * 60;
    this.longBreakTime = 15 * 60; 

    // Bind buttons
    this.container.querySelector('.startStopPomodoro').addEventListener('click', () => {
        new Audio('/static/button-click.mp3').play();
        this.startStopPomodorofunc()
    });
    this.container.querySelector('.resetPomodoro').addEventListener('click', () => {
        new Audio('/static/button-click.mp3').play();
        this.resetPomodoro()
    });
    this.container.querySelector('.editPomodoro').addEventListener('click', () => {
        new Audio('/static/button-click.mp3').play();
        activePomodoroInstance = this;
        document.getElementById("pomodoroPopup").style.display = "block";
        document.getElementById("popupOverlay").style.display = "block";
        document.getElementById("pomoTime").value = "25";
        document.getElementById("shortBreakTime").value = "5";
        document.getElementById("longBreakTime").value = "15";
    })

    // State
    this.elapsedTime = 0;
    this.duration = this.pomodoroTime;
    this.ispaused = false;
    this.isrunning = false;
    this.isBreak = false;
    this.countdownInterval = null;
    this.startTimeStamp = null;

    this.timerDisplay = containerElement.querySelector('.timer-display');
    this.timerType = containerElement.querySelector('.timer-type');
    
  }

    formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    }

    startStopPomodorofunc() {
        // For first time running task timer
        if (!this.isrunning && !this.ispaused && !this.isBreak && this.elapsedTime === 0) {
            this.duration = this.pomodoroTime;
            this.isrunning = true;
            this.startTimeStamp = Date.now();
            this.progressBar.style.display = "block";
            this.shortBreakBar.style.display = "none";
            this.longBreakBar.style.display = "none";
            this.runTimer();
            alert("Pomodoro is starting")
            return; 
        }

        // For running the break timer
        if (!this.isrunning && !this.ispaused && this.isBreak && this.elapsedTime === 0) {
            this.isrunning = true;
            this.startTimeStamp = Date.now();

            if (pomoCount % 4 !== 0) {
            alert("Short Break Initializing");
            this.progressBar.style.display = "none";
            this.shortBreakBar.style.display = "block";
            this.longBreakBar.style.display = "none";
            this.duration = this.shortBreakTime;
            this.runTimer();
            return;
            }

            else if (pomoCount % 4 === 0) {
            alert("Long Break Initializing");
            this.progressBar.style.display = "none";
            this.shortBreakBar.style.display = "none";
            this.longBreakBar.style.display = "block";
            this.duration = this.longBreakTime;
            this.runTimer();
            return;
            }
        }

        // To pause the timer
        if (!this.ispaused && this.isrunning) {
            this.ispaused = true;
            this.isrunning = false;
            clearInterval(this.countdownInterval);
            this.elapsedTime = Math.floor((Date.now() - this.startTimeStamp) / 1000)
            this.progressBar.style.transition = "none";
            this.progressBar.style.transform = `scaleX(${(this.elapsedTime / this.duration)})`
            this.timerDisplay.textContent = this.formatTime(this.duration - this.elapsedTime);
            alert("Pomodoro is paused")
            return;
        }

        // To resume the timer
        if (!this.isrunning && this.ispaused) {
            this.ispaused = false;
            this.isrunning = true;
            this.startTimeStamp = Date.now() - this.elapsedTime * 1000;
            this.runTimer();
            alert("Pomodoro is resumed")
            return;
        }
    }

    updateUI() {
        const now = Date.now();
        if (this.startTimeStamp && this.isrunning && !this.ispaused) {
            this.elapsedTime = Math.floor((now - this.startTimeStamp) / 1000);
        }
        this.remainingTime = Math.max(0, Math.floor(this.duration - this.elapsedTime));
        this.timerDisplay.textContent = this.formatTime(this.remainingTime);

        const percent = Math.min(this.elapsedTime / this.duration, 1);

        if (!this.isBreak) {
            this.progressBar.style.transform = `scaleX(${percent})`;
            this.progressBar.style.transition = "transform 1s linear";
            this.timerType.textContent = "Pomodoro";
        } else {
            if (pomoCount % 4 === 0) {
                this.longBreakBar.style.transform = `scaleX(${percent})`;
                this.longBreakBar.style.transition = "transform 1s linear";
                this.timerType.textContent = "Long Break";

            } if (pomoCount % 4 !== 0) {
                this.shortBreakBar.style.transform = `scaleX(${percent})`;
                this.shortBreakBar.style.transition = "transform 1s linear";
                this.timerType.textContent = "Short Break";
            }
        }
    }

    runTimer() {
        clearInterval(this.countdownInterval);

        this.updateUI(); // Show initial state before ticking

        this.countdownInterval = setInterval(() => {
            if (this.ispaused || !this.isrunning) return;

            this.updateUI();  
            
            if (this.elapsedTime >= this.duration && !this.isBreak) {
                    this.isBreak = true;
                    this.ispaused = false
                    this.isrunning = false;
                    this.elapsedTime = 0;

                    clearInterval(this.countdownInterval); 
                    this.progressBar.style.transform = "scaleX(1)";
                    this.progressBar.style.transition = "transform 1s linear";

                    setTimeout(() => {
                        new Audio('/static/yay.mp3').play();
                        triggerConfetti();
                        // Reset UI
                        this.progressBar.style.display = "none";
                        this.shortBreakBar.style.display = "none";
                        this.longBreakBar.style.display = "none";
                        this.updateUI();
                    }, 1000);
            } 
            else if (this.elapsedTime >= this.duration && this.isBreak) {
                this.isrunning = false;
                this.isBreak = false;
                this.ispaused = false;
                this.elapsedTime = 0;
                this.duration = 0;
                pomoCount ++;
                console.log(pomoCount)
                this.timerType.textContent = "Pomdoro Completed"
                clearInterval(this.countdownInterval); 
                const pomodoroWrapper = document.querySelector(`[data-index="${pomoCount - 1}"]`);
                pomodoroWrapper.classList.add("fade-out"); // its automatically triggered the fading operation 
                updatePomodoroIndex();
                new Audio("/static/timer ring.wav").play();
                setTimeout(() => {
                    // Reset UI
                    this.progressBar.style.display = "none";
                    this.shortBreakBar.style.display = "none";
                    this.longBreakBar.style.display = "none";
                    pomodoroWrapper.remove(); 

                    this.updateUI();
                }, 1000);
                this.updateUI();

                if ((pomoCount - 1) === noPomodoros && !document.getElementById("completionMessage")) {
                    triggerMessage();
                }
                }
        }, 1000);
        this.updateUI();
    }
    resetPomodoro() {
        this.isrunning = false;
        this.progressBar.style.transition = "none";
        this.progressBar.style.transform = "scaleX(0)";
        this.elapsedTime = 0;
        
        // trigger reflow
        this.progressBar.offsetWidth; 
        this.displayTime = this.formatTime(this.pomodoroTime);
        this.timerDisplay.textContent = this.displayTime;
        alert("Pomodoro timer resetted")
    } 
  }

const pomodoroDivs = document.querySelectorAll(".pomodoro");
pomodoroDivs.forEach((el) => {
    new PomodoroTimer(el);
})

// Initializing pomodoro index
    function updatePomodoroIndex() {
        const pomodoros = document.querySelectorAll("[data-index]")
        console.log("noPomodoros =", noPomodoros);
        console.log("Pomodoro Div =", pomodoros);

        pomodoros.forEach((pomo) => {
            index = parseInt(pomo.dataset.index, 10);
            buttonDiv = pomo.querySelector(".pomodoro-buttons, .pomodoro-buttons-inactive");

            console.log(`Checking pomo with index=${pomo.dataset.index}`);
            console.log("Pomodoro Div ClassList before:", pomo.classList);
            console.log("Buttons Div ClassList before:", buttonDiv.classList);

            if (index !== pomoCount) {
                pomo.classList.add("pomodoro-inactive");
                pomo.classList.remove("pomodoro");
                buttonDiv.classList.add("pomodoro-buttons-inactive");
                buttonDiv.classList.remove("pomodoro-buttons");
            }
            
            else if (index === pomoCount) {
                pomo.classList.add("pomodoro");
                pomo.classList.remove("pomodoro-inactive");
                buttonDiv.classList.add("pomodoro-buttons");
                buttonDiv.classList.remove("pomodoro-buttons-inactive");
            }
            console.log("Pomodoro Div ClassList after:", pomo.classList);
            console.log("Buttons Div ClassList after:", buttonDiv.classList);
            console.log("Pomodoro Index: ",pomoCount)
        });
    }
updatePomodoroIndex();

//Implementing operation to open and close popups and buttons in popups

const editPomoBtn = document.getElementById('editPomodoroSettings');
editPomoBtn.addEventListener('click', (event) => {

    event.preventDefault();

    const pomoMin = parseInt(document.getElementById('pomoTime').value, 10);
    const shortBreakMin = parseInt(document.getElementById('shortBreakTime').value, 10);
    const longBreakMin = parseInt(document.getElementById('longBreakTime').value, 10);

    if (activePomodoroInstance) {
            clearInterval(activePomodoroInstance.countdownInterval);
        activePomodoroInstance.progressBar.style.transition = "none";
        activePomodoroInstance.progressBar.style.transform = "scaleX(0)";
        activePomodoroInstance.isrunning = false;
        activePomodoroInstance.elapsedTime = 0;
        
        activePomodoroInstance.pomodoroTime = pomoMin * 60;
        activePomodoroInstance.shortBreakTime = shortBreakMin * 60;
        activePomodoroInstance.longBreakTime = longBreakMin * 60;

        activePomodoroInstance.duration = activePomodoroInstance.pomodoroTime;
        activePomodoroInstance.timerDisplay.textContent = 
            activePomodoroInstance.formatTime(activePomodoroInstance.pomodoroTime);
    }

    if (isNaN(pomoMin) || isNaN(shortBreakMin) || isNaN(longBreakMin)) {
        alert("Please enter valid numbers for all times.");
        return;
    }

    if (activePomodoroInstance) {
        // Pause and reset current instance
        clearInterval(activePomodoroInstance.countdownInterval);
        activePomodoroInstance.isrunning = false;
        activePomodoroInstance.ispaused = false;
        activePomodoroInstance.elapsedTime = 0;

        // Reset progress bars
        activePomodoroInstance.progressBar.style.transition = "none";
        activePomodoroInstance.progressBar.style.transform = "scaleX(0)";
        activePomodoroInstance.shortBreakBar.style.transition = "none";
        activePomodoroInstance.shortBreakBar.style.transform = "scaleX(0)";
        activePomodoroInstance.longBreakBar.style.transition = "none";
        activePomodoroInstance.longBreakBar.style.transform = "scaleX(0)";

        // Update times
        activePomodoroInstance.pomodoroTime = pomoMin * 60;
        activePomodoroInstance.shortBreakTime = shortBreakMin * 60;
        activePomodoroInstance.longBreakTime = longBreakMin * 60;

        activePomodoroInstance.duration = activePomodoroInstance.pomodoroTime;
        activePomodoroInstance.timerDisplay.textContent =
            activePomodoroInstance.formatTime(activePomodoroInstance.pomodoroTime);
    }
    closeTaskPopup();
})

removePopup = document.getElementById('closeTaskPopup')

function closeTaskPopup() {
  document.getElementById("pomodoroPopup").style.display = "none";
  document.getElementById("popupOverlay").style.display = "none";
}

removePopup.addEventListener('click', closeTaskPopup)

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

function triggerMessage() {
    const messageDiv = document.createElement("div");
    messageDiv.className = "outfit-regular";
    messageDiv.innerHTML = "Task Completed!";
    messageDiv.id = "completionMessage";
    messageDiv.style.color = "white";
    messageDiv.style.fontSize = "24px";
    messageDiv.style.textAlign = "center";
    messageDiv.style.marginTop = "20px";
    document.querySelector(".pomodoro-container").prepend(messageDiv);
}

// Create back button and its functionalities
const backButton = document.createElement("button");
backButton.className = "pomodoro-button";
backButton.innerHTML = "back";
backButton.style.alignSelf = "center"; 
backButton.style.flex = "0 0 auto";        // Don't grow or shrink, keep natural size
document.querySelector(".pomodoro-container").append(backButton);

backButton.addEventListener("click", () => {
    remainingPomodoro = Math.max(0, noPomodoros - pomoCount); // Result clamped to 0
        if (remainingPomodoro > 0) {
        localStorage.setItem("currentTask", JSON.stringify({
            taskName,
            remainingPomodoro,
            taskId
        }));
    }
    window.location.href = "/task-tracker";
})