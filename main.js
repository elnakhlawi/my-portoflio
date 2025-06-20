let btn = document.getElementById("helloBton");
let msg = document.getElementById("message");
let contactForm = document.getElementById("contactForm");
let formMsg = document.getElementById("formMsg");
btn.addEventListener("click", (e) => {
  if (msg.textContent == "") {
    msg.textContent = "نورت الدنيا يا منجا 💡";
    btn.innerHTML = "طيب شيل الرساله";
  } else {
    btn.innerHTML = "دوس عليا كده ";
    msg.textContent = "";
  }
});

// Contact form handler (with phone field)
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let tel = document.getElementById("tel").value.trim();
  let msgInput = document.getElementById("msgInput").value.trim();

  if (name && email && tel && msgInput) {
    formMsg.textContent = `شكرا  لك يا ${name} علي تواصلك معايه`;
    formMsg.style.cssText = `
      background-color: rgba(94, 224, 94, 0.514);
      font-size: 20px;
      padding: 20px;
      border-radius: 3px;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      -ms-border-radius: 3px;
      -o-border-radius: 3px;
      font-weight: bold;`;
    contactForm.reset();
    setTimeout(() => {
      formMsg.textContent = "";
      formMsg.style.cssText = "";
    }, 2500);
  } else {
    formMsg.textContent = "من فضلك دخل البيانات المطلوبة ياقمر";
    formMsg.style.cssText = "color:white;background-color:red;";
    setTimeout(() => {
      formMsg.textContent = "";
      formMsg.style.cssText = "";
    }, 2500);
  }
});

// === Animated Starfield/Galaxy Background ===
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let stars = [];
  const STAR_COUNT = 220;
  const COLORS = [
    "rgba(255,255,255,0.9)", // white
    "rgba(173,216,230,0.8)", // light blue
    "rgba(186,85,211,0.7)", // medium purple
    "rgba(100,149,237,0.7)", // cornflower blue
    "rgba(255,182,193,0.6)", // light pink
  ];
  let mouse = { x: null, y: null };
  let center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    center.x = window.innerWidth / 2;
    center.y = window.innerHeight / 2;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      // For galaxy effect, use polar coordinates
      this.orbitRadius =
        Math.random() * Math.max(canvas.width, canvas.height) * 0.5;
      this.angle = Math.random() * Math.PI * 2;
      this.speed = 0.0005 + Math.random() * 0.0007; // slow orbital speed
      this.size = Math.random() * 1.2 + 0.2;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.twinkle = Math.random() * 0.5 + 0.5;
    }
    update() {
      this.angle += this.speed;
      // Parallax: stars move slightly with mouse
      let parallaxX =
        mouse.x !== null
          ? (mouse.x - center.x) * (this.orbitRadius / canvas.width) * 0.02
          : 0;
      let parallaxY =
        mouse.y !== null
          ? (mouse.y - center.y) * (this.orbitRadius / canvas.height) * 0.02
          : 0;
      this.x = center.x + Math.cos(this.angle) * this.orbitRadius + parallaxX;
      this.y = center.y + Math.sin(this.angle) * this.orbitRadius + parallaxY;
      // Twinkle effect
      this.currentAlpha =
        this.twinkle + Math.sin(Date.now() * 0.002 + this.angle * 2) * 0.3;
      // If out of bounds, reset
      if (
        this.x < -50 ||
        this.x > canvas.width + 50 ||
        this.y < -50 ||
        this.y > canvas.height + 50
      ) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, this.currentAlpha));
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push(new Star());
    }
  }
  initStars();
  window.addEventListener("resize", initStars);

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    // Deep space background
    let gradient = ctx.createRadialGradient(
      center.x,
      center.y,
      0,
      center.x,
      center.y,
      Math.max(canvas.width, canvas.height) * 0.7
    );
    gradient.addColorStop(0, "#181c2b");
    gradient.addColorStop(1, "#0a0a23");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let s of stars) {
      s.update();
      s.draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

// === Floating Particles Layer (react to mouse) ===
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Use a separate array for particles
  let particles = [];
  const PARTICLE_COUNT = 32;
  const PARTICLE_COLORS = [
    "rgba(255,255,255,0.15)",
    "rgba(173,216,230,0.18)",
    "rgba(186,85,211,0.13)",
    "rgba(255,182,193,0.12)",
  ];
  let mouse = { x: null, y: null };

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  class Particle {
    constructor() {
      this.radius = randomBetween(18, 36);
      this.x = randomBetween(0, canvas.width);
      this.y = randomBetween(0, canvas.height);
      this.baseX = this.x;
      this.baseY = this.y;
      this.color =
        PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      this.speedX = randomBetween(-0.15, 0.15);
      this.speedY = randomBetween(-0.15, 0.15);
      this.opacity = randomBetween(0.18, 0.32);
    }
    update() {
      // Move
      this.x += this.speedX;
      this.y += this.speedY;
      // Bounce off edges
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      // Mouse repulsion
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let minDist = this.radius + 60;
        if (dist < minDist) {
          // Repel
          let angle = Math.atan2(dy, dx);
          let repelStrength = (minDist - dist) * 0.12;
          this.x += Math.cos(angle) * repelStrength;
          this.y += Math.sin(angle) * repelStrength;
        }
      }
    }
    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 32;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();
  window.addEventListener("resize", initParticles);

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Patch the main animation loop to draw these particles after the starfield
  const oldAnimate = window.requestAnimationFrame;
  let lastDraw = null;
  function drawParticles() {
    for (let p of particles) {
      p.update();
      p.draw(ctx);
    }
  }
  // Monkey-patch the starfield animate loop to call drawParticles after the stars
  function patchStarfieldLoop() {
    // Find the starfield animate function
    let animateFunc = null;
    for (let key in window) {
      if (
        typeof window[key] === "function" &&
        window[key].toString().includes("requestAnimationFrame(animate)")
      ) {
        animateFunc = window[key];
        break;
      }
    }
    if (!animateFunc) return;
    // Patch it
    const originalAnimate = animateFunc;
    function wrappedAnimate() {
      originalAnimate();
      drawParticles();
    }
    // Not strictly necessary, but for clarity
    window.requestAnimationFrame = function (cb) {
      return oldAnimate(function (ts) {
        cb(ts);
        drawParticles();
      });
    };
  }
  // Instead, just draw after the starfield in the same animation frame
  // So, we hook into the starfield's animate function
  // We'll use a MutationObserver to ensure we always draw after the starfield
  function drawAfterStarfield() {
    let last = null;
    function loop() {
      if (last !== window.bgStarfieldFrame) {
        last = window.bgStarfieldFrame;
        drawParticles();
      }
      oldAnimate(loop);
    }
    oldAnimate(loop);
  }
  // Instead, just draw every frame
  function loop() {
    drawParticles();
    oldAnimate(loop);
  }
  loop();
})();

// === Animated Water Wave Layer ===
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Wave parameters
  const WAVE_COUNT = 4;
  const WAVE_COLORS = [
    "rgba(80,180,255,0.18)",
    "rgba(120,200,255,0.13)",
    "rgba(180,220,255,0.10)",
    "rgba(255,255,255,0.08)",
  ];
  let waves = [];
  let width = canvas.width;
  let height = canvas.height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  class Wave {
    constructor(i) {
      this.amplitude = randomBetween(18, 38) + i * 8;
      this.length = randomBetween(0.008, 0.018) + i * 0.002;
      this.speed = randomBetween(0.5, 1.2) * (i % 2 === 0 ? 1 : -1);
      this.phase = Math.random() * Math.PI * 2;
      this.color = WAVE_COLORS[i % WAVE_COLORS.length];
      this.yOffset = height * (0.5 + (i - (WAVE_COUNT - 1) / 2) * 0.13);
    }
    draw(time) {
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= width; x += 2) {
        let y =
          this.yOffset +
          Math.sin(x * this.length + time * this.speed + this.phase) *
            this.amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.globalAlpha = 1;
      ctx.stroke();
      ctx.restore();
    }
  }

  function initWaves() {
    waves = [];
    for (let i = 0; i < WAVE_COUNT; i++) {
      waves.push(new Wave(i));
    }
  }
  initWaves();
  window.addEventListener("resize", initWaves);

  // Patch the main animation loop to draw these waves at the start of each frame
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  function drawWaves(time) {
    for (let w of waves) {
      w.draw(time * 0.001);
    }
  }
  // Instead, just draw every frame before other effects
  function loop() {
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    // Draw waves
    drawWaves(performance.now());
    ctx.restore();
    oldRequestAnimationFrame(loop);
  }
  loop();
})();

// === Animated Rotating Polygons Layer ===
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const POLY_COUNT = 18;
  const POLY_COLORS = [
    "rgba(255,255,255,0.10)",
    "rgba(173,216,230,0.13)",
    "rgba(186,85,211,0.10)",
    "rgba(100,149,237,0.10)",
    "rgba(255,182,193,0.09)",
  ];
  let polygons = [];
  let width = canvas.width;
  let height = canvas.height;

  function resize() {
    width = canvas.width;
    height = canvas.height;
  }
  window.addEventListener("resize", resize);
  resize();

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  class Polygon {
    constructor() {
      this.sides = Math.floor(randomBetween(3, 7)); // 3-6 sides
      this.radius = randomBetween(28, 70);
      this.x = randomBetween(0, width);
      this.y = randomBetween(0, height);
      this.color = POLY_COLORS[Math.floor(Math.random() * POLY_COLORS.length)];
      this.angle = randomBetween(0, Math.PI * 2);
      this.rotationSpeed = randomBetween(-0.003, 0.003);
      this.driftX = randomBetween(-0.08, 0.08);
      this.driftY = randomBetween(-0.08, 0.08);
      this.opacity = randomBetween(0.1, 0.22);
    }
    update() {
      this.angle += this.rotationSpeed;
      this.x += this.driftX;
      this.y += this.driftY;
      // Wrap around screen
      if (this.x < -this.radius) this.x = width + this.radius;
      if (this.x > width + this.radius) this.x = -this.radius;
      if (this.y < -this.radius) this.y = height + this.radius;
      if (this.y > height + this.radius) this.y = -this.radius;
    }
    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      for (let i = 0; i < this.sides; i++) {
        let theta = ((Math.PI * 2) / this.sides) * i;
        let px = Math.cos(theta) * this.radius;
        let py = Math.sin(theta) * this.radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  function initPolygons() {
    polygons = [];
    for (let i = 0; i < POLY_COUNT; i++) {
      polygons.push(new Polygon());
    }
  }
  initPolygons();
  window.addEventListener("resize", initPolygons);

  // Draw polygons at the very back of the canvas
  function drawPolygons() {
    for (let p of polygons) {
      p.update();
      p.draw(ctx);
    }
  }

  // Animation loop for polygons (drawn before everything else)
  const oldRequestAnimationFrame = window.requestAnimationFrame;
  function loop() {
    drawPolygons();
    oldRequestAnimationFrame(loop);
  }
  loop();
})();

// === 3D Card Hover Effect ===
document.querySelectorAll(".projects .project").forEach((card) => {
  card.addEventListener("mousemove", function (e) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 10; // max 10deg
    const rotateY = ((x - centerX) / centerX) * 14; // max 14deg
    card.style.transform = `scale(1.035) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    card.classList.add("is-tilting");
  });
  card.addEventListener("mouseleave", function () {
    card.style.transform = "";
    card.classList.remove("is-tilting");
  });
  card.addEventListener("mouseenter", function () {
    card.style.transition = "transform 0.18s cubic-bezier(.4,1.4,.6,1)";
    setTimeout(() => {
      card.style.transition = "";
    }, 200);
  });
});
