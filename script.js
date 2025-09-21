const canvas = document.getElementById("snake-canvas");const canvas = document.getElementById("snake-canvas");

const ctx = canvas.getContext("2d");const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");const scoreEl = document.getElementById("score");

const highScoreEl = document.getElementById("high-score");const highScoreEl = document.getElementById("high-score");

const controls = document.querySelectorAll(".snake-controls button");const controls = document.querySelectorAll(".snake-controls button");

const volumeBtn = document.getElementById("volume-btn");const volumeBtn = document.getElementById("volume-btn");

const volumeSlider = document.getElementById("volume-slider");const volumeSlider = document.getElementById("volume-slider");

const audio = new Audio("assets/audio.mp3");const audio = new Audio("assets/audio.mp3");



const theme = {const theme = {

  bg: "#191622",  bg: "#191622",

  snake: "#3fc459",  snake: "#3fc459",

  food: "#FF003D",  food: "#FF003D",

  border: "#fff",  border: "#fff",

};};

const grid = 24;const grid = 24;

const size = 20;const size = 20;

let snake, dir, nextDir, food, score, highScore, gameOver, speed, muted;let snake, dir, nextDir, food, score, highScore, gameOver, speed, muted;



function initGame() {function initGame() {

  snake = [{ x: 10, y: 10 }];  snake = [{ x: 10, y: 10 }];

  dir = { x: 0, y: 0 };  dir = { x: 0, y: 0 };

  nextDir = { x: 0, y: 0 };  nextDir = { x: 0, y: 0 };

  food = spawnFood();  food = spawnFood();

  score = 0;  score = 0;

  highScore = parseInt(localStorage.getItem("high-score")) || 0;  highScore = parseInt(localStorage.getItem("high-score")) || 0;

  gameOver = false;  gameOver = false;

  speed = 10;  speed = 10;

  muted = false;  muted = false;

  updateScore();  updateScore();

}}



function spawnFood() {function spawnFood() {

  let pos;  let pos;

  do {  do {

    pos = {    pos = {

      x: Math.floor(Math.random() * size),      x: Math.floor(Math.random() * size),

      y: Math.floor(Math.random() * size),      y: Math.floor(Math.random() * size),

    };    };

  } while (snake && snake.some((s) => s.x === pos.x && s.y === pos.y));  } while (snake && snake.some((s) => s.x === pos.x && s.y === pos.y));

  return pos;  return pos;

}}



function draw() {function draw() {

  ctx.fillStyle = theme.bg;  ctx.fillStyle = theme.bg;

  ctx.fillRect(0, 0, canvas.width, canvas.height);  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Food  // Food

  ctx.fillStyle = theme.food;  ctx.fillStyle = theme.food;

  ctx.beginPath();  ctx.beginPath();

  ctx.arc(  ctx.arc(

    food.x * grid + grid / 2,    food.x * grid + grid / 2,

    food.y * grid + grid / 2,    food.y * grid + grid / 2,

    grid / 2.5,    grid / 2.5,

    0,    0,

    2 * Math.PI    2 * Math.PI

  );  );

  ctx.fill();  ctx.fill();

  // Snake  // Snake

  ctx.fillStyle = theme.snake;  ctx.fillStyle = theme.snake;

  snake.forEach((s, i) => {  snake.forEach((s, i) => {

    ctx.beginPath();    ctx.beginPath();

    ctx.arc(    ctx.arc(

      s.x * grid + grid / 2,      s.x * grid + grid / 2,

      s.y * grid + grid / 2,      s.y * grid + grid / 2,

      grid / 2.2,      grid / 2.2,

      0,      0,

      2 * Math.PI      2 * Math.PI

    );    );

    ctx.fill();    ctx.fill();

    if (i === 0) {    if (i === 0) {

      ctx.strokeStyle = theme.border;      ctx.strokeStyle = theme.border;

      ctx.lineWidth = 2;      ctx.lineWidth = 2;

      ctx.stroke();      ctx.stroke();

    }    }

  });  });

}}



function updateScore() {function updateScore() {

  scoreEl.textContent = `Pontuação: ${score}`;  scoreEl.textContent = `Pontuação: ${score}`;

  highScoreEl.textContent = `Máxima: ${highScore}`;  highScoreEl.textContent = `Máxima: ${highScore}`;

}}



function move() {function move() {

  if (gameOver || (dir.x === 0 && dir.y === 0)) return;  if (gameOver || (dir.x === 0 && dir.y === 0)) return;

  dir = { ...nextDir };  dir = { ...nextDir };

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // Wall  // Wall

  if (head.x < 0 || head.x >= size || head.y < 0 || head.y >= size)  if (head.x < 0 || head.x >= size || head.y < 0 || head.y >= size)

    return end();    return end();

  // Self  // Self

  if (snake.some((s, i) => i && s.x === head.x && s.y === head.y)) return end();  if (snake.some((s, i) => i && s.x === head.x && s.y === head.y)) return end();

  snake.unshift(head);  snake.unshift(head);

  // Eat  // Eat

  if (head.x === food.x && head.y === food.y) {  if (head.x === food.x && head.y === food.y) {

    score++;    score++;

    if (!muted) {    if (!muted) {

      audio.currentTime = 0;      audio.currentTime = 0;

      audio.play();      audio.play();

    }    }

    if (score > highScore) {    if (score > highScore) {

      highScore = score;      highScore = score;

      localStorage.setItem("high-score", highScore);      localStorage.setItem("high-score", highScore);

    }    }

    food = spawnFood();    food = spawnFood();

  } else {  } else {

    snake.pop();    snake.pop();

  }  }

  updateScore();  updateScore();

}}



function end() {function end() {

  gameOver = true;  gameOver = true;

  setTimeout(() => {  setTimeout(() => {

    alert("Game Over! Clique em OK para reiniciar.");    alert("Game Over! Clique em OK para reiniciar.");

    initGame();    initGame();

  }, 100);  }, 100);

}}



function gameLoop() {function gameLoop() {

  move();  move();

  draw();  draw();

}}



// Controls// Controls

function setDir(key) {function setDir(key) {

  if (gameOver) return;  if (gameOver) return;

  let d = dir;  let d = dir;

  // Aceita WASD e setas  // Aceita WASD e setas

  const up = key === "ArrowUp" || key === "w" || key === "W";  const up = key === "ArrowUp" || key === "w" || key === "W";

  const down = key === "ArrowDown" || key === "s" || key === "S";  const down = key === "ArrowDown" || key === "s" || key === "S";

  const left = key === "ArrowLeft" || key === "a" || key === "A";  const left = key === "ArrowLeft" || key === "a" || key === "A";

  const right = key === "ArrowRight" || key === "d" || key === "D";  const right = key === "ArrowRight" || key === "d" || key === "D";

  if (d.x === 0 && d.y === 0) {  if (d.x === 0 && d.y === 0) {

    if (up) d = { x: 0, y: -1 };    if (up) d = { x: 0, y: -1 };

    if (down) d = { x: 0, y: 1 };    if (down) d = { x: 0, y: 1 };

    if (left) d = { x: -1, y: 0 };    if (left) d = { x: -1, y: 0 };

    if (right) d = { x: 1, y: 0 };    if (right) d = { x: 1, y: 0 };

    dir = nextDir = d;    dir = nextDir = d;

    return;    return;

  }  }

  if (up && d.y !== 1) nextDir = { x: 0, y: -1 };  if (up && d.y !== 1) nextDir = { x: 0, y: -1 };

  if (down && d.y !== -1) nextDir = { x: 0, y: 1 };  if (down && d.y !== -1) nextDir = { x: 0, y: 1 };

  if (left && d.x !== 1) nextDir = { x: -1, y: 0 };  if (left && d.x !== 1) nextDir = { x: -1, y: 0 };

  if (right && d.x !== -1) nextDir = { x: 1, y: 0 };  if (right && d.x !== -1) nextDir = { x: 1, y: 0 };

}}



document.addEventListener("keydown", (e) => setDir(e.key));document.addEventListener("keydown", (e) => setDir(e.key));

controls.forEach((btn) =>controls.forEach((btn) =>

  btn.addEventListener("click", () => setDir(btn.dataset.key))  btn.addEventListener("click", () => setDir(btn.dataset.key))

););



// Swipe// Swipe

let swipeStart = null;let swipeStart = null;

canvas.addEventListener("touchstart", (e) => {canvas.addEventListener("touchstart", (e) => {

  if (e.touches.length !== 1) return;  if (e.touches.length !== 1) return;

  const t = e.touches[0];  const t = e.touches[0];

  swipeStart = { x: t.clientX, y: t.clientY };  swipeStart = { x: t.clientX, y: t.clientY };

});});

canvas.addEventListener("touchmove", (e) => {canvas.addEventListener(

  // Previne scroll durante o swipe  "touchmove",

  e.preventDefault();  (e) => {

}, { passive: false });    // Previne scroll durante o swipe

canvas.addEventListener("touchend", (e) => {    e.preventDefault();

  if (!swipeStart) return;  },

  const t = e.changedTouches[0];  { passive: false }

  const dx = t.clientX - swipeStart.x;);

  const dy = t.clientY - swipeStart.y;canvas.addEventListener("touchend", (e) => {

  // Só reconhece swipe se movimento for suficiente  if (!swipeStart) return;

  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {  const t = e.changedTouches[0];

    swipeStart = null;  const dx = t.clientX - swipeStart.x;

    return;  const dy = t.clientY - swipeStart.y;

  }  // Só reconhece swipe se movimento for suficiente

  if (Math.abs(dx) > Math.abs(dy)) {  if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {

    if (dx > 30) setDir("ArrowRight");    swipeStart = null;

    else if (dx < -30) setDir("ArrowLeft");    return;

  } else {  }

    if (dy > 30) setDir("ArrowDown");  if (Math.abs(dx) > Math.abs(dy)) {

    else if (dy < -30) setDir("ArrowUp");    if (dx > 30) setDir("ArrowRight");

  }    else if (dx < -30) setDir("ArrowLeft");

  swipeStart = null;  } else {

});    if (dy > 30) setDir("ArrowDown");

    else if (dy < -30) setDir("ArrowUp");

// Volume  }

function updateVolumeIcon() {  swipeStart = null;

  volumeBtn.textContent = muted || audio.volume === 0 ? "🔇" : "🔊";});

}

volumeBtn.addEventListener("click", () => {// Volume

  muted = !muted;function updateVolumeIcon() {

  audio.muted = muted;  volumeBtn.textContent = muted || audio.volume === 0 ? "🔇" : "🔊";

  updateVolumeIcon();}

});volumeBtn.addEventListener("click", () => {

volumeSlider.addEventListener("input", () => {  muted = !muted;

  audio.volume = Number(volumeSlider.value);  audio.muted = muted;

  muted = audio.volume === 0;  updateVolumeIcon();

  audio.muted = muted;});

  updateVolumeIcon();volumeSlider.addEventListener("input", () => {

});  audio.volume = Number(volumeSlider.value);

audio.volume = Number(volumeSlider.value);  muted = audio.volume === 0;

updateVolumeIcon();  audio.muted = muted;

  updateVolumeIcon();

// Loop});

let last = 0;audio.volume = Number(volumeSlider.value);

function loop(ts) {updateVolumeIcon();

  if (!last) last = ts;

  if (ts - last > 1000 / speed) {// Loop

    gameLoop();let last = 0;

    last = ts;function loop(ts) {

  }  if (!last) last = ts;

  requestAnimationFrame(loop);  if (ts - last > 1000 / speed) {

}    gameLoop();

    last = ts;

initGame();  }

  requestAnimationFrame(loop);

requestAnimationFrame(loop);}


initGame();

requestAnimationFrame(loop);
