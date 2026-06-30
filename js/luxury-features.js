/* RAVANON - Luxury UX & 2026 Industry Features */
const LUXURY_FEATURES = {
  trends2026: [
    { id: 'skinimalism', title: 'Skinimalism 2.0', desc: 'Az ürün, maksimum etki — minimal ama güçlü rutinler', icon: '✦', tag: 'Trend' },
    { id: 'ai-skin', title: 'AI Cilt Analizi', desc: 'Sephora & Ulta tarzı kişisel cilt teşhisi ve rutin önerisi', icon: '🤖', tag: 'AI' },
    { id: 'glass-skin', title: 'Glass Skin', desc: 'Cam gibi parlak, nemli ve aydınlık cilt görünümü', icon: '💎', tag: 'K-Beauty' },
    { id: 'refill', title: 'Refill & Sürdürülebilirlik', desc: 'Doldurulabilir ambalajlar ve çevre dostu güzellik', icon: '🌿', tag: 'Eco' },
    { id: 'vto', title: 'Sanal Deneme', desc: 'AR destekli makyaj ve renk deneme deneyimi', icon: '📷', tag: 'AR' },
    { id: 'peptide', title: 'Peptit & Biyomimetik', desc: 'Bilim destekli anti-aging — 2026\'nın en çok aranan içerikleri', icon: '🧬', tag: 'Bilim' }
  ],

  socialProof: [
    { name: 'Elif K.', city: 'İstanbul', product: 'COSRX Snail Essence' },
    { name: 'Zeynep A.', city: 'Ankara', product: 'RAVANON Cloud Allık' },
    { name: 'Merve D.', city: 'İzmir', product: 'Beauty of Joseon SPF' },
    { name: 'Selin Y.', city: 'Bursa', product: 'RAVANON Lip Oil' },
    { name: 'Ayşe T.', city: 'İstanbul', product: 'RAVANON Cilt Seti' },
    { name: 'Deniz M.', city: 'Antalya', product: 'Laneige Uyku Maskesi' },
    { name: 'Ceren B.', city: 'İstanbul', product: 'Anua Heartleaf Toner' },
    { name: 'Ece S.', city: 'Eskişehir', product: 'RAVANON Glow Toner' },
    { name: 'Buse K.', city: 'İzmir', product: 'Torriden Hyaluronic Serum' },
    { name: 'İrem Y.', city: 'Ankara', product: 'SKIN1004 Centella Ampul' },
    { name: 'Gizem A.', city: 'İstanbul', product: 'RAVANON Sleeping Mask' },
    { name: 'Sude N.', city: 'Bursa', product: 'Rare Beauty Allık' },
    { name: 'Melis T.', city: 'İzmir', product: 'RAVANON Pimple Patch' },
    { name: 'Yasemin D.', city: 'Trabzon', product: 'Charlotte Tilbury Ruj' },
    { name: 'Defne E.', city: 'İstanbul', product: 'RAVANON Retinol Serum' },
    { name: 'Nazlı H.', city: 'Adana', product: 'COSRX Snail Krem' },
    { name: 'Pınar C.', city: 'Ankara', product: 'Vitamin C Serum' },
    { name: 'Aslı R.', city: 'İstanbul', product: 'RAVANON Rice Cleansing Oil' },
    { name: 'Tuğba L.', city: 'Konya', product: 'Innisfree Yeşil Çay Serum' },
    { name: 'Cansu Ö.', city: 'İzmir', product: 'RAVANON Body Glitter Mist' },
    { name: 'Dilara F.', city: 'İstanbul', product: 'Beauty of Joseon Leke Serumu' },
    { name: 'Esra G.', city: 'Gaziantep', product: 'RAVANON Brow Gel' },
    { name: 'Hande P.', city: 'İstanbul', product: 'NARS Kapatıcı' },
    { name: 'Kübra V.', city: 'Ankara', product: 'Round Lab Dokdo Temizleyici' },
    { name: 'Leyla Z.', city: 'İzmir', product: 'RAVANON Makyaj Seti' },
    { name: 'Özge W.', city: 'İstanbul', product: 'Fenty Beauty Fondöten' },
    { name: 'Simge J.', city: 'Bursa', product: 'CeraVe Nemlendirici' },
    { name: 'Burcu Q.', city: 'İstanbul', product: 'Sol de Janeiro Vücut Spreyi' },
    { name: 'Ebru U.', city: 'Eskişehir', product: 'RAVANON Setting Spray' },
    { name: 'Fatma İ.', city: 'Ankara', product: 'Maybelline Maskara' },
    { name: 'Hilal X.', city: 'İzmir', product: 'Drunk Elephant Peptit Krem' },
    { name: 'Jale Ç.', city: 'İstanbul', product: 'RAVANON K-Beauty Bundle' },
    { name: 'Seda Ş.', city: 'Bursa', product: 'NYX Dudak Parlatıcısı' },
    { name: 'Lara Ö.', city: 'İstanbul', product: 'La Roche-Posay SPF50+' },
    { name: 'Mina A.', city: 'Antalya', product: 'RAVANON Cherry Lip Oil' }
  ],

  flashSaleEnd: Date.now() + 1000 * 60 * 60 * 8 + 1000 * 60 * 32 + 1000 * 17,

  sustainability: [
    { label: 'Vegan Formüller', value: '68%', icon: '🌱' },
    { label: 'Cruelty-Free', value: '92%', icon: '🐰' },
    { label: 'Geri Dönüştürülebilir', value: '74%', icon: '♻️' },
    { label: 'Refill Seçenekleri', value: '24 ürün', icon: '🔄' }
  ]
};

const LuxuryUX = {
  init() {
    this.initScrollHeader();
    this.initSocialProof();
    this.initFlashCountdown();
    this.initTrendsSection();
    this.initSustainability();
    this.initRecentlyViewed();
    this.initCursorGlow();
    this.trackProductView();
  },

  initScrollHeader() {
    const header = document.querySelector('header');
    if (!header) return;
    header.classList.add('luxury-header');
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('header-scrolled', y > 40);
      header.classList.toggle('header-hidden', y > last && y > 200);
      last = y;
    }, { passive: true });
  },

  initSocialProof() {
    const el = document.getElementById('social-proof-ticker');
    if (!el) return;
    const times = ['az önce', '1 dk önce', '2 dk önce', '3 dk önce', '5 dk önce', '7 dk önce', '8 dk önce', '10 dk önce', '12 dk önce', '15 dk önce', '18 dk önce', '22 dk önce'];
    const items = [...LUXURY_FEATURES.socialProof].sort(() => Math.random() - 0.5);
    let idx = 0;
    const show = () => {
      const item = items[idx % items.length];
      const time = item.time || times[idx % times.length];
      el.innerHTML = `<span class="live-dot"></span><span><strong>${item.name}</strong> (${item.city}) <span class="text-gold">${item.product}</span> satın aldı · ${time}</span>`;
      el.classList.remove('opacity-0', 'translate-y-2');
      setTimeout(() => el.classList.add('opacity-0', 'translate-y-2'), 3000);
      idx++;
    };
    show();
    setInterval(show, 3400);
  },

  initFlashCountdown() {
    const box = document.getElementById('flash-countdown');
    if (!box) return;
    const tick = () => {
      const diff = Math.max(0, LUXURY_FEATURES.flashSaleEnd - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      box.querySelector('[data-h]').textContent = String(h).padStart(2, '0');
      box.querySelector('[data-m]').textContent = String(m).padStart(2, '0');
      box.querySelector('[data-s]').textContent = String(s).padStart(2, '0');
    };
    tick();
    setInterval(tick, 1000);
  },

  initTrendsSection() {
    const grid = document.getElementById('trends-2026-grid');
    if (!grid) return;
    grid.innerHTML = LUXURY_FEATURES.trends2026.map(t => `
      <article class="luxury-trend-card group scroll-animate">
        <div class="luxury-trend-glow"></div>
        <span class="luxury-tag">${t.tag}</span>
        <span class="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-500">${t.icon}</span>
        <h3 class="font-display text-xl text-cream mb-2 group-hover:text-gold transition-colors">${t.title}</h3>
        <p class="text-cream/50 text-sm leading-relaxed">${t.desc}</p>
        ${t.id === 'ai-skin' ? '<button onclick="SkinQuiz.open()" class="mt-4 text-xs text-gold hover:underline">Analizi Başlat →</button>' : ''}
        ${t.id === 'vto' ? '<a href="shop.html?category=makyaj" class="mt-4 text-xs text-gold hover:underline inline-block">Makyajı Dene →</a>' : ''}
      </article>`).join('');
    initScrollAnimations();
  },

  initSustainability() {
    const grid = document.getElementById('sustainability-grid');
    if (!grid) return;
    grid.innerHTML = LUXURY_FEATURES.sustainability.map(s => `
      <div class="luxury-stat-card scroll-animate">
        <span class="text-2xl">${s.icon}</span>
        <p class="text-2xl font-display text-gold mt-2">${s.value}</p>
        <p class="text-xs text-cream/50 mt-1 uppercase tracking-wider">${s.label}</p>
      </div>`).join('');
    initScrollAnimations();
  },

  initRecentlyViewed() {
    const section = document.getElementById('recently-viewed-section');
    const grid = document.getElementById('recently-viewed-grid');
    if (!section || !grid) return;
    const viewed = Storage.get('recentlyViewed', []);
    if (!viewed.length) { section.classList.add('hidden'); return; }
    const products = viewed.map(id => getProductById(id)).filter(Boolean).slice(0, 4);
    if (!products.length) { section.classList.add('hidden'); return; }
    section.classList.remove('hidden');
    grid.innerHTML = products.map(p => renderProductCard(p)).join('');
    initScrollAnimations();
  },

  trackProductView() {
    const id = getQueryParam('id');
    if (!id || !window.location.pathname.includes('product')) return;
    let viewed = Storage.get('recentlyViewed', []);
    viewed = [Number(id), ...viewed.filter(v => v !== Number(id))].slice(0, 8);
    Storage.set('recentlyViewed', viewed);
  },

  initCursorGlow() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  },

  getAIMatchScore(product, user) {
    let score = 72 + (product.id % 23);
    const quiz = Storage.get('quizResults', null);
    if (quiz?.answers?.skinType && product.skinType?.includes(quiz.answers.skinType)) score += 12;
    if (user) score += 5;
    return Math.min(98, score);
  }
};

