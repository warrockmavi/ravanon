/* RAVANON — Watsons katalog görüntüleyici */
const CatalogViewer = {
  PAGES_DIR: 'assets/catalogs/pages',
  PDF_URL: 'assets/catalogs/watsons-haziran-2026.pdf',
  manifest: null,
  page: 1,
  total: 51,
  scale: 1,
  mode: 'pages',

  pageUrl(n) {
    return `${this.PAGES_DIR}/page-${String(n).padStart(3, '0')}.png`;
  },

  async init() {
    try {
      initSharedUI('katalog');
      this.bindControls();
      await this.loadManifest();
      if (this.manifest?.totalPages) {
        this.total = this.manifest.totalPages;
        this.showPagesMode();
        await this.loadPage(1);
      } else {
        this.showError('Sayfa görselleri bulunamadı. scripts\\render-catalog-pages.js çalıştırın.');
      }
    } catch (err) {
      console.error('[Katalog]', err);
      this.showError('Katalog başlatılamadı: ' + (err.message || err));
    }
  },

  async loadManifest() {
    const res = await fetch(`${this.PAGES_DIR}/manifest.json?t=${Date.now()}`);
    if (!res.ok) return;
    this.manifest = await res.json();
  },

  hideLoading() {
    document.getElementById('pdf-loading')?.classList.add('hidden');
  },

  showPagesMode() {
    this.hideLoading();
    this.mode = 'pages';
    const view = document.getElementById('view-pages');
    view?.classList.remove('hidden');
    view?.classList.add('flex');
    document.getElementById('view-native')?.classList.add('hidden');
    document.getElementById('view-book')?.classList.add('hidden');
    document.getElementById('pdf-error')?.classList.add('hidden');
    document.getElementById('page-total').textContent = this.total;
    const slider = document.getElementById('page-slider');
    if (slider) { slider.max = this.total; slider.value = this.page; }
    document.getElementById('btn-mode-pages')?.classList.add('bg-gold', 'text-navy');
    document.getElementById('btn-mode-native')?.classList.remove('bg-gold', 'text-navy');
  },

  loadPage(n) {
    if (n < 1 || n > this.total) return Promise.resolve();
    this.page = n;
    document.getElementById('page-current').textContent = n;
    document.getElementById('page-slider').value = n;

    const img = document.getElementById('catalog-page-img');
    const spin = document.getElementById('page-loading');
    if (!img) return Promise.resolve();

    spin?.classList.remove('hidden');
    img.style.opacity = '0.4';

    return new Promise((resolve) => {
      img.onload = () => {
        img.style.opacity = '1';
        img.style.transform = `scale(${this.scale})`;
        spin?.classList.add('hidden');
        resolve();
      };
      img.onerror = () => {
        spin?.classList.add('hidden');
        this.showError(`Sayfa ${n} yüklenemedi (${this.pageUrl(n)})`);
        resolve();
      };
      img.src = `${this.pageUrl(n)}?t=${Date.now()}`;
      this.preload(n + 1);
      this.preload(n - 1);
    });
  },

  preload(n) {
    if (n < 1 || n > this.total) return;
    const i = new Image();
    i.src = this.pageUrl(n);
  },

  go(n) {
    if (this.mode === 'pages') this.loadPage(n);
  },

  bindControls() {
    document.getElementById('btn-mode-pages')?.addEventListener('click', () => {
      if (this.manifest) { this.showPagesMode(); this.loadPage(this.page); }
    });
    document.getElementById('btn-mode-native')?.addEventListener('click', () => this.showNativeMode());
    document.getElementById('btn-prev')?.addEventListener('click', () => this.go(this.page - 1));
    document.getElementById('btn-next')?.addEventListener('click', () => this.go(this.page + 1));
    document.getElementById('page-slider')?.addEventListener('input', (e) => this.go(Number(e.target.value)));
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => {
      this.scale = Math.min(2, this.scale + 0.15);
      const img = document.getElementById('catalog-page-img');
      if (img) img.style.transform = `scale(${this.scale})`;
      document.getElementById('zoom-label').textContent = Math.round(this.scale * 100) + '%';
    });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => {
      this.scale = Math.max(0.6, this.scale - 0.15);
      const img = document.getElementById('catalog-page-img');
      if (img) img.style.transform = `scale(${this.scale})`;
      document.getElementById('zoom-label').textContent = Math.round(this.scale * 100) + '%';
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.go(this.page - 1);
      if (e.key === 'ArrowRight') this.go(this.page + 1);
    });
    const area = document.getElementById('view-pages');
    let touchX = 0;
    area?.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].screenX; }, { passive: true });
    area?.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchX;
      if (dx > 60) this.go(this.page - 1);
      if (dx < -60) this.go(this.page + 1);
    }, { passive: true });
  },

  showNativeMode() {
    this.hideLoading();
    this.mode = 'native';
    document.getElementById('view-pages')?.classList.add('hidden');
    document.getElementById('view-pages')?.classList.remove('flex');
    document.getElementById('view-native')?.classList.remove('hidden');
    document.getElementById('pdf-error')?.classList.add('hidden');
    document.getElementById('btn-mode-native')?.classList.add('bg-gold', 'text-navy');
    document.getElementById('btn-mode-pages')?.classList.remove('bg-gold', 'text-navy');
    const embed = document.getElementById('pdf-embed');
    if (embed && !embed.getAttribute('src')) embed.setAttribute('src', this.PDF_URL);
  },

  showError(msg) {
    this.hideLoading();
    document.getElementById('view-pages')?.classList.add('hidden');
    document.getElementById('view-native')?.classList.add('hidden');
    const el = document.getElementById('pdf-error-msg');
    if (el) el.textContent = msg;
    document.getElementById('pdf-error')?.classList.remove('hidden');
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CatalogViewer.init());
} else {
  CatalogViewer.init();
}