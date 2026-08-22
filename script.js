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
