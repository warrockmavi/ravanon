/* RAVANON — Collection Promo Films */
const CollectionPromo = {
  active: false,
  timer: null,
  sceneTimers: [],

  films: {
    'viral-tiktok': {
      title: 'Viral TikTok',
      duration: 14000,
      scenes: [
        { at: 0, id: 'intro', duration: 2800 },
        { at: 2800, id: 'hashtag', duration: 2600 },
        { at: 5400, id: 'products', duration: 4200 },
        { at: 9600, id: 'cta', duration: 4400 }
      ]
    }
  },

  shouldPlay(collectionId) {
    if (collectionId !== 'viral-tiktok') return false;
    const skip = getQueryParam('skipPromo');
    if (skip === '1') return false;
    return true;
  },

  getViralProducts() {
    const col = getCollectionById('viral-tiktok');
    return getCollectionProducts(col).slice(0, 6);
  },

  buildTheater(collectionId) {
    const film = this.films[collectionId];
    if (!film) return '';
    const products = this.getViralProducts();

    return `<div id="promo-theater" class="promo-theater" role="dialog" aria-label="TikTok Viral tanıtım">
      <div class="promo-theater-backdrop"></div>
      <div class="promo-player">
        <button type="button" class="promo-skip" onclick="CollectionPromo.close()" aria-label="Atla">Atla ✕</button>
        <button type="button" class="promo-mute" onclick="CollectionPromo.toggleMute(this)" aria-label="Ses">🔇</button>

        <div class="promo-screen">
          <!-- Scene 1: Intro glitch -->
          <div class="promo-scene promo-scene--intro active" data-scene="intro">
            <div class="promo-glitch-bg"></div>
            <div class="promo-scanlines"></div>
            <div class="promo-intro-logo">
              <svg width="72" height="72" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#010101"/><path d="M28 10v17.5a5.5 5.5 0 1 1-4-5.2V14.5c3.2 0 5.8-1.2 8-3.5l-4-1z" fill="#25F4EE" transform="translate(1,-1)"/><path d="M28 10v17.5a5.5 5.5 0 1 1-4-5.2V14.5c3.2 0 5.8-1.2 8-3.5l-4-1z" fill="#FE2C55"/></svg>
            </div>
            <p class="promo-intro-text promo-glitch-text">RAVANON</p>
            <p class="promo-intro-sub">presents</p>
          </div>

          <!-- Scene 2: Hashtag storm -->
          <div class="promo-scene promo-scene--hashtag" data-scene="hashtag">
            <div class="promo-hashtag-bg"></div>
            <div class="promo-hashtag-cloud">
              <span class="ht ht1">#beautytok</span>
              <span class="ht ht2">#viral</span>
              <span class="ht ht3">#grwm</span>
              <span class="ht ht4">#fyp</span>
              <span class="ht ht5">#softglam</span>
              <span class="ht ht6">#RAVANON</span>
            </div>
            <p class="promo-hashtag-main">#beautytok</p>
            <p class="promo-hashtag-views">▶ 12.8M görüntülenme bu hafta</p>
          </div>

          <!-- Scene 3: Product flash montage -->
          <div class="promo-scene promo-scene--products" data-scene="products">
            <div class="promo-products-bg"></div>
            <p class="promo-products-label">VIRAL FAVORİLER</p>
            <div class="promo-product-montage">
              ${products.map((p, i) => `
                <div class="promo-product-flash" style="animation-delay:${i * 0.35}s">
                  <div class="promo-product-thumb">${getProductImageHTML(p, 'mini')}</div>
                  <p class="promo-product-name">${p.name}</p>
                  <span class="promo-product-views">${(p.reviews / 1000).toFixed(1)}M ♥</span>
                </div>`).join('')}
            </div>
            <div class="promo-ticker">
              <div class="promo-ticker-inner">
                <span>★ RAVANON Lip Oil — 3.8M TikTok</span>
                <span>★ Cloud Blush sold out 2x</span>
                <span>★ Rare Beauty viral edit</span>
                <span>★ RAVANON Lip Oil — 3.8M TikTok</span>
              </div>
            </div>
          </div>

          <!-- Scene 4: CTA -->
          <div class="promo-scene promo-scene--cta" data-scene="cta">
            <div class="promo-cta-bg"></div>
            <p class="promo-cta-badge">2026 VIRAL EDIT</p>
            <h2 class="promo-cta-title">TikTok Viral<br>Koleksiyonu</h2>
            <p class="promo-cta-desc">For You sayfasından sepete — en çok izlenen güzellik ürünleri</p>
            <div class="promo-cta-stats">
              <span><strong>${products.length}+</strong> viral ürün</span>
              <span><strong>4.9</strong> ★ ortalama</span>
            </div>
            <button type="button" class="promo-cta-btn" onclick="CollectionPromo.close()">Kataloğu Keşfet →</button>
          </div>
        </div>

        <div class="promo-progress-wrap">
          <div class="promo-progress-bar" id="promo-progress"></div>
        </div>
        <p class="promo-time" id="promo-time">0:00</p>
      </div>
    </div>`;
  },

  clearSceneTimers() {
    this.sceneTimers.forEach(id => clearTimeout(id));
    this.sceneTimers = [];
  },

  restartSceneAnimations(sceneEl) {
    if (!sceneEl) return;
    sceneEl.querySelectorAll('*').forEach(el => {
      const anim = getComputedStyle(el).animationName;
      if (!anim || anim === 'none') return;
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = '';
    });
  },

  play(collectionId) {
    if (this.active || !this.films[collectionId]) return;
    if (typeof getCollectionById !== 'function' || typeof getProductImageHTML !== 'function') {
      console.error('CollectionPromo: bağımlılıklar yüklenmedi');
      return;
    }

    try {
      this.active = true;
      this.clearSceneTimers();
      document.getElementById('promo-theater')?.remove();
      document.body.insertAdjacentHTML('beforeend', this.buildTheater(collectionId));
      document.body.style.overflow = 'hidden';

      const film = this.films[collectionId];
      const theater = document.getElementById('promo-theater');
      if (!theater) throw new Error('Tiyatro oluşturulamadı');

      const progress = document.getElementById('promo-progress');
      const timeEl = document.getElementById('promo-time');
      const start = Date.now();

      const showScene = (sceneId) => {
        theater.querySelectorAll('.promo-scene').forEach(s => {
          const isActive = s.dataset.scene === sceneId;
          s.classList.toggle('active', isActive);
          if (isActive) this.restartSceneAnimations(s);
        });
      };

      film.scenes.forEach(scene => {
        const id = setTimeout(() => showScene(scene.id), scene.at);
        this.sceneTimers.push(id);
      });

      const tick = () => {
        const elapsed = Date.now() - start;
        const pct = Math.min(100, (elapsed / film.duration) * 100);
        if (progress) progress.style.width = pct + '%';
        if (timeEl) {
          const sec = Math.floor(elapsed / 1000);
          timeEl.textContent = `0:${String(sec).padStart(2, '0')}`;
        }
        if (elapsed >= film.duration) {
          this.close();
          return;
        }
        this.timer = requestAnimationFrame(tick);
      };
      this.timer = requestAnimationFrame(tick);
      requestAnimationFrame(() => this.restartSceneAnimations(theater.querySelector('.promo-scene.active')));
    } catch (err) {
      console.error('CollectionPromo play hatası:', err);
      this.active = false;
      document.body.style.overflow = '';
      document.getElementById('promo-theater')?.remove();
      if (collectionId === 'viral-tiktok') this.showCatalogReel();
    }
  },

  close() {
    if (this.timer) cancelAnimationFrame(this.timer);
    this.timer = null;
    this.clearSceneTimers();
    const theater = document.getElementById('promo-theater');
    if (theater) {
      theater.classList.add('promo-theater--out');
      setTimeout(() => {
        theater.remove();
        document.body.style.overflow = '';
        this.active = false;
        this.showCatalogReel();
      }, 500);
    } else {
      document.body.style.overflow = '';
      this.active = false;
    }
  },

  toggleMute(btn) {
    btn.textContent = btn.textContent === '🔇' ? '🔊' : '🔇';
    showToast('Demo mod — ses yakında!', 'info');
  },

  showCatalogReel() {
    if (document.getElementById('tiktok-catalog-reel')) return;
    const products = this.getViralProducts();
    const main = document.querySelector('main .max-w-7xl');
    if (!main) return;

    const reel = document.createElement('div');
    reel.id = 'tiktok-catalog-reel';
    reel.className = 'tiktok-catalog-reel scroll-animate animate-in';
    reel.innerHTML = `
      <div class="tiktok-reel-inner">
        <div class="tiktok-reel-video">
          <div class="tiktok-reel-poster">
            <div class="tiktok-reel-poster-bg"></div>
            <div class="tiktok-reel-play-ring"></div>
            <button type="button" class="tiktok-reel-replay" onclick="CollectionPromo.replay()" aria-label="Tanıtımı tekrar izle">
              <span class="tiktok-reel-play-icon">▶</span>
            </button>
            <div class="tiktok-reel-live"><span class="live-dot"></span> VIRAL EDIT</div>
            <p class="tiktok-reel-caption">#beautytok · RAVANON 2026</p>
          </div>
          <div class="tiktok-reel-mini-scroll">
            ${products.map(p => `
              <a href="product.html?id=${p.id}" class="tiktok-reel-mini-card">
                <div class="tiktok-reel-mini-img">${getProductImageHTML(p, 'mini')}</div>
                <span>${p.brand}</span>
              </a>`).join('')}
          </div>
        </div>
        <div class="tiktok-reel-info">
          <span class="tiktok-reel-badge">📱 TIKTOK VIRAL</span>
          <h2 class="tiktok-reel-title">For You'da Gördün,<br>Burada Bul</h2>
          <p class="tiktok-reel-desc">Milyonlarca izlenen RAVANON ürünleri — Lip Oil, Cloud Blush, Rare Beauty ve daha fazlası.</p>
          <div class="tiktok-reel-stats">
            <div><strong>12.8M</strong><span>görüntülenme</span></div>
            <div><strong>${products.length}</strong><span>viral ürün</span></div>
            <div><strong>4.9★</strong><span>puan</span></div>
          </div>
          <button type="button" onclick="CollectionPromo.replay()" class="btn-outline-rose px-5 py-2.5 text-sm rounded-full mt-4">▶ Tanıtım Filmini Tekrar İzle</button>
        </div>
      </div>`;

    const header = main.querySelector('.mb-8');
    if (header) header.after(reel);
    else main.prepend(reel);
  },

  replay() {
    if (this.timer) cancelAnimationFrame(this.timer);
    this.timer = null;
    this.clearSceneTimers();
    document.getElementById('promo-theater')?.remove();
    this.active = false;
    document.body.style.overflow = '';
    setTimeout(() => this.play('viral-tiktok'), 200);
  },

  initForShop(collectionId) {
    if (!this.shouldPlay(collectionId)) {
      if (collectionId === 'viral-tiktok') this.showCatalogReel();
      return;
    }
    setTimeout(() => this.play(collectionId), 400);
  }
};