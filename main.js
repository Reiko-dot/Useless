const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
const mouse = {x: -999, y: -999};

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const COLORS = ['#ff2d6b','#00f5d4','#ffe45e','#7b2fff','#ff8c42'];

class Particle {
  constructor(burst) { this.reset(burst); }
  reset(burst) {
    if (burst) {
      this.x = burst.x; this.y = burst.y;
      this.vx = (Math.random()-0.5)*12;
      this.vy = (Math.random()-0.5)*12;
      this.life = 1; this.decay = 0.025 + Math.random()*0.04;
      this.size = 3 + Math.random()*5;
      this.type = 'burst';
    } else {
      this.x = Math.random()*W; this.y = Math.random()*H;
      this.vx = (Math.random()-0.5)*0.4;
      this.vy = (Math.random()-0.5)*0.4;
      this.life = 1; this.decay = 0;
      this.size = 1 + Math.random()*2;
      this.type = 'ambient';
    }
    this.color = COLORS[Math.floor(Math.random()*COLORS.length)];
  }
  update() {
    if (this.type === 'burst') {
      this.vx *= 0.93; this.vy *= 0.93;
      this.x += this.vx; this.y += this.vy;
      this.life -= this.decay;
      if (this.life <= 0) this.reset();
    } else {
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const d = Math.sqrt(dx*dx + dy*dy);
      if (d < 120) {
        const force = (120-d)/120 * 2.5;
        this.x += dx/d*force; this.y += dy/d*force;
      }
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0) this.x = W;
      if (this.x > W) this.x = 0;
      if (this.y < 0) this.y = H;
      if (this.y > H) this.y = 0;
      particles.forEach(p2 => {
        if (p2 === this || p2.type === 'burst') return;
        const dx2 = p2.x - this.x, dy2 = p2.y - this.y;
        const dd = dx2*dx2 + dy2*dy2;
        if (dd < 12000) {
          ctx.beginPath();
          ctx.strokeStyle = this.color;
          ctx.globalAlpha = (1 - dd/12000) * 0.12;
          ctx.lineWidth = 0.5;
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    }
  }
  draw() {
    ctx.globalAlpha = this.type === 'burst' ? this.life : 0.55;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = this.type === 'burst' ? 8 : 4;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < 90; i++) particles.push(new Particle());

function burst(x, y, n) {
  n = n || 28;
  for (let i = 0; i < n; i++) particles.push(new Particle({x, y}));
}

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = 'rgba(13,13,15,0.18)';
  ctx.fillRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  while (particles.length > 300) particles.splice(90, 1);
}
animate();

// cursor
const cur = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  mouse.x = e.clientX; mouse.y = e.clientY;
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});

// ticker typewriter
const tickerEl = document.getElementById('ticker');
const tickers = [
  'LOADING PURPOSE... ERROR 404',
  'CALCULATING MEANING OF LIFE... TIMEOUT',
  'RUNNING PRODUCTIVITY.EXE... CRASH',
  'CONNECTING TO MOTIVATION... DISCONNECTED',
  'SEARCHING FOR REASON TO EXIST... NOT FOUND',
  'INITIALIZING AMBITION... PERMISSION DENIED',
  'DOWNLOADING INSPIRATION... 0.000001%',
  'CONTACTING THE UNIVERSE... NO SIGNAL',
  'COMPILING EXCUSES... SUCCESS',
  'DEPLOYING NOTHING v2.0.0... DONE',
  'MEASURING WASTED TIME... OVERFLOW',
  'LOCATING GOALS... THEY MOVED',
];
let ti = 0, ci = 0, deleting = false;
function typeTicker() {
  const str = tickers[ti % tickers.length];
  if (!deleting) {
    tickerEl.textContent = str.slice(0, ++ci);
    if (ci >= str.length) { deleting = true; setTimeout(typeTicker, 1800); return; }
  } else {
    tickerEl.textContent = str.slice(0, --ci);
    if (ci <= 0) { deleting = false; ti++; setTimeout(typeTicker, 300); return; }
  }
  setTimeout(typeTicker, deleting ? 28 : 55);
}
typeTicker();

// seconds counter
let secsEl = document.getElementById('secs'), secsCount = 0;
setInterval(() => { secsEl.textContent = ++secsCount; }, 1000);

// button
let clicks = 0;
const countEl = document.getElementById('count');
const purposeEl = document.getElementById('purpose');
const pool = document.getElementById('toast-pool');

const msgs = [
  ['NOTHING HAPPENED', '#ff2d6b'],
  ['GALAXY UNIMPRESSED', '#00f5d4'],
  ['PRODUCTIVITY: -1', '#ff2d6b'],
  ['NULL RETURNED', '#7b2fff'],
  ['THE VOID YAWNED', '#00f5d4'],
  ['404: POINT NOT FOUND', '#ffe45e'],
  ['YOU DID IT! (DID NOTHING)', '#00f5d4'],
  ['NO ONE WAS NOTIFIED', '#7b2fff'],
  ['EXCELLENT. ABSOLUTELY NOTHING.', '#ffe45e'],
  ['CLICK PROCESSED. DISCARDED.', '#ff2d6b'],
  ['CONGRATS ON THE NOTHING', '#00f5d4'],
  ['ENTROPY INCREASED SLIGHTLY', '#7b2fff'],
  ['RESULT: SEE PREVIOUS RESULT', '#ffe45e'],
  ['BIG CLICK ENERGY: WASTED', '#ff2d6b'],
  ['NADA. ZILCH. ZERO. NICE.', '#00f5d4'],
  ['FILED UNDER /dev/null', '#7b2fff'],
  ['ACHIEVEMENT UNLOCKED: NOTHING', '#ffe45e'],
  ['THE BUTTON FELT NOTHING', '#ff2d6b'],
];

function spawnToast(x, y, text, color) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = '> ' + text;
  t.style.color = color;
  t.style.textShadow = '0 0 12px ' + color;
  t.style.left = (x + (Math.random()-0.5)*120) + 'px';
  t.style.top  = (y - 20) + 'px';
  pool.appendChild(t);
  setTimeout(() => t.remove(), 1900);
}

function spawnRipple(x, y) {
  const r = document.createElement('div');
  r.className = 'ripple';
  const size = 120 + Math.random()*80;
  r.style.cssText = 'left:'+x+'px;top:'+y+'px;width:'+size+'px;height:'+size+'px;border:2px solid '+COLORS[clicks%COLORS.length]+';opacity:0.6;';
  document.body.appendChild(r);
  setTimeout(() => r.remove(), 750);
}

function doNothing(e) {
  clicks++;
  countEl.textContent = clicks;

  const col = COLORS[clicks % COLORS.length];
  countEl.style.color = col;
  countEl.style.textShadow = '0 0 20px ' + col;

  burst(e.clientX, e.clientY, Math.min(30 + clicks*2, 80));
  spawnRipple(e.clientX, e.clientY);

  const [msg, mc] = msgs[clicks % msgs.length];
  spawnToast(e.clientX, e.clientY, msg, mc);

  if (clicks % 10 === 0) {
    document.body.classList.remove('chaos');
    void document.body.offsetWidth;
    document.body.classList.add('chaos');
    for (let i=0;i<3;i++) setTimeout(() => spawnRipple(Math.random()*W, Math.random()*H), i*80);
  }

  if (clicks % 47 === 0) {
    purposeEl.textContent = parseInt(purposeEl.textContent) + 1;
  }

  const titleEl = document.getElementById('title');
  titleEl.style.color = col;
  setTimeout(() => titleEl.style.color = '', 80);

  document.getElementById('btn-inner').style.background = col;
  setTimeout(() => document.getElementById('btn-inner').style.background = '', 120);
}

// idle bursts
let lastClick = Date.now();
document.getElementById('btn').addEventListener('click', () => lastClick = Date.now());
setInterval(() => {
  if (Date.now() - lastClick > 5000) {
    burst(Math.random()*W, Math.random()*H, 12);
  }
}, 2000);

canvas.addEventListener('click', e => burst(e.clientX, e.clientY, 10));