const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;
const STORAGE_KEY = "pomodoro.sessions";

const state = {
  mode: "work",
  remaining: WORK_SECONDS,
  running: false,
  endTime: null,
  sessions: 0,
};

let els = {};
let intervalId = null;
let audioCtx = null;
let ringCircumference = 0;

function init() {
  els = {
    mode: document.getElementById("mode-label"),
    time: document.getElementById("time-display"),
    ring: document.getElementById("ring-progress"),
    toggle: document.getElementById("toggle-btn"),
    reset: document.getElementById("reset-btn"),
    sessions: document.getElementById("session-count"),
  };

  ringCircumference = 2 * Math.PI * els.ring.r.baseVal.value;
  els.ring.style.strokeDasharray = ringCircumference;

  state.sessions = loadSessions();
  els.toggle.addEventListener("click", toggle);
  els.reset.addEventListener("click", reset);
  render();
}

function getDuration(mode) {
  return mode === "work" ? WORK_SECONDS : BREAK_SECONDS;
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

function render() {
  const total = getDuration(state.mode);
  els.time.textContent = formatTime(state.remaining);
  els.mode.textContent = state.mode === "work" ? "Work" : "Break";
  els.toggle.textContent = state.running ? "Pause" : "Start";
  els.sessions.textContent = state.sessions;
  document.body.className = "mode-" + state.mode;
  document.title = formatTime(state.remaining) + " - " + els.mode.textContent;
  updateRing(state.remaining, total);
}

function updateRing(remaining, total) {
  const elapsedFraction = 1 - remaining / total;
  els.ring.style.strokeDashoffset = ringCircumference * elapsedFraction;
}

function start() {
  if (state.running) return;
  state.running = true;
  state.endTime = Date.now() + state.remaining * 1000;
  intervalId = setInterval(tick, 250);
  render();
}

function pause() {
  if (!state.running) return;
  clearInterval(intervalId);
  intervalId = null;
  state.remaining = Math.max(0, Math.ceil((state.endTime - Date.now()) / 1000));
  state.running = false;
  state.endTime = null;
  render();
}

function toggle() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (state.running) {
    pause();
  } else {
    start();
  }
}

function reset() {
  clearInterval(intervalId);
  intervalId = null;
  state.running = false;
  state.endTime = null;
  state.remaining = getDuration(state.mode);
  render();
}

function tick() {
  const remaining = Math.max(0, Math.ceil((state.endTime - Date.now()) / 1000));
  if (remaining === 0) {
    completePeriod();
    return;
  }
  if (remaining !== state.remaining) {
    state.remaining = remaining;
    render();
  }
}

function completePeriod() {
  clearInterval(intervalId);
  intervalId = null;
  state.running = false;
  state.endTime = null;
  playChime();

  if (state.mode === "work") {
    state.sessions += 1;
    saveSessions(state.sessions);
    switchMode("break");
    start();
  } else {
    switchMode("work");
    start();
  }
}

function switchMode(mode) {
  state.mode = mode;
  state.remaining = getDuration(mode);
}

function playChime() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const now = audioCtx.currentTime;
  osc.frequency.value = 880;
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.8);
}

function loadSessions() {
  try {
    const value = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    return Number.isInteger(value) && value >= 0 ? value : 0;
  } catch (e) {
    return 0;
  }
}

function saveSessions(count) {
  try {
    localStorage.setItem(STORAGE_KEY, String(count));
  } catch (e) {
    // Storage unavailable. The counter still works for this page load.
  }
}

init();
