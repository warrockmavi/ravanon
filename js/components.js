/* RAVANON - Shared UI Components */
function renderProductCard(product, options = {}) {
  const { listView = false, showQuickAdd = true } = options;
  const inWishlist = Wishlist.has(product.id);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  if (listView) {
    return `<div class="product-card-list flex gap-4 p-4 bg-navy-light rounded-xl border border-gold/10 hover:border-gold/30 transition-all duration-300 scroll-animate" data-id="${product.id}">
      <a href="product.html?id=${product.id}" class="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">${getProductImageHTML(product, 'thumb')}</a>
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gold/70 uppercase tracking-wider">${product.brand}</p>
        <a href="product.html?id=${product.id}" class="text-cream font-medium hover:text-gold transition-colors">${product.name}</a>
        <div class="flex items-center gap-1 mt-1 text-xs">${renderStars(product.rating)} <span class="text-cream/40">(${product.reviews})</span></div>
        <div class="flex flex-wrap gap-1 mt-2">${product.vegan ? '<span class="text-[10px] px-2 py-0.5 bg-green-900/30 text-green-400 rounded-full">Vegan</span>' : ''}${product.crueltyFree ? '<span class="text-[10px] px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded-full">Cruelty-Free</span>' : ''}</div>
      </div>
      <div class="flex flex-col items-end justify-between flex-shrink-0">
        <button onclick="Wishlist.toggle(${product.id});this.closest('.product-card-list').querySelector('.wish-btn').classList.toggle('text-rose-gold')" class="wish-btn text-cream/30 hover:text-rose-gold transition-colors ${inWishlist ? 'text-rose-gold' : ''}">♥</button>
        <div class="text-right">
          ${product.originalPrice ? `<p class="text-xs text-cream/40 line-through">${formatPrice(product.originalPrice)}</p>` : ''}
          <p class="text-gold font-semibold">${formatPrice(product.price)}</p>
        </div>
        ${showQuickAdd ? `<button onclick="Cart.add(${product.id})" class="mt-2 text-xs px-4 py-2 bg-gold text-navy rounded-lg font-semibold hover:bg-gold-light transition-colors">Sepete Ekle</button>` : ''}
      </div>
    </div>`;
  }

  const ravanonLabel = typeof getRavanonLabel === 'function' ? getRavanonLabel(product) : product.brand;
  const aiScore = typeof LuxuryUX !== 'undefined' ? LuxuryUX.getAIMatchScore(product, Auth.getUser()) : null;

  return `<div class="product-card group scroll-animate" data-id="${product.id}">
    <div class="luxury-product-card relative">
      <a href="product.html?id=${product.id}" class="block overflow-hidden relative">
        ${getProductImageHTML(product, 'thumb')}
        ${aiScore ? `<span class="ai-match-badge">✨ %${aiScore} Uyum</span>` : ''}
        <div class="quick-action-bar">
          <button onclick="event.preventDefault();Cart.add(${product.id})" class="quick-action-btn">Sepete Ekle</button>
          <button onclick="event.preventDefault();AIChat.toggle(true)" class="quick-action-btn">AI Sor</button>
        </div>
      </a>
      <button onclick="Wishlist.toggle(${product.id});this.classList.toggle('text-rose-gold')" class="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-gold/20 flex items-center justify-center text-cream/50 hover:text-rose-gold hover:border-rose-gold/50 transition-all z-20 ${inWishlist ? 'text-rose-gold border-rose-gold/50' : ''}">♥</button>
      <div class="p-5">
        <p class="luxury-product-label mb-1">${ravanonLabel}</p>
        <p class="text-[10px] text-cream/35 mb-2">${product.brand}</p>
        <a href="product.html?id=${product.id}" class="font-display text-base text-cream leading-snug hover:text-gold transition-colors line-clamp-2 block mb-3">${product.name}</a>
        <div class="flex items-center gap-1 text-xs mb-4">${renderStars(product.rating)} <span class="text-cream/30 ml-1">(${product.reviews.toLocaleString('tr-TR')})</span></div>
        <div class="flex items-center justify-between pt-3 border-t border-gold/10">
          <div>
            ${product.originalPrice ? `<span class="text-xs text-cream/35 line-through mr-1">${formatPrice(product.originalPrice)}</span>` : ''}
            <span class="text-gold font-semibold text-lg">${formatPrice(product.price)}</span>
            ${discount ? `<span class="text-xs text-rose-gold ml-1 font-medium">-${discount}%</span>` : ''}
          </div>
          <button onclick="Cart.add(${product.id})" class="w-9 h-9 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 text-gold flex items-center justify-center hover:bg-gold hover:text-navy transition-all" title="Sepete Ekle">+</button>
        </div>
      </div>
    </div>
  </div>`;
}

function renderHeader(activePage = '') {
  const user = Auth.getUser();
  return `<header class="fixed top-0 left-0 right-0 z-[8000] bg-navy/80 backdrop-blur-md border-b border-gold/10 luxury-header">
    <div class="luxury-announce py-2 text-center">
      <p class="text-xs text-cream/70 tracking-[0.2em] uppercase">750 TL+ <span class="text-gold font-medium">Ücretsiz Kargo</span> · Club <span class="text-gold">Gold</span> üyelere öncelikli teslimat</p>
    </div>
    <div id="social-proof-ticker" class="hidden md:block text-center py-1.5 text-xs text-cream/50 border-b border-gold/5 transition-all duration-500"></div>
    <nav class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between gap-4">
        <a href="index.html" class="flex items-center gap-2 group">
          <span class="text-2xl font-light tracking-[0.3em] text-gold group-hover:text-gold-light transition-colors">RAVANON</span>
        </a>
        <div class="hidden md:flex items-center gap-8">
          <a href="shop.html" class="nav-link text-sm ${activePage === 'shop' ? 'text-gold' : 'text-cream/70 hover:text-gold'} transition-colors">Mağaza</a>
          <a href="katalog.html" class="nav-link text-sm ${activePage === 'katalog' ? 'text-gold' : 'text-cream/70 hover:text-gold'} transition-colors">Katalog</a>
          <a href="index.html#koleksiyonlar" class="nav-link text-sm text-cream/70 hover:text-gold transition-colors">Koleksiyonlar</a>
          <a href="shop.html?filter=new" class="nav-link text-sm text-cream/70 hover:text-gold transition-colors">Yeni Gelenler</a>
          <a href="shop.html?filter=flash" class="nav-link text-sm text-cream/70 hover:text-gold transition-colors">Flaş İndirimler</a>
          <a href="club.html" class="nav-link text-sm ${activePage === 'club' ? 'text-gold' : 'text-cream/70 hover:text-gold'} transition-colors">RAVANON Club</a>
          <a href="index.html#uzman" class="nav-link text-sm text-cream/70 hover:text-gold transition-colors">Uzman Tavsiyeleri</a>
        </div>
        <div class="flex items-center gap-3">
          <button onclick="document.getElementById('search-modal')?.classList.remove('hidden')" class="text-cream/60 hover:text-gold transition-colors p-2" aria-label="Ara">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
          <a href="account.html" class="text-cream/60 hover:text-gold transition-colors p-2 relative flex items-center gap-1" aria-label="Hesabım">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            ${user ? `<span class="hidden sm:inline text-[10px] text-[#F48FB1] font-medium club-header-points">${(user.points || 0).toLocaleString('tr-TR')}p</span><span class="absolute top-1 right-0 sm:right-auto sm:left-3 w-2 h-2 bg-[#E91E8C] rounded-full"></span>` : ''}
          </a>
          <a href="account.html#wishlist" class="text-cream/60 hover:text-gold transition-colors p-2 relative" aria-label="Favoriler">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            <span class="wishlist-badge absolute -top-1 -right-1 w-5 h-5 bg-rose-gold text-white text-[10px] rounded-full flex items-center justify-center hidden">0</span>
          </a>
          <a href="cart.html" class="text-cream/60 hover:text-gold transition-colors p-2 relative" aria-label="Sepet">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span class="cart-badge absolute -top-1 -right-1 w-5 h-5 bg-gold text-navy text-[10px] font-bold rounded-full flex items-center justify-center hidden">0</span>
          </a>
          <button id="mobile-menu-btn" class="md:hidden text-cream p-2" aria-label="Menü">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>
    </nav>
    <div id="mobile-menu" class="hidden md:hidden bg-navy-light border-t border-gold/10 px-4 py-4 space-y-3">
      <a href="shop.html" class="block text-cream/80 py-2">Mağaza</a>
      <a href="katalog.html" class="block text-cream/80 py-2">Watsons Kataloğu</a>
      <a href="shop.html?filter=new" class="block text-cream/80 py-2">Yeni Gelenler</a>
      <a href="shop.html?filter=flash" class="block text-cream/80 py-2">Flaş İndirimler</a>
      <a href="club.html" class="block text-cream/80 py-2">RAVANON Club</a>
      <a href="index.html#uzman" class="block text-cream/80 py-2">Uzman Tavsiyeleri</a>
      <a href="account.html" class="block text-cream/80 py-2">Hesabım</a>
    </div>
  </header>`;
}

function renderFooter() {
  return `<footer class="bg-navy-light border-t border-gold/10 mt-20">
    <div class="max-w-7xl mx-auto px-4 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h3 class="text-2xl font-light tracking-[0.3em] text-gold mb-4">RAVANON</h3>
          <p class="text-cream/50 text-sm leading-relaxed">Premium güzellik deneyimi. Orijinal ürün garantisi ile Türkiye'nin en güvenilir kozmetik platformu.</p>
          <div class="flex gap-3 mt-6">
            <a href="#" class="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold transition-colors">IG</a>
            <a href="#" class="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold transition-colors">TK</a>
            <a href="#" class="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center text-cream/50 hover:text-gold hover:border-gold transition-colors">YT</a>
          </div>
        </div>
        <div>
          <h4 class="text-cream font-medium mb-4">Alışveriş</h4>
          <ul class="space-y-2 text-sm text-cream/50">
            <li><a href="shop.html" class="hover:text-gold transition-colors">Tüm Ürünler</a></li>
            <li><a href="shop.html?category=makyaj" class="hover:text-gold transition-colors">Makyaj</a></li>
            <li><a href="shop.html?category=cilt-bakimi" class="hover:text-gold transition-colors">Cilt Bakımı</a></li>
            <li><a href="shop.html?filter=flash" class="hover:text-gold transition-colors">Flaş İndirimler</a></li>
            <li><a href="katalog.html" class="hover:text-gold transition-colors">Watsons Kataloğu</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-cream font-medium mb-4">Müşteri Hizmetleri</h4>
          <ul class="space-y-2 text-sm text-cream/50">
            <li><a href="#" class="hover:text-gold transition-colors">Sipariş Takibi</a></li>
            <li><a href="#" class="hover:text-gold transition-colors">İade & Değişim</a></li>
            <li><a href="#" class="hover:text-gold transition-colors">SSS</a></li>
            <li><a href="#" class="hover:text-gold transition-colors">İletişim</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-cream font-medium mb-4">RAVANON Club</h4>
          <p class="text-sm text-cream/50 mb-4">Her alışverişte puan kazanın, özel indirimlerden yararlanın.</p>
          <a href="club.html" class="inline-block px-6 py-2.5 bg-gold text-navy text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors">Club'a Katıl</a>
        </div>
      </div>
      <div class="border-t border-gold/10 mt-12 pt-8 flex flex-col items-center gap-4 text-center">
        <p class="text-xs text-cream/30">© 2026 RAVANON. Tüm hakları saklıdır.</p>
        <p class="footer-credit"><strong>Oğuzhan Mavi Bafralı</strong> tarafından tasarlanmıştır</p>
        <div class="flex gap-6 text-xs text-cream/30">
          <a href="#" class="hover:text-gold">Gizlilik Politikası</a>
          <a href="#" class="hover:text-gold">Kullanım Koşulları</a>
          <a href="#" class="hover:text-gold">KVKK</a>
        </div>
      </div>
    </div>
  </footer>`;
}

function renderCollectionCard(collection) {
  const count = getCollectionProducts(collection).length;
  const cover = typeof CollectionCovers !== 'undefined' ? CollectionCovers.getCover(collection.id) : null;

  if (cover) {
    return `<a href="shop.html?collection=${collection.id}" class="collection-card collection-card--cover collection-card--${cover.theme} scroll-animate">
      <div class="collection-cover-art">${CollectionCovers.renderArt(collection.id)}</div>
      <div class="collection-cover-badge">${cover.badge}</div>
      <div class="collection-cover-body">
        <span class="collection-cover-tag">${cover.tag}</span>
        <h3>${collection.name}</h3>
        <p>${collection.subtitle}</p>
        <span class="inline-block mt-2 text-[10px] bg-white/15 backdrop-blur px-2.5 py-1 rounded-full text-white/90">${count} ürün · Keşfet →</span>
      </div>
    </a>`;
  }

  return `<a href="shop.html?collection=${collection.id}" class="collection-card scroll-animate" style="background:${collection.gradient}">
    <div class="overlay"></div>
    <span class="text-3xl mb-2 relative z-[2]">${collection.emoji}</span>
    <h3>${collection.name}</h3>
    <p>${collection.subtitle}</p>
    <span class="relative z-[2] mt-3 inline-block text-xs bg-white/20 backdrop-blur px-3 py-1 rounded-full text-white">${count} ürün · Keşfet →</span>
  </a>`;
}

function renderCollectionsGrid(limit = 8) {
  const cols = RAVANON_DATA.collections || [];
  return cols.slice(0, limit).map(c => renderCollectionCard(c)).join('');
}

function renderTrustBadges() {
  return `<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    ${[
      { icon: '✓', title: 'Orijinal Ürün Garantisi', desc: '%100 orijinal' },
      { icon: '↩', title: 'Kolay İade', desc: '14 gün içinde' },
      { icon: '⚡', title: 'Hızlı Teslimat', desc: '1-5 iş günü' },
      { icon: '💬', title: '7/24 Destek', desc: 'AI + canlı destek' }
    ].map(b => `<div class="text-center p-4 rounded-xl border border-gold/10 hover:border-gold/30 transition-colors">
      <span class="text-2xl text-gold block mb-2">${b.icon}</span>
      <p class="text-sm text-cream font-medium">${b.title}</p>
      <p class="text-xs text-cream/40 mt-1">${b.desc}</p>
    </div>`).join('')}
  </div>`;
}

function renderQuizModal() {
  return `<div id="skin-quiz-modal" class="hidden fixed inset-0 z-[8500] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-navy/90 backdrop-blur-sm" onclick="SkinQuiz.close()"></div>
    <div class="relative bg-navy-light border border-gold/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6 md:p-8">
      <button onclick="SkinQuiz.close()" class="absolute top-4 right-4 text-cream/50 hover:text-cream text-2xl">&times;</button>
      <div class="text-center mb-6">
        <p class="text-xs text-gold uppercase tracking-[0.3em] mb-2">AI Powered</p>
        <h2 class="text-2xl font-light text-cream">AI Cilt Analizi & Kişisel Rutin</h2>
        <p class="text-cream/50 text-sm mt-2">9 adımda cilt skoru, K-Beauty rutin ve içerik önerileri</p>
      </div>
      <div id="quiz-content"></div>
    </div>
  </div>`;
}

function renderSearchModal() {
  return `<div id="search-modal" class="hidden fixed inset-0 z-[8500] flex items-start justify-center pt-32 p-4">
    <div class="absolute inset-0 bg-navy/90 backdrop-blur-sm" onclick="this.parentElement.classList.add('hidden')"></div>
    <div class="relative bg-navy-light border border-gold/20 rounded-2xl w-full max-w-xl p-6">
      <input id="search-input" type="text" placeholder="Ürün, marka veya kategori ara..." class="w-full bg-navy border border-gold/20 rounded-xl px-5 py-4 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50 text-lg" autofocus>
      <div id="search-results" class="mt-4 max-h-80 overflow-y-auto custom-scrollbar space-y-2"></div>
    </div>
  </div>`;
}

function initSharedUI(activePage = '') {
  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');
  if (headerEl) headerEl.innerHTML = renderHeader(activePage);
  if (footerEl) footerEl.innerHTML = renderFooter();

  document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
    document.getElementById('mobile-menu')?.classList.toggle('hidden');
  });

  if (!document.getElementById('skin-quiz-modal')) {
    document.body.insertAdjacentHTML('beforeend', renderQuizModal());
  }
  if (!document.getElementById('search-modal')) {
    document.body.insertAdjacentHTML('beforeend', renderSearchModal());
    initSearch();
  }

  Cart.updateBadge();
  Wishlist.updateBadge();
  if (typeof AIChat !== 'undefined') AIChat.init();
  if (typeof LuxuryUX !== 'undefined') LuxuryUX.init();
  initScrollAnimations();

  window.addEventListener('ravanon-update', () => {
    Cart.updateBadge();
    Wishlist.updateBadge();
  });

  window.addEventListener('ravanon-club-update', () => {
    const headerEl = document.getElementById('site-header');
    if (headerEl) headerEl.innerHTML = renderHeader(activePage);
    document.getElementById('mobile-menu-btn')?.addEventListener('click', () => {
      document.getElementById('mobile-menu')?.classList.toggle('hidden');
    });
    bindHashNavLinks();
  });

  bindHashNavLinks();
}

function isIndexPage() {
  const path = window.location.pathname || '';
  return !path || path.endsWith('/') || path.endsWith('index.html');
}

function bindHashNavLinks() {
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    if (link._hashNavBound) return;
    const href = link.getAttribute('href') || '';
    const hash = href.includes('#') ? href.split('#')[1] : '';
    if (!hash || !href.includes('index.html')) return;
    link._hashNavBound = true;
    link.addEventListener('click', (e) => {
      if (!isIndexPage()) return;
      e.preventDefault();
      if (link.closest('#article-reader-modal') && typeof Articles !== 'undefined') Articles.close();
      window.location.hash = hash;
      scrollToHash('#' + hash);
    });
  });
}

function initSearch() {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  if (!input || !results) return;

  input.addEventListener('input', debounce(() => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { results.innerHTML = ''; return; }
    const matches = RAVANON_DATA.products.filter(p =>
      p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.includes(q)
    ).slice(0, 8);
    results.innerHTML = matches.length
      ? matches.map(p => `<a href="product.html?id=${p.id}" class="flex items-center gap-3 p-3 rounded-lg hover:bg-navy transition-colors">
          <div class="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden">${getProductImageHTML(p, 'mini')}</div>
          <div><p class="text-sm text-cream">${p.name}</p><p class="text-xs text-gold">${p.brand} · ${formatPrice(p.price)}</p></div>
        </a>`).join('')
      : '<p class="text-cream/50 text-center py-4">Sonuç bulunamadı</p>';
  }, 200));
}