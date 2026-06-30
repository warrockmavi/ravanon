/* RAVANON — Watsons katalog görüntüleyici (görsel tabanlı) */
const CatalogViewer = {
  PDF_URL: 'assets/catalogs/watsons-haziran-2026.pdf',
  PAGES_DIR: 'assets/catalogs/pages',
  manifest: null,
  page: 1,
  total: 51,
  scale: 1,
  mode: 'pages',
  preloading: new Set(),

  async init() {
    initSharedUI('katalog');
    this.bindControls();
    await this.loadManifest();
    if (this.manifest) {
      this.total = this.manifest.totalPages;
      this.showPages();
      await this.showPage(1);
      this.preloadAround(1);
    } else {
      await this.tryPdfJsStream();
    }
  },

  async loadManifest() {
    try {
      const res = await fetch(this.PAGES_DIR + '/manifest.json?t=' + Date.now());
      if (!res.ok) return;
      this.manifest = await res.json();
      const test = await fetch(this.pageUrl(1), { method: 'HEAD' });
      if (!test.ok) {
        this.manifest = null;
        return;
      }
    } catch {
      this.manifest = null;
    }
  },

  pageUrl(n) {
    return `${this.PAGES_DIR}/page-${String(n).padStart(3, '0')}.png`;
  },

  showPages() {
    this.mode = 'pages';
    document.getElementById('view-pages')?.classList.remove('hidden');
    document.getElementById('view-native')?.classList.add('hidden');
    document.getElementById('view-book')?.classList.add('hidden');
    document.getElementById('pdf-loading')?.classList.add('hidden');
    document.getElementById('pdf-error')?.classList.add('hidden');
    document.getElementById('catalog-toolbar')?.classList.remove('hidden');
    document.getElementById('page-total').textContent = this.total;
    const slider = document.getElementById('page-slider');
    if (slider) { slider.max = this.total; slider.value = 1; }
    document.getElementById('btn-mode-pages')?.classList.add('bg-gold', 'text-navy');
    document.getElementById('btn-mode-pages')?.classList.remove('text-cream/70');
    document.getElementById('btn-mode-native')?.classList.remove('bg-gold', 'text-navy');
    document.getElementById('btn-mode-native')?.classList.add('text-cream/70');
  },

  async showPage(n) {
    if (n < 1 || n > this.total) return;
    this.page = n;
    document.getElementById('page-current').textContent = n;
    document.getElementById('page-slider').value = n;
    const img = document.getElementById('catalog-page-img');
    const loading = document.getElementById('page-loading');
    if (!img) return;

    loading?.classList.remove('hidden');
    img.style.opacity = '0.3';

    const url = this.pageUrl(n);
    await new Promise((resolve, reject) => {
      const tmp = new Image();
      tmp.onload = () => {
        img.src = url + '?t=' + Date.now();
        img.onload = () => {
          img.style.opacity = '1';
          img.style.transform = `scale(${this.scale})`;
          loading?.classList.add('hidden');
          resolve();
        };
        img.onerror = reject;
      };
      tmp.onerror = reject;
      tmp.src = url;
    }).catch(() => {
      loading?.classList.add('hidden');
      this.showError(`Sayfa ${n} yüklenemedi. scripts\\render-catalog-pages.js çalıştırın.`);
    });

    this.preloadAround(n);
  },

  preloadAround(n) {
    [n - 1, n + 1, n + 2].forEach((p) => {
      if (p < 1 || p > this.total || this.preloading.has(p)) return;
      this.preloading.add(p);
      const i = new Image();
      i.src = this.pageUrl(p);
    });
  },

  bindControls() {
    document.getElementById('btn-mode-pages')?.addEventListener('click', () => {
      if (this.manifest) this.showPages();
      else this.init();
    });
    document.getElementById('btn-mode-native')?.addEventListener('click', () => this.showNative());
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
    let touchX = 0;
    const area = document.getElementById('view-pages');
    area?.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].screenX; }, { passive: true });
    area?.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - touchX;
      if (dx > 50) this.go(this.page - 1);
      if (dx < -50) this.go(this.page + 1);
    }, { passive: true });
  },

  go(n) {
    if (this.mode === 'pages') this.showPage(n);
    else if (this.pdf) this.renderPdfPage(n);
  },

  showNative() {
    this.mode = 'native';
    document.getElementById('view-pages')?.classList.add('hidden');
    document.getElementById('view-native')?.classList.remove('hidden');
    document.getElementById('view-book')?.classList.add('hidden');
    document.getElementById('btn-mode-native')?.classList.add('bg-gold', 'text-navy');
    document.getElementById('btn-mode-native')?.classList.remove('text-cream/70');
    document.getElementById('btn-mode-pages')?.classList.remove('bg-gold', 'text-navy');
    document.getElementById('btn-mode-pages')?.classList.add('text-cream/70');
    const embed = document.getElementById('pdf-embed');
    if (embed && !embed.src) embed.src = this.PDF_URL + '#view=FitH&toolbar=1';
  },

  async tryPdfJsStream() {
    document.getElementById('pdf-loading')?.classList.remove('hidden');
    document.getElementById('view-pages')?.classList.add('hidden');
    try {
      if (typeof pdfjsLib === 'undefined') throw new Error('PDF.js yok');
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/vendor/pdf.worker.min.js';
      const task = pdfjsLib.getDocument({
        url: this.PDF_URL,
        rangeChunkSize: 65536,
        disableAutoFetch: false,
        disableStream: false,
      });
      this.pdf = await task.promise;
      this.total = this.pdf.numPages;
      document.getElementById('page-total').textContent = this.total;
      document.getElementById('pdf-loading')?.classList.add('hidden');
      document.getElementById('view-book')?.classList.remove('hidden');
      document.getElementById('catalog-toolbar')?.classList.remove('hidden');
      this.mode = 'pdfjs';
      await this.renderPdfPage(1);
    } catch (e) {
      document.getElementById('pdf-loading')?.classList.add('hidden');
      this.showError('Görseller henüz hazır değil. scripts\\render-catalog-pages.js çalıştırılıyor olabilir — birkaç dakika sonra yenileyin.');
      console.error('[Katalog]', e);
    }
  },

  async renderPdfPage(n) {
    if (!this.pdf || n < 1 || n > this.total) return;
    this.page = n;
    document.getElementById('page-current').textContent = n;
    document.getElementById('page-slider').value = n;
    const pg = await this.pdf.getPage(n);
    const canvas = document.getElementById('pdf-canvas');
    const ctx = canvas.getContext('2d');
    const vp = pg.getViewport({ scale: 1.2 * this.scale });
    canvas.width = vp.width;
    canvas.height = vp.height;
    await pg.render({ canvasContext: ctx, viewport: vp }).promise;
  },

  showError(msg) {
    document.getElementById('pdf-loading')?.classList.add('hidden');
    document.getElementById('view-pages')?.classList.add('hidden');
    document.getElementById('view-native')?.classList.add('hidden');
    document.getElementById('view-book')?.classList.add('hidden');
    const errMsg = document.getElementById('pdf-error-msg');
    if (errMsg) errMsg.textContent = msg;
    document.getElementById('pdf-error')?.classList.remove('hidden');
  }
};

document.addEventListener('DOMContentLoaded', () => CatalogViewer.init());