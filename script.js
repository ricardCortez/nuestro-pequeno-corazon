const audio = document.getElementById("audio");
const canvas = document.getElementById("waveform");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const replayButton = document.getElementById("replay");
const playLabel = document.getElementById("play-label");
const currentTimeLabel = document.getElementById("current-time");
const durationLabel = document.getElementById("duration");
const status = document.getElementById("status");

let audioContext;
let waveform = new Float32Array(240).fill(0.05);
let animationFrame;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function getCanvasMetrics() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(rect.width * ratio));
  const height = Math.max(1, Math.round(rect.height * ratio));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return { width, height, ratio };
}

function drawWave(progress = 0) {
  const context = canvas.getContext("2d");
  const { width, height, ratio } = getCanvasMetrics();
  const center = height / 2;
  const safeProgress = Math.max(0, Math.min(1, progress || 0));
  const activeX = width * safeProgress;

  context.clearRect(0, 0, width, height);

  const gradient = context.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, "#f3a7bd");
  gradient.addColorStop(1, "#ffc1d2");

  const render = (strokeStyle, lineWidth, maxX = width) => {
    context.beginPath();
    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth * ratio;
    context.lineCap = "round";
    context.lineJoin = "round";
    waveform.forEach((value, index) => {
      const x = (index / (waveform.length - 1)) * width;
      if (x > maxX) return;
      const amplitude = Math.max(0.035, value) * height * 0.43;
      if (index === 0) context.moveTo(x, center - amplitude);
      else context.lineTo(x, center - amplitude);
    });
    for (let index = waveform.length - 1; index >= 0; index -= 1) {
      const x = (index / (waveform.length - 1)) * width;
      if (x > maxX) continue;
      const amplitude = Math.max(0.035, waveform[index]) * height * 0.43;
      context.lineTo(x, center + amplitude);
    }
    context.stroke();
  };

  render("rgba(255, 193, 210, 0.18)", 1.25);
  if (activeX > 0) {
    context.save();
    context.shadowColor = "rgba(243, 167, 189, 0.65)";
    context.shadowBlur = 9 * ratio;
    render(gradient, 1.8, activeX);
    context.restore();
  }

  context.beginPath();
  context.strokeStyle = "rgba(255, 255, 255, 0.18)";
  context.lineWidth = ratio;
  context.moveTo(activeX, 12 * ratio);
  context.lineTo(activeX, height - 12 * ratio);
  context.stroke();
}

async function loadWaveform() {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    const response = await fetch("assets/latidos.mp4");
    if (!response.ok) throw new Error("No se pudo cargar el audio");
    const buffer = await response.arrayBuffer();
    const decoded = await audioContext.decodeAudioData(buffer.slice(0));
    const data = decoded.getChannelData(0);
    const samples = 240;
    const blockSize = Math.max(1, Math.floor(data.length / samples));
    const points = new Float32Array(samples);
    let peak = 0;

    for (let index = 0; index < samples; index += 1) {
      const start = index * blockSize;
      const end = Math.min(start + blockSize, data.length);
      let sum = 0;
      for (let cursor = start; cursor < end; cursor += 1) {
        sum += Math.abs(data[cursor]);
      }
      const average = sum / Math.max(1, end - start);
      points[index] = average;
      peak = Math.max(peak, average);
    }

    if (peak > 0) {
      waveform = points.map((value) => Math.pow(value / peak, 0.72));
    }
    drawWave(audio.duration ? audio.currentTime / audio.duration : 0);
  } catch (error) {
    console.warn("La onda se mostrará al iniciar la reproducción.", error);
  }
}

function updateProgress() {
  const progress = audio.duration ? audio.currentTime / audio.duration : 0;
  currentTimeLabel.textContent = formatTime(audio.currentTime);
  drawWave(progress);
  if (!audio.paused && !audio.ended) {
    animationFrame = requestAnimationFrame(updateProgress);
  }
}

async function playAudio(fromStart = false) {
  try {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === "suspended") await audioContext.resume();
    if (fromStart || audio.ended) audio.currentTime = 0;
    await audio.play();
  } catch (error) {
    status.textContent = "No se pudo iniciar el audio. Vuelve a tocar el botón.";
    console.error(error);
  }
}

playButton.addEventListener("click", () => playAudio(false));
pauseButton.addEventListener("click", () => audio.pause());
replayButton.addEventListener("click", () => playAudio(true));

audio.addEventListener("loadedmetadata", () => {
  durationLabel.textContent = formatTime(audio.duration);
  loadWaveform();
});

audio.addEventListener("play", () => {
  playButton.disabled = true;
  pauseButton.disabled = false;
  playLabel.textContent = "Reproduciendo latidos";
  status.textContent = "Reproduciendo los latidos.";
  cancelAnimationFrame(animationFrame);
  updateProgress();
});

audio.addEventListener("pause", () => {
  if (!audio.ended) {
    playButton.disabled = false;
    pauseButton.disabled = true;
    playLabel.textContent = "Continuar latidos";
    status.textContent = "Audio en pausa.";
  }
  cancelAnimationFrame(animationFrame);
  updateProgress();
});

audio.addEventListener("ended", () => {
  playButton.disabled = false;
  pauseButton.disabled = true;
  playLabel.textContent = "Escuchar nuevamente";
  status.textContent = "Los latidos terminaron. Puedes escucharlos nuevamente.";
  cancelAnimationFrame(animationFrame);
  updateProgress();
});

window.addEventListener("resize", () => {
  drawWave(audio.duration ? audio.currentTime / audio.duration : 0);
});

drawWave(0);
