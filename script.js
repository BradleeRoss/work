let timer;
let minutes = 25;
let seconds = 0;
let isRunning = false;
let currentMode = 'work';

const modes = {
  work: { time: 25, color: '#ba4949' },
  shortBreak: { time: 5, color: '#388e3c' },
  longBreak: { time: 15, color: '#1976d2' }
};

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const alarmSound = document.getElementById('alarm-sound');

function updateDisplay() {
  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');
  timerDisplay.textContent = `${m}:${s}`;
  document.title = `${m}:${s} - Pomodoro`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  timer = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(timer);
        alarmSound.play();
        alert('Time is up!');
        resetTimer();
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }
    updateDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

function resetTimer() {
  pauseTimer();
  minutes = modes[currentMode].time;
  seconds = 0;
  updateDisplay();
}

function setMode(mode) {
  currentMode = mode;
  document.body.style.backgroundColor = modes[mode].color;
  
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`${mode.replace(/([A-Z])/g, '-$1').toLowerCase()}-btn`).classList.add('active');

  resetTimer();
}

// Initial setup
updateDisplay();
