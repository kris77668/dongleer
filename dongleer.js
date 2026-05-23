// === DONGLEER — Fine Jewellery ===
// Direction A: The Noir  |  Direction B: The Classique

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "A"
}/*EDITMODE-END*/;

let tweaks = { ...TWEAK_DEFAULTS };

// === DOM READY ===
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initHeader();
  initMobileMenu();
  initTweaks();
});

// === SCROLL REVEAL ===
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

// === HEADER SCROLL EFFECT ===
function initHeader() {
  const header = document.getElementById('site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// === MOBILE MENU ===
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobMenu   = document.getElementById('mob-menu');
  const mobClose  = document.getElementById('mob-close');
  if (!hamburger || !mobMenu) return;

  const openMenu = () => {
    mobMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    mobMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openMenu);
  mobClose.addEventListener('click', closeMenu);
  mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// === TWEAKS PANEL ===
function initTweaks() {
  // 1. Register listener FIRST
  window.addEventListener('message', handleMessage);
  // 2. Then announce
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');

  applyTweaks();

  const dirA = document.getElementById('dir-a-btn');
  const dirB = document.getElementById('dir-b-btn');
  const tpClose = document.getElementById('tp-close');
  if (dirA) dirA.addEventListener('click', () => setTweak('direction', 'A'));
  if (dirB) dirB.addEventListener('click', () => setTweak('direction', 'B'));
  // Page-level direction buttons (in footer)
  const pageDirA = document.getElementById('page-dir-a');
  const pageDirB = document.getElementById('page-dir-b');
  if (pageDirA) pageDirA.addEventListener('click', () => setTweak('direction', 'A'));
  if (pageDirB) pageDirB.addEventListener('click', () => setTweak('direction', 'B'));
  if (tpClose) tpClose.addEventListener('click', () => {
    hideTweaks();
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  });
}

function handleMessage(e) {
  if (!e.data || typeof e.data !== 'object') return;
  if (e.data.type === '__activate_edit_mode')   showTweaks();
  if (e.data.type === '__deactivate_edit_mode') hideTweaks();
  if (e.data.type === '__edit_mode_set_keys' && e.data.edits) {
    Object.assign(tweaks, e.data.edits);
    applyTweaks();
  }
}

function setTweak(key, value) {
  tweaks[key] = value;
  applyTweaks();
  window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [key]: value } }, '*');
}

function applyTweaks() {
  document.body.classList.toggle('dir-b', tweaks.direction === 'B');
  const dirA = document.getElementById('dir-a-btn');
  const dirB = document.getElementById('dir-b-btn');
  if (dirA) dirA.classList.toggle('active', tweaks.direction === 'A');
  if (dirB) dirB.classList.toggle('active', tweaks.direction === 'B');
  const pageDirA = document.getElementById('page-dir-a');
  const pageDirB = document.getElementById('page-dir-b');
  if (pageDirA) pageDirA.classList.toggle('active', tweaks.direction === 'A');
  if (pageDirB) pageDirB.classList.toggle('active', tweaks.direction === 'B');
}

function showTweaks() { const p = document.getElementById('tweaks-panel'); if (p) p.style.display = 'block'; }
function hideTweaks()  { const p = document.getElementById('tweaks-panel'); if (p) p.style.display = 'none'; }
