const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const header = document.querySelector('.site-header');
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (header && menu && nav) {
  const setMenuOpen = open => {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? 'Close menu' : 'Menu';
  };

  menu.hidden = false;
  header.classList.add('menu-ready');
  menu.addEventListener('click', () => setMenuOpen(!nav.classList.contains('open')));
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setMenuOpen(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      setMenuOpen(false);
      menu.focus();
    }
  });

  window.matchMedia('(max-width: 900px)').addEventListener('change', () => setMenuOpen(false));
}

const filters = document.querySelector('.skill-filters');
const skills = Array.from(document.querySelectorAll('.skill-tags [data-category]'));

if (filters && skills.length) {
  const buttons = Array.from(filters.querySelectorAll('[data-filter]'));
  filters.hidden = false;

  filters.addEventListener('click', event => {
    const active = event.target.closest('button[data-filter]');
    if (!active) return;

    const category = active.dataset.filter;
    for (const button of buttons) button.setAttribute('aria-pressed', String(button === active));
    for (const skill of skills) skill.hidden = category !== 'all' && skill.dataset.category !== category;
  });
}
