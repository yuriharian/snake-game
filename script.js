const canvas = document.getElementById("snake-canvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("high-score");
const controls = document.querySelectorAll(".snake-controls button");
const volumeBtn = document.getElementById("volume-btn");
const volumeSlider = document.getElementById("volume-slider");
const audio = new Audio("assets/audio.mp3");

const theme = {
  bg: "#191622",
  snake: "#3fc459",
  food: "#FF003D",
  border: "#fff",
};
const grid = 24;
const size = 20;
let snake, dir, nextDir, food, score, highScore, gameOver, speed, muted;

function initGame() {
  snake = [{ x: 10, y: 10 }];
  dir = { x: 0, y: 0 };
  nextDir = { x: 0, y: 0 };
  food = spawnFood();
  score = 0;
  highScore = parseInt(localStorage.getItem("high-score")) || 0;
  gameOver = false;
  speed = 10;
  muted = false;
  updateScore();
}

function spawnFood() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size),
    };
  } while (snake && snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

function draw() {
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Food
  ctx.fillStyle = theme.food;
  ctx.beginPath();
  ctx.arc(
    food.x * grid + grid / 2,
    food.y * grid + grid / 2,
    grid / 2.5,
    0,
    2 * Math.PI
  );
  ctx.fill();
  // Snake
  ctx.fillStyle = theme.snake;
  snake.forEach((s, i) => {
    ctx.beginPath();
    ctx.arc(
      s.x * grid + grid / 2,
      s.y * grid + grid / 2,
      grid / 2.2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    if (i === 0) {
      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  });
}

function updateScore() {
  scoreEl.textContent = `Pontuação: ${score}`;
  highScoreEl.textContent = `Máxima: ${highScore}`;
}

function move() {
  if (gameOver || (dir.x === 0 && dir.y === 0)) return;
  dir = { ...nextDir };
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  // Wall
  if (head.x < 0 || head.x >= size || head.y < 0 || head.y >= size)
    return end();
  // Self
  if (snake.some((s, i) => i && s.x === head.x && s.y === head.y)) return end();
  snake.unshift(head);
  // Eat
  if (head.x === food.x && head.y === food.y) {
    score++;
    if (!muted) {
      audio.currentTime = 0;
      audio.play();
    }
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("high-score", highScore);
    }
    food = spawnFood();
  } else {
    snake.pop();
  }
  updateScore();
}

function end() {
  gameOver = true;
  setTimeout(() => {
    alert("Game Over! Clique em OK para reiniciar.");
    initGame();
  }, 100);
}

function gameLoop() {
  move();
  draw();
}

// Controls
function setDir(key) {
  if (gameOver) return;
  let d = dir;
  // Aceita WASD e setas
  const up = key === "ArrowUp" || key === "w" || key === "W";
  const down = key === "ArrowDown" || key === "s" || key === "S";
  const left = key === "ArrowLeft" || key === "a" || key === "A";
  const right = key === "ArrowRight" || key === "d" || key === "D";
  if (d.x === 0 && d.y === 0) {
    if (up) d = { x: 0, y: -1 };
    if (down) d = { x: 0, y: 1 };
    if (left) d = { x: -1, y: 0 };
    if (right) d = { x: 1, y: 0 };
    dir = nextDir = d;
    return;
  }
  if (up && d.y !== 1) nextDir = { x: 0, y: -1 };
  if (down && d.y !== -1) nextDir = { x: 0, y: 1 };
  if (left && d.x !== 1) nextDir = { x: -1, y: 0 };
  if (right && d.x !== -1) nextDir = { x: 1, y: 0 };
}

document.addEventListener("keydown", (e) => setDir(e.key));
controls.forEach((btn) =>
  btn.addEventListener("click", () => setDir(btn.dataset.key))
);

// Swipe
let swipeStart = null;
canvas.addEventListener("touchstart", (e) => {
  if (e.touches.length !== 1) return;
  const t = e.touches[0];
  swipeStart = { x: t.clientX, y: t.clientY };
});
canvas.addEventListener(
  "touchmove",
  (e) => {
    // Previne scroll durante o swipe
    e.preventDefault();
  },
  { passive: false }
);
canvas.addEventListener("touchend", (e) => {
  if (!swipeStart) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - swipeStart.x;
  const dy = t.clientY - swipeStart.y;
  // Só reconhece swipe se movimento for suficiente
  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
    swipeStart = null;
    return;
  }
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30) setDir("ArrowRight");
    else if (dx < -30) setDir("ArrowLeft");
  } else {
    if (dy > 30) setDir("ArrowDown");
    else if (dy < -30) setDir("ArrowUp");
  }
  swipeStart = null;
});

// Volume
function updateVolumeIcon() {
  volumeBtn.textContent = muted || audio.volume === 0 ? "🔇" : "🔊";
}
volumeBtn.addEventListener("click", () => {
  muted = !muted;
  audio.muted = muted;
  updateVolumeIcon();
});
volumeSlider.addEventListener("input", () => {
  audio.volume = Number(volumeSlider.value);
  muted = audio.volume === 0;
  audio.muted = muted;
  updateVolumeIcon();
});
audio.volume = Number(volumeSlider.value);
updateVolumeIcon();

// Loop
let last = 0;
function loop(ts) {
  if (!last) last = ts;
  if (ts - last > 1000 / speed) {
    gameLoop();
    last = ts;
  }
  requestAnimationFrame(loop);
}

initGame();

requestAnimationFrame(loop);
