/* RAVANON — Premium Collection Cover Art */
const CollectionCovers = {
  koreanFlag(w = 44, h = 44) {
    return `<svg class="cover-kr-flag" width="${w}" height="${h}" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="21" fill="#fff" stroke="rgba(255,255,255,0.4)" stroke-width="1.5"/>
      <circle cx="22" cy="22" r="18" fill="#fff"/>
      <path d="M22 10a12 12 0 0 1 0 24 6 6 0 0 1 0-12 6 6 0 0 0 0-12z" fill="#C60C30"/>
      <path d="M22 34a12 12 0 0 1 0-24 6 6 0 0 1 0 12 6 6 0 0 0 0 12z" fill="#003478"/>
      <g fill="#003478">
        <rect x="20" y="3" width="4" height="3" rx="0.5"/><rect x="20" y="38" width="4" height="3" rx="0.5"/>
        <rect x="3" y="20" width="3" height="4" rx="0.5"/><rect x="38" y="20" width="3" height="4" rx="0.5"/>
      </g>
      <g fill="#C60C30">
        <rect x="8" y="8" width="3" height="3" rx="0.5" transform="rotate(-45 9.5 9.5)"/>
        <rect x="33" y="8" width="3" height="3" rx="0.5" transform="rotate(45 34.5 9.5)"/>
        <rect x="8" y="33" width="3" height="3" rx="0.5" transform="rotate(45 9.5 34.5)"/>
        <rect x="33" y="33" width="3" height="3" rx="0.5" transform="rotate(-45 34.5 34.5)"/>
      </g>
    </svg>`;
  },

  covers: {
    'k-beauty': {
      theme: 'k-beauty',
      badge: 'K-BEAUTY',
      tag: '🇰🇷 Glass Skin',
      art: () => `
        <div class="cover-bg cover-bg--kbeauty"></div>
        <div class="cover-deco cover-deco--bubbles">
          <span class="cover-bubble b1"></span><span class="cover-bubble b2"></span><span class="cover-bubble b3"></span>
        </div>
        <div class="cover-logo cover-logo--kr">${CollectionCovers.koreanFlag(52, 52)}</div>
        <div class="cover-floating cover-floating--serum">
          <svg width="36" height="80" viewBox="0 0 36 80"><rect x="10" y="0" width="16" height="12" rx="3" fill="rgba(255,255,255,0.9)"/><rect x="6" y="12" width="24" height="56" rx="6" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/><rect x="10" y="22" width="16" height="36" rx="3" fill="rgba(255,182,193,0.6)"/><text x="18" y="44" text-anchor="middle" fill="#fff" font-size="7" font-weight="700">R</text></svg>
        </div>
        <div class="cover-sticker cover-sticker--glass">GLASS SKIN</div>`
    },
    'gen-z-picks': {
      theme: 'gen-z',
      badge: 'GEN Z',
      tag: '✨ For You',
      art: () => `
        <div class="cover-bg cover-bg--genz"></div>
        <div class="cover-deco cover-deco--stars">
          <span>★</span><span>✦</span><span>★</span><span>✧</span>
        </div>
        <div class="cover-logo cover-logo--genz">
          <span class="cover-gen-z-text">Z</span>
          <span class="cover-gen-z-ring"></span>
        </div>
        <div class="cover-floating cover-floating--heart">💗</div>
        <div class="cover-floating cover-floating--sparkle" style="top:28%;right:18%">✨</div>
        <div class="cover-sticker cover-sticker--hot">HOT NOW</div>
        <div class="cover-hashtag">#GenZPicks</div>`
    },
    'viral-tiktok': {
      theme: 'tiktok',
      badge: 'VIRAL',
      tag: '📱 #beautytok',
      art: () => `
        <div class="cover-bg cover-bg--tiktok"></div>
        <div class="cover-deco cover-deco--waves"></div>
        <div class="cover-logo cover-logo--tiktok">
          <svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#010101"/><path d="M28 10v17.5a5.5 5.5 0 1 1-4-5.2V14.5c3.2 0 5.8-1.2 8-3.5l-4-1z" fill="#25F4EE" transform="translate(1,-1)"/><path d="M28 10v17.5a5.5 5.5 0 1 1-4-5.2V14.5c3.2 0 5.8-1.2 8-3.5l-4-1z" fill="#FE2C55"/></svg>
        </div>
        <div class="cover-floating cover-floating--views">
          <span>▶ 2.4M</span>
        </div>
        <div class="cover-sticker cover-sticker--viral">TIKTOK HIT</div>
        <div class="cover-hashtag cover-hashtag--tt">#beautytok</div>`
    },
    'ai-analiz': {
      theme: 'ai',
      badge: 'AI POWERED',
      tag: '🤖 Cilt Skoru',
      art: () => `
        <div class="cover-bg cover-bg--ai"></div>
        <div class="cover-deco cover-deco--neural"></div>
        <div class="cover-logo cover-logo--ai">
          <div class="cover-ai-ring" style="--score:87"><span>87</span></div>
        </div>
        <div class="cover-floating cover-floating--dna">🧬</div>
        <div class="cover-sticker cover-sticker--ai">BETA 2.0</div>
        <div class="cover-ai-tags"><span>AM</span><span>PM</span><span>K-Beauty</span></div>`
    },
    'soft-glam': {
      theme: 'soft-glam',
      badge: 'SOFT GLAM',
      tag: '💗 2026 Trend',
      art: () => `
        <div class="cover-bg cover-bg--softglam"></div>
        <div class="cover-deco cover-deco--glow"></div>
        <div class="cover-logo cover-logo--glam">💄</div>
        <div class="cover-sticker cover-sticker--glam">TREND</div>`
    },
    'glass-skin': {
      theme: 'glass-skin',
      badge: 'GLASS SKIN',
      tag: '💎 Cam Cilt',
      art: () => `
        <div class="cover-bg cover-bg--glass"></div>
        <div class="cover-deco cover-deco--shine"></div>
        <div class="cover-logo cover-logo--diamond">💎</div>
        <div class="cover-sticker cover-sticker--glass">3-KAT NEM</div>`
    },
    'teen-glow': {
      theme: 'teen',
      badge: 'TEEN GLOW',
      tag: '🌸 İlk Rutin',
      art: () => `
        <div class="cover-bg cover-bg--teen"></div>
        <div class="cover-floating cover-floating--flower">🌸</div>
        <div class="cover-logo cover-logo--teen">✿</div>
        <div class="cover-sticker cover-sticker--teen">STARTER</div>`
    },
    'luxury-night': {
      theme: 'night',
      badge: 'GECE LÜKSÜ',
      tag: '🌙 Retinol',
      art: () => `
        <div class="cover-bg cover-bg--night"></div>
        <div class="cover-deco cover-deco--moon"></div>
        <div class="cover-logo cover-logo--moon">🌙</div>
        <div class="cover-sticker cover-sticker--night">PM RUTİN</div>`
    },
    'clean-beauty': {
      theme: 'clean',
      badge: 'CLEAN',
      tag: '🌿 Vegan',
      art: () => `
        <div class="cover-bg cover-bg--clean"></div>
        <div class="cover-deco cover-deco--leaf"></div>
        <div class="cover-logo cover-logo--clean">🌿</div>
        <div class="cover-sticker cover-sticker--clean">ECO</div>`
    }
  },

  getCover(collectionId) {
    return this.covers[collectionId] || null;
  },

  renderArt(collectionId) {
    const cover = this.getCover(collectionId);
    return cover ? cover.art() : '';
  },

  renderHeroCard(type, opts = {}) {
    const cover = this.getCover(type);
    if (!cover) return '';
    const isButton = opts.button;
    const href = opts.href || `shop.html?collection=${type}`;
    const tag = cover.tag;
    const title = opts.title || { 'k-beauty': 'K-Beauty', 'gen-z-picks': 'Gen Z Picks', 'viral-tiktok': 'TikTok Viral', 'ai-analiz': 'AI Analiz' }[type] || '';
    const subtitle = opts.subtitle || { 'k-beauty': 'Cam cilt rutini', 'gen-z-picks': 'Viral favoriler', 'viral-tiktok': '#beautytok', 'ai-analiz': 'Cilt skorunuzu öğrenin' }[type] || '';

    const inner = `
      <div class="collection-cover-art">${cover.art()}</div>
      <div class="collection-cover-badge">${cover.badge}</div>
      <div class="collection-cover-body">
        <span class="collection-cover-tag">${tag}</span>
        <h3>${title}</h3>
        <p>${subtitle}</p>
      </div>`;

    const cls = `collection-card collection-card--cover collection-card--${cover.theme} ${opts.extraClass || ''}`;
    if (isButton) {
      return `<button type="button" onclick="${opts.onclick}" class="${cls}">${inner}</button>`;
    }
    return `<a href="${href}" class="${cls}">${inner}</a>`;
  }
};