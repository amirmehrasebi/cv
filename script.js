// ==============================
// AMIR MEHRASEBI — Portfolio JS
// Theme Toggle + Scroll Reveal
// ==============================

// --- THEME TOGGLE ---
const html = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

toggleBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// --- SCROLL REVEAL ---
const revealElements = document.querySelectorAll(
  '.tl-item, .skill-block, .stat-card, .portfolio-card, .contact-item, .about-text, .about-stats, .lang-section'
);

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger effect
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, 80 * (Array.from(revealElements).indexOf(entry.target) % 6));
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => observer.observe(el));

// --- ACTIVE NAV LINK ---
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--accent)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

// --- NAV SCROLL SHADOW ---
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.boxShadow = '0 2px 20px rgba(0,0,0,0.2)';
  } else {
    nav.style.boxShadow = 'none';
  }
});
