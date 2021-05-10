// DOM elements
const modal = document.querySelector('.modal');
const form = modal.querySelector('form');
const angle = form.querySelector('#angle');
const velocity = form.querySelector('#velocity');
const accelerationInput = form.querySelector('#acceleration');
const cleanBtn = form.querySelector('#clear');
const resetBtn = document.querySelector('.reset-btn');

// canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ballRadius = 5;
let ballVelocityX;
let ballVelocityY;
let ballX = 0;
let ballY = 0;
let t = 0;
let acceleration;
let elapsedTime = 0;
let before;
let stop;

draw();

// Start the simulation
form.addEventListener('submit', e => {
  e.preventDefault();
  ballVelocityX = velocity.value * Math.cos(Math.PI / 180 * angle.value) * 10;
  ballVelocityY = velocity.value * Math.sin(Math.PI / 180 * angle.value) * 10;
  acceleration = accelerationInput.value * 10;
  stop = 2 * ballVelocityY / acceleration;
  acceleration /= 2;

  modal.style.display = 'none';
  requestAnimationFrame(animate);
});

function animate(timestamp) {
  elapsedTime = before !== undefined ? timestamp - before : 0;
  before = timestamp;
  
  ballX = ballVelocityX * t;
  ballY = t * (ballVelocityY - acceleration * t);
  
  draw();
  
  if (t >= stop) {
    cancelAnimationFrame(animate);
    resetBtn.style.display = 'block';
    return;
  }
  
  t += elapsedTime / 1000;
  
  requestAnimationFrame(animate);
}

function reset() {
  ballX = 0;
  ballY = 0;
  t = 0;
  before = undefined;

  draw();

  modal.style.display = 'block';
}

function draw() {
  ctx.save();
  ctx.fillStyle = 'lightgreen';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  
  drawLines();
  
  // Distance
  text(`${(ballX / 10).toFixed(2)} m`, window.innerWidth - 100, 24);
  
  if (ballX >= window.innerWidth) {
    ctx.translate(window.innerWidth - ballX - 10,0);
  }

  ctx.fillStyle = 'red';
  ball(ballX, ballY);

  ctx.restore();
}

function ball(x, y) {
  ctx.beginPath();
  ctx.arc(x + ballRadius, window.innerHeight - y - ballRadius, ballRadius, 0, Math.PI * 2);
  ctx.fill();
}

function text(message, x, y) {
  ctx.beginPath();
  ctx.font = '24px serif';
  ctx.fillText(message, x, y);
  ctx.fill();
}

function drawLines() {
  ctx.fillStyle = 'black';
  for (let i = 1; i <= Math.floor(window.innerHeight / 100); i++) {
    text(`${i * 10} m`, 10, window.innerHeight - 100 * i);
    
    ctx.beginPath();
    ctx.moveTo(0, window.innerHeight - 100 * i);
    ctx.lineTo(window.innerWidth, window.innerHeight - 100 * i);
    ctx.stroke();
  }
}

resetBtn.addEventListener('click', ({ target }) => {
  target.style.display = 'none';
  reset();
});

cleanBtn.addEventListener('click', () => {
  angle.value = '';
  velocity.value = '';
  accelerationInput.value = '';
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});