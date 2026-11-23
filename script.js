const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll('.reveal').forEach(el => {
  if (el.dataset.delay) el.style.setProperty('--delay', `${el.dataset.delay}ms`);
  revealObserver.observe(el);
});

const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', e => {
  if (glow) {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  }
});

if (window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(1000px) rotateY(${x * 3.5}deg) rotateX(${y * -3.5}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = '');
  });
}

const starField = document.querySelector('.skills-stars');
if (starField) {
  const count = window.innerWidth < 640 ? 65 : 120;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('i');
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const size = Math.random() > .82 ? 3 : 2;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty('--o', (Math.random() * .55 + .35).toFixed(2));
    star.style.setProperty('--t', `${(Math.random() * 3 + 2).toFixed(1)}s`);
    star.style.animationDelay = `${(Math.random() * 4).toFixed(1)}s`;
    starField.appendChild(star);
  }
}

const skillCards = [...document.querySelectorAll('.skill-card')];
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: .2 });
skillCards.forEach(card => skillObserver.observe(card));

document.querySelectorAll('.skill-filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.skill-filter').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const category = button.dataset.filter;
    skillCards.forEach(card => {
      const show = category === 'all' || card.dataset.category === category;
      card.hidden = !show;
      if (show) requestAnimationFrame(() => card.classList.add('is-visible'));
    });
  });
});


// Lightweight animated network background; respects reduced motion and visibility.
(() => {
  const canvas = document.getElementById('network-mesh');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = { x: -1000, y: -1000 };
  let nodes = [], width = 0, height = 0, frame = 0, raf = 0;
  const resize = () => {
    width = window.innerWidth; height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(85, Math.max(24, Math.round(width * height / 18000)));
    nodes = Array.from({length: count}, () => ({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - .5) * .32, vy: (Math.random() - .5) * .32,
      r: Math.random() * 1.25 + .65
    }));
    draw();
  };
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    const maxDist = width < 640 ? 135 : 175;
    nodes.forEach((a, i) => {
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist >= maxDist) continue;
        const alpha = (1 - dist / maxDist) * .24;
        ctx.strokeStyle = 'rgba(96,165,250,' + alpha.toFixed(3) + ')';
        ctx.lineWidth = .75;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      const near = Math.hypot(a.x - pointer.x, a.y - pointer.y) < 170;
      ctx.fillStyle = near ? 'rgba(147,197,253,.85)' : 'rgba(96,165,250,.48)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r + (near ? .5 : 0), 0, Math.PI * 2); ctx.fill();
    });
  };
  const animate = () => {
    if (reduced.matches || document.hidden) { raf = 0; return; }
    frame++;
    for (const p of nodes) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }
    draw();
    raf = requestAnimationFrame(animate);
  };
  const restart = () => {
    cancelAnimationFrame(raf); raf = 0;
    draw();
    if (!reduced.matches && !document.hidden) raf = requestAnimationFrame(animate);
  };
  window.addEventListener('resize', resize, {passive:true});
  window.addEventListener('pointermove', e => {pointer.x=e.clientX; pointer.y=e.clientY;}, {passive:true});
  document.addEventListener('visibilitychange', restart);
  reduced.addEventListener('change', restart);
  resize(); restart();
})();
