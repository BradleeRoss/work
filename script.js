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
const switchSound = document.getElementById('switch-sound');
const colorPicker = document.getElementById('bg-color');

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
  const color = modes[mode].color;
  document.body.style.backgroundColor = color;
  colorPicker.value = color;

  switchSound.currentTime = 0;
  switchSound.play().catch(() => {});

  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtnId = mode === 'work' ? 'work-btn' : mode === 'shortBreak' ? 'short-break-btn' : 'long-break-btn';
  document.getElementById(activeBtnId).classList.add('active');

  resetTimer();
}

function changeColor(newColor) {
  document.body.style.backgroundColor = newColor;
  modes[currentMode].color = newColor;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

async function togglePip() {
  if ('documentPictureInPicture' in window) {
    if (window.documentPictureInPicture.window) {
      window.documentPictureInPicture.window.close();
      return;
    }
    const app = document.getElementById('pomodoro-app');
    const pipWindow = await window.documentPictureInPicture.requestWindow({
      width: 380,
      height: 380
    });

    [...document.styleSheets].forEach((styleSheet) => {
      try {
        const cssRules = [...styleSheet.cssRules].map((rule) => rule.cssText).join('');
        const style = document.createElement('style');
        style.textContent = cssRules;
        pipWindow.document.head.appendChild(style);
      } catch (e) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = styleSheet.href;
        pipWindow.document.head.appendChild(link);
      }
    });

    pipWindow.document.body.style.backgroundColor = getComputedStyle(document.body).backgroundColor;
    pipWindow.document.body.appendChild(app);

    pipWindow.addEventListener('pagehide', () => {
      document.body.appendChild(app);
    });
  } else {
    alert('Picture-in-Picture for HTML components is supported in Chrome or Edge.');
  }
}

updateDisplay();
