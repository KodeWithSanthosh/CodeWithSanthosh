// ── Sticky nav shadow on scroll ─────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ── Hamburger menu ───────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Close menu on nav link click (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Active nav link on scroll ────────────────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const links    = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => observer.observe(s));

// ═══════════════════════════════════════════════════
// DARK / LIGHT THEME TOGGLE
// ═══════════════════════════════════════════════════
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme from localStorage, default to dark
const savedTheme = localStorage.getItem('sa-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next    = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('sa-theme', next);
});

// ═══════════════════════════════════════════════════
// PROFILE PHOTO UPLOAD
// ═══════════════════════════════════════════════════
const photoContainer     = document.getElementById('photoContainer');
const photoInput         = document.getElementById('photoInput');
const heroPhoto          = document.getElementById('heroPhoto');
const photoPlaceholder   = document.getElementById('photoPlaceholder');
const photoChangeOverlay = document.getElementById('photoChangeOverlay');

// Load saved photo from localStorage
const savedPhoto = localStorage.getItem('sa-profile-photo');
if (savedPhoto) {
  applyPhoto(savedPhoto);
}

// Clicking the container triggers file input
photoContainer.addEventListener('click', (e) => {
  // Only if clicking the container itself (not the hidden input which is already on top)
  photoInput.click();
});

photoInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const dataUrl = ev.target.result;
    applyPhoto(dataUrl);
    // Save to localStorage so it persists on refresh
    try {
      localStorage.setItem('sa-profile-photo', dataUrl);
    } catch (err) {
      // localStorage may be full for large images — fail silently
      console.warn('Could not save photo to localStorage:', err);
    }
  };
  reader.readAsDataURL(file);
});

function applyPhoto(src) {
  heroPhoto.src = src;
  heroPhoto.onload = () => {
    heroPhoto.classList.add('loaded');
    photoPlaceholder.style.display = 'none';
    photoContainer.classList.add('has-photo');
  };
}