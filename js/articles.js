/* RAVANON — Uzman Tavsiyeleri / Makale Sistemi */
const Articles = {
  tipGradients: {
    'winter-skin': 'from-blue-900/40 to-gold/20',
    'soft-glam': 'from-rose-900/40 to-gold/20',
    'hair-care': 'from-amber-900/40 to-gold/20',
    'fragrance': 'from-purple-900/40 to-rose-gold/20'
  },

  find(idOrSlug) {
    if (!RAVANON_DATA?.expertTips) return null;
    const num = Number(idOrSlug);
    if (!isNaN(num) && idOrSlug !== '') {
      return RAVANON_DATA.expertTips.find(a => a.id === num) || null;
    }
    return RAVANON_DATA.expertTips.find(a => a.slug === idOrSlug) || null;
  },

  url(article) {
    return `article.html?id=${article.id}`;
  },

  renderCard(article) {
    const grad = this.tipGradients[article.image] || 'from-navy to-gold/20';
    const href = this.url(article);
    return `<a href="${href}" data-article-id="${article.id}" class="luxury-card article-card group block overflow-hidden scroll-animate cursor-pointer">
      <div class="h-44 bg-gradient-to-br ${grad} flex items-center justify-center relative">
        <span class="text-5xl opacity-40 group-hover:scale-110 transition-transform duration-500">${article.emoji || '📖'}</span>
        <span class="absolute top-4 left-4 luxury-tag">${article.category}</span>
        <span class="absolute bottom-4 right-4 text-xs text-cream/50 bg-black/40 backdrop-blur px-2 py-1 rounded-full">${article.readTime}</span>
      </div>
      <div class="p-6">
        <h3 class="font-display text-lg text-cream mt-1 mb-3 group-hover:text-gold transition-colors line-clamp-2 leading-snug">${article.title}</h3>
        <p class="text-sm text-cream/45 line-clamp-2 mb-4 font-light">${article.excerpt}</p>
        <div class="flex items-center justify-between text-xs text-cream/40 pt-4 border-t border-gold/10">
          <span>${article.author}</span>
          <span class="text-gold group-hover:translate-x-1 transition-transform">Oku →</span>
        </div>
      </div>
    </a>`;
  },

  bindCardClicks(container) {
    if (!container || container._articleClickBound) return;
    container.addEventListener('click', (e) => {
      const card = e.target.closest('[data-article-id]');
      if (!card) return;
      e.preventDefault();
      this.open(card.dataset.articleId);
    });
    container._articleClickBound = true;
  },

  renderCards(containerId = 'expert-tips') {
    const el = document.getElementById(containerId);
    if (!el || !RAVANON_DATA?.expertTips) return;
    el.innerHTML = RAVANON_DATA.expertTips.map(a => this.renderCard(a)).join('');
    this.bindCardClicks(el);
    initScrollAnimations();
  },

  handleCardClick(event, id) {
    event.preventDefault();
    this.open(id);
  },

  ensureModal() {
    if (document.getElementById('article-reader-modal')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div id="article-reader-modal" class="article-reader hidden" role="dialog" aria-modal="true" aria-label="Makale okuyucu">
        <div class="article-reader-backdrop"></div>
        <div class="article-reader-panel">
          <button type="button" class="article-reader-close" aria-label="Kapat">✕</button>
          <div id="article-reader-body" class="article-reader-body"></div>
        </div>
      </div>`);

    const modal = document.getElementById('article-reader-modal');
    modal.querySelector('.article-reader-backdrop')?.addEventListener('click', () => this.close());
    modal.querySelector('.article-reader-close')?.addEventListener('click', () => this.close());
    this.bindCardClicks(document.getElementById('article-reader-body'));

    if (!this._escapeBound) {
      this._escapeBound = true;
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !document.getElementById('article-reader-modal')?.classList.contains('hidden')) {
          this.close();
        }
      });
    }
  },

  open(idOrSlug) {
    const article = this.find(idOrSlug);
    if (!article) {
      showToast('Makale bulunamadı', 'error');
      return;
    }
    this.ensureModal();
    const modal = document.getElementById('article-reader-modal');
    const body = document.getElementById('article-reader-body');
    if (!modal || !body) return;

    body.innerHTML = this.renderBody(article, { compact: true });
    this.bindModalActions(body);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    body.scrollTop = 0;
    this.initModalAnimations(body);
  },

  initModalAnimations(container) {
    if (!container) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    container.querySelectorAll('.scroll-animate').forEach(el => observer.observe(el));
  },

  close() {
    const modal = document.getElementById('article-reader-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
  },

  renderBody(article, opts = {}) {
    const related = (article.relatedProducts || []).map(pid => getProductById(pid)).filter(Boolean);
    const others = RAVANON_DATA.expertTips.filter(a => a.id !== article.id);

    return `
      <header class="article-hero-bg ${article.image} py-10 md:py-14 relative overflow-hidden${opts.compact ? ' rounded-t-2xl' : ''}">
        <div class="absolute inset-0 opacity-20" style="background:radial-gradient(circle at 70% 30%, rgba(201,169,110,0.3), transparent 60%)"></div>
        <div class="px-6 md:px-10 relative z-10 article-hero-inner">
          <nav class="text-xs text-white/50 mb-6">
            <a href="index.html" class="hover:text-[#F48FB1] text-white/70">Ana Sayfa</a> /
            <a href="index.html#uzman" class="hover:text-[#F48FB1] text-white/70">Uzman Tavsiyeleri</a> /
            <span class="text-white/80">${article.category}</span>
          </nav>
          <span class="article-hero-tag mb-3 inline-block">${article.category}</span>
          <h1 class="font-display text-2xl md:text-4xl leading-tight text-white mb-4">${article.title}</h1>
          <p class="text-white/75 text-base font-light mb-6 max-w-2xl">${article.excerpt}</p>
          <div class="flex flex-wrap items-center gap-4 text-sm text-white/65">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-[#F48FB1] font-display text-sm">${article.author.charAt(0)}</div>
              <div>
                <p class="text-white font-medium text-sm">${article.author}</p>
                <p class="text-xs text-white/55">${article.authorTitle || 'Uzman'}</p>
              </div>
            </div>
            <span>${article.date}</span>
            <span>·</span>
            <span>${article.readTime} okuma</span>
          </div>
        </div>
      </header>

      <div class="article-content-wrap px-6 md:px-10 py-8 md:py-12">
        <div class="article-body">${article.content}</div>

        <div class="mt-10 pt-6 border-t border-gold/10 flex flex-wrap gap-3">
          <button type="button" class="article-action-quiz btn-luxury-ghost px-5 py-2.5 rounded-full text-sm text-gold">AI Cilt Analizi</button>
          <button type="button" class="article-action-chat btn-luxury-primary px-5 py-2.5 rounded-full text-sm">AI Danışmana Sor</button>
          ${opts.compact ? `<a href="${this.url(article)}" class="btn-outline-rose px-5 py-2.5 rounded-full text-sm inline-flex items-center">Tam Sayfada Oku</a>` : ''}
        </div>

        ${related.length ? `
        <section class="mt-12">
          <h2 class="section-title text-xl mb-5">Önerilen Ürünler</h2>
          <div class="product-grid">${related.map(p => renderProductCard(p)).join('')}</div>
        </section>` : ''}

        <section class="mt-12">
          <h2 class="section-title text-xl mb-5">Diğer Makaleler</h2>
          <div class="grid md:grid-cols-2 gap-4">
            ${others.map(a => `
              <a href="${this.url(a)}" data-article-id="${a.id}" class="luxury-card p-5 block group">
                <span class="text-xs text-gold uppercase tracking-wider">${a.category}</span>
                <h3 class="text-cream font-medium mt-2 group-hover:text-gold transition-colors line-clamp-2">${a.title}</h3>
                <p class="text-xs text-cream/40 mt-2">${a.author} · ${a.readTime}</p>
              </a>`).join('')}
          </div>
        </section>

        <div class="mt-10 text-center">
          <a href="index.html#uzman" class="text-gold text-sm hover:underline">← Tüm Uzman Tavsiyeleri</a>
        </div>
      </div>`;
  },

  bindModalActions(container) {
    if (!container) return;
    container.querySelector('.article-action-quiz')?.addEventListener('click', () => {
      this.close();
      if (typeof SkinQuiz !== 'undefined') SkinQuiz.open();
    });
    container.querySelector('.article-action-chat')?.addEventListener('click', () => {
      if (typeof AIChat !== 'undefined') AIChat.toggle(true);
    });
  },

  initPage() {
    const id = getQueryParam('id');
    const slug = getQueryParam('slug');
    const article = this.find(id || slug);

    if (!article) {
      window.location.href = 'index.html#uzman';
      return;
    }

    document.title = `${article.title} — RAVANON`;
    const loading = document.getElementById('article-loading');
    const content = document.getElementById('article-content');
    if (loading) loading.classList.add('hidden');
    if (content) {
      content.classList.remove('hidden');
      content.innerHTML = `<article>${this.renderBody(article)}</article>`;
      this.bindCardClicks(content);
      this.bindModalActions(content);
    }
    initScrollAnimations();
    window.scrollTo(0, 0);
  }
};

window.Articles = Articles;