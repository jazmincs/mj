const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const text = 'Te amo ❤️'; // Texto completo con corazón
const fontSize = 24;
const columns = Math.floor(width / fontSize);
const drops = [];

// Inicializar posiciones de caída para cada columna
for (let x = 0; x < columns; x++) {
  drops[x] = Math.random() * height;
}

// Color inicial
let color = '#ff4081';

// Selector de color
const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', (e) => {
  color = e.target.value;
});

// Clase para partículas de explosión
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 6 + 1;
    this.color = color;
    this.speedX = (Math.random() - 0.5) * 9;
    this.speedY = (Math.random() - 0.5) * 9;
    this.alpha = 1;
    this.decay = 0.02 + Math.random() * 0.02;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.alpha -= this.decay;
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha > 0 ? this.alpha : 0;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  isDead() {
    return this.alpha <= 0;
  }
}

const particles = [];

// Crear explosión de partículas en x,y
function createExplosion(x, y) {
  const numberOfParticles = 30;
  for (let i = 0; i < numberOfParticles; i++) {
    particles.push(new Particle(x, y, color));
  }
}

// Función principal de dibujo
function draw() {
  // Fondo semitransparente para efecto de desvanecimiento
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = color; // Color dinámico para texto y corazón
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    ctx.fillText(text, i * fontSize, drops[i]);
    drops[i] += fontSize;
    if (drops[i] > height + Math.random() * 1000) {
      drops[i] = 0;
    }
  }

  // Actualizar y dibujar partículas de explosión
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw(ctx);
    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }
}

// Ajustar canvas al cambiar tamaño de ventana
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

// Detectar clics para explosión
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  createExplosion(x, y);
});

// Detectar toque para explosión (móviles)
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  createExplosion(x, y);
});

setInterval(draw, 50);
