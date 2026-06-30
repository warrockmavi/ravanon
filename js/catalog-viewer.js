/* RAVANON — Watsons katalog görüntüleyici */
const CatalogViewer = {
  PDF_URL: 'assets/catalogs/watsons-haziran-2026.pdf',
  pdf: null,
  page: 1,
  total: 1,
  scale: 1.0,
  rendering: false,
  mode: 'native',

  async init() {
    initSharedUI('katalog');
    this.bindModeSwitch();
    await this.checkPdf();
    this.showNative();
  },

  async checkPdf() {
    try {
      const res = await fetch(this.PDF_URL, { method: 'HEAD' });
      if (!res.ok) throw new Error('PDF bulunamadı (' + res.status + ')');
    } catch (e) {
      this.showError('Katalog dosyası sunucuda bulunamadı. scripts\\copy-watsons-catalog.bat çalıştırın.');
      console.error('[Katalog]', e);
    }
  },

  showNative() {
    this.mode = 'native';
    document.getElementById('view-native')?.classList.remove('hidden');
    document.getElementById('view-book')?.classList.add('hidden');
    document.getElementById('book-toolbar')?.classList.add('hidden');
    document.getElementById('pdf-loading')?.classList.add('hidden');
    document.getElementById('pdf-error')?.classList.add('hidden');
    document.getElementById('btn-mode-native')?.classList.add('bg-gold', 'text-navy');
    document.getElementById('btn-mode-native')?.classList.remove('text-cream/70');
    document.getElementById('btn-mode-book')?.classList.remove('bg-gold', 'text-navy');
    document.getElementById('btn-mode-book')?.classList.add('text-cream/70');
    const iframe = document.getElementById('pdf-iframe');
    if (iframe && !iframe.src) iframe.src = this.PDF_URL;
  },

  async showBook() {
    this.mode = 'book';
    document.getElementById('view-native')?.classList.add('hidden');
    document.getElementById('view-book')?.classList.remove('hidden');
    document.getElementById('book-toolbar')?.classList.remove('hidden');
    document.getElementById('btn-mode-book')?.classList.add('bg-gold', 'text-navy');
    document.getElementById('btn-mode-book')?.classList.remove('text-cream/70');
    document.getElementById('btn-mode-native')?.classList.remove('bg-gold', 'text-navy');
    document.getElementById('btn-mode-native')?.classList.add('text-cream/70');

    if (!this.pdf) await this.loadPdfJs();
    else await this.render();
  },

  bindModeSwitch() {
    document.getElementById('btn-mode-native')?.addEventListener('click', () => this.showNative());
    document.getElementById('btn-mode-book')?.addEventListener('click', () => this.showBook());
    document.getElementById('btn-prev')?.addEventListener('click', () => this.go(this.page - 1));
    document.getElementById('btn-next')?.addEventListener('click', () => this.go(this.page + 1));
    document.getElementById('page-slider')?.addEventListener('input', (e) => this.go(Number(e.target.value)));
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => { this.scale = Math.min(2.5, this.scale + 0.15); this.render(); });
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => { this.scale = Math.max(0.5, this.scale - 0.15); this.render(); });
    document.addEventListener('keydown', (e) => {
      if (this.mode !== 'book') return;
      if (e.key === 'ArrowLeft') this.go(this.page - 1);
      if (e.key === 'ArrowRight') this.go(this.page + 1);
    });
  },

  async loadPdfJs() {
    const loading = document.getElementById('pdf-loading');
    const errBox = document.getElementById('pdf-error');
    const errMsg = document.getElementById('pdf-error-msg');
    loading?.classList.remove('hidden');
    errBox?.classList.add('hidden');

    try {
      if (typeof pdfjsLib === 'undefined') throw new Error('PDF.js yüklenemedi');

      pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/vendor/pdf.worker.min.js';

      const progressEl = document.getElementById('pdf-progress');
      const res = await fetch(this.PDF_URL);
      if (!res.ok) throw new Error('PDF indirilemedi');

      const reader = res.body?.getReader();
      const total = Number(res.headers.get('content-length')) || 0;
      const chunks = [];
      let loaded = 0;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          loaded += value.length;
          if (total && progressEl) {
            progressEl.textContent = 'İndiriliyor… %' + Math.round((loaded / total) * 100);
          }
        }
      }

      const buf = reader
        ? new Uint8Array(chunks.reduce((acc, c) => { const n = new Uint8Array(acc.length + c.length); n.set(acc); n.set(c, acc.length); return n; }, new Uint8Array(0)))
        : new Uint8Array(await res.arrayBuffer());

      const task = pdfjsLib.getDocument({ data: buf, disableFontFace: true });
      this.pdf = await task.promise;
      this.total = this.pdf.numPages;
      document.getElementById('page-total').textContent = this.total;
      const slider = document.getElementById('page-slider');
      if (slider) { slider.max = this.total; slider.value = 1; }
      loading?.classList.add('hidden');
      await this.render();
    } catch (e) {
      loading?.classList.add('hidden');
      if (errMsg) errMsg.textContent = e.message || 'Kitap modu yüklenemedi';
      errBox?.classList.remove('hidden');
      console.error('[Katalog PDF.js]', e);
      setTimeout(() => this.showNative(), 1500);
    }
  },

  async go(n) {
    if (!this.pdf || n < 1 || n > this.total || this.rendering) return;
    this.page = n;
    document.getElementById('page-current').textContent = n;
    document.getElementById('page-slider').value = n;
    await this.render();
  },

  async render() {
    if (!this.pdf || this.rendering) return;
    this.rendering = true;
    try {
      const pg = await this.pdf.getPage(this.page);
      const canvas = document.getElementById('pdf-canvas');
      const ctx = canvas.getContext('2d');
      const base = pg.getViewport({ scale: 1 });
      const fitScale = Math.min(1.2, (canvas.parentElement?.clientWidth || 800) / base.width);
      const vp = pg.getViewport({ scale: fitScale * this.scale });
      canvas.width = vp.width;
      canvas.height = vp.height;
      await pg.render({ canvasContext: ctx, viewport: vp }).promise;
      document.getElementById('zoom-label').textContent = Math.round(this.scale * 100) + '%';
    } catch (e) {
      console.error('[Katalog render]', e);
    }
    this.rendering = false;
  },

  showError(msg) {
    document.getElementById('pdf-loading')?.classList.add('hidden');
    document.getElementById('view-native')?.classList.add('hidden');
    document.getElementById('view-book')?.classList.add('hidden');
    const errBox = document.getElementById('pdf-error');
    const errMsg = document.getElementById('pdf-error-msg');
    if (errMsg) errMsg.textContent = msg;
    errBox?.classList.remove('hidden');
  }
};

document.addEventListener('DOMContentLoaded', () => CatalogViewer.init());