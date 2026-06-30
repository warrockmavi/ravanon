/* RAVANON - Utility Functions */
const Storage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(`ravanon_${key}`);
      return val ? JSON.parse(val) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    localStorage.setItem(`ravanon_${key}`, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('ravanon-update', { detail: { key } }));
  }
};

function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-24 right-4 z-[9999] flex flex-col gap-2';
    document.body.appendChild(container);
  }
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const colors = { success: 'border-gold/50 bg-navy-light', error: 'border-red-500/50 bg-navy-light', info: 'border-rose-gold/50 bg-navy-light' };
  const toast = document.createElement('div');
  toast.className = `toast-item flex items-center gap-3 px-4 py-3 rounded-xl border ${colors[type]} shadow-2xl backdrop-blur-sm transform translate-x-full transition-transform duration-300`;
  toast.innerHTML = `<span class="text-gold text-lg">${icons[type]}</span><span class="text-sm text-cream">${message}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.remove('translate-x-full'));
  setTimeout(() => {
    toast.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function showLoading(show = true) {
  let loader = document.getElementById('global-loader');
  if (!loader && show) {
    loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.className = 'fixed inset-0 z-[9998] bg-navy/80 backdrop-blur-sm flex items-center justify-center';
    loader.innerHTML = `<div class="flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin"></div>
      <p class="text-gold text-sm tracking-widest uppercase">Yükleniyor...</p>
    </div>`;
    document.body.appendChild(loader);
  } else if (loader) {
    loader.style.display = show ? 'flex' : 'none';
    if (!show) loader.remove();
  }
}

function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function generateOrderId() {
  return 'RVN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function animateCounter(el, target, duration = 1000) {
  const start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
}

function scrollToHash(hash, behavior = 'smooth') {
  const id = (hash || window.location.hash || '').replace('#', '');
  if (!id) return;
  const target = document.getElementById(id);
  if (!target) return;
  const header = document.querySelector('header');
  const offset = (header?.offsetHeight || 120) + 16;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
  window.scrollTo({ top, behavior });
}

function initHashScroll(delay = 0) {
  const run = () => {
    if (window.location.hash) scrollToHash(window.location.hash, 'auto');
  };
  if (delay > 0) setTimeout(run, delay);
  else run();
  if (!window._ravanonHashScrollBound) {
    window._ravanonHashScrollBound = true;
    window.addEventListener('hashchange', () => scrollToHash());
  }
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) html += '<span class="text-gold">★</span>';
    else if (i === full && half) html += '<span class="text-gold">★</span>';
    else html += '<span class="text-white/20">★</span>';
  }
  return html;
}