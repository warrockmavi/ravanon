/* RAVANON - Branded Product Visuals */
const PRODUCT_VISUAL_META = {
  ruj:          { label: 'Ruj',           pack: 'lipstick' },
  allik:        { label: 'Allık',         pack: 'blush' },
  fondoten:     { label: 'Fondöten',      pack: 'foundation' },
  kapatıcı:     { label: 'Kapatıcı',      pack: 'concealer' },
  maskara:      { label: 'Maskara',       pack: 'mascara' },
  palet:        { label: 'Göz Paleti',    pack: 'palette' },
  parlatıcı:    { label: 'Dudak Parlatıcısı', pack: 'gloss' },
  serum:        { label: 'Serum',         pack: 'serum' },
  nemlendirici: { label: 'Nemlendirici',  pack: 'cream' },
  spf:          { label: 'Güneş Kremi',   pack: 'spf' },
  temizleyici:  { label: 'Temizleyici',   pack: 'cleanser' },
  micellar:     { label: 'Micellar Su',   pack: 'micellar' },
  sampuan:      { label: 'Şampuan',       pack: 'shampoo' },
  sac:          { label: 'Saç Bakımı',    pack: 'hair' },
  parfum:       { label: 'Parfüm',        pack: 'perfume' },
  sprey:        { label: 'Vücut Spreyi',  pack: 'mist' },
  vucut:        { label: 'Vücut Kremi',   pack: 'body' },
  set:          { label: 'Set',           pack: 'bundle' },
  toner:        { label: 'Tonik',         pack: 'micellar' },
  essence:      { label: 'Essans',        pack: 'serum' },
  patch:        { label: 'Sivilce Bandı', pack: 'cream' },
  mask:         { label: 'Uyku Maskesi',  pack: 'cream' },
  kas:          { label: 'Kaş Jeli',      pack: 'mascara' }
};

const PRODUCT_VISUAL_MAP = {
  1: 'serum', 2: 'serum', 3: 'ruj', 4: 'kapatıcı', 5: 'fondoten', 6: 'allik',
  7: 'vucut', 8: 'nemlendirici', 9: 'spf', 10: 'fondoten', 11: 'ruj', 12: 'palet',
  13: 'serum', 14: 'maskara', 15: 'parlatıcı', 16: 'ruj', 17: 'ruj', 18: 'nemlendirici',
  19: 'temizleyici', 20: 'serum', 21: 'micellar', 22: 'sampuan', 23: 'sac',
  24: 'parfum', 25: 'sprey', 26: 'serum', 27: 'set', 28: 'set',
  29: 'toner', 30: 'parlatıcı', 31: 'allik', 32: 'sprey', 33: 'patch',
  34: 'kas', 35: 'mask', 36: 'serum', 37: 'sprey',
  38: 'essence', 39: 'serum', 40: 'toner', 41: 'mask', 42: 'serum',
  43: 'serum', 44: 'temizleyici', 45: 'temizleyici', 46: 'serum', 47: 'nemlendirici', 48: 'spf'
};

const CATEGORY_PALETTES = {
  'makyaj':       { bg1: '#1a0f14', bg2: '#3d1f32', accent: '#C9A96E', light: '#E8B4B8' },
  'cilt-bakimi':  { bg1: '#0a1218', bg2: '#1a3344', accent: '#7EB8DA', light: '#C9A96E' },
  'sac-bakimi':   { bg1: '#12100a', bg2: '#2e2418', accent: '#C9A96E', light: '#D4BC8E' },
  'parfum':       { bg1: '#140a18', bg2: '#2e1840', accent: '#E8B4B8', light: '#C9A96E' },
  'vucut-bakimi': { bg1: '#0a140a', bg2: '#1a3020', accent: '#A8C5A0', light: '#C9A96E' }
};

const SHADE_ROTATION = ['#E91E8C','#F48FB1','#C9A96E','#E8B4B8','#B76E79','#FF5252','#7EB8DA','#A8C5A0','#D4BC8E','#9B6B9E'];

function getProductVisualMeta(product) {
  const key = PRODUCT_VISUAL_MAP[product.id] || 'serum';
  return PRODUCT_VISUAL_META[key];
}

function getRavanonLabel(product) {
  const meta = getProductVisualMeta(product);
  return `RAVANON ${meta.label}`;
}

function getProductShade(product) {
  return SHADE_ROTATION[(product.id - 1) % SHADE_ROTATION.length];
}

function getProductPalette(product) {
  return CATEGORY_PALETTES[product.category] || CATEGORY_PALETTES['cilt-bakimi'];
}

function escSvg(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function packSvg(product, shade, pal, meta) {
  const pack = meta.pack;
  const label = getRavanonLabel(product);
  const sub = product.brand !== 'RAVANON' ? product.brand : 'Premium Collection';

  const packs = {
    lipstick: `
      <rect x="108" y="200" width="84" height="130" rx="8" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="118" y="215" width="64" height="90" rx="4" fill="${shade}" opacity="0.9"/>
      <text x="150" y="255" text-anchor="middle" fill="#0A0A12" font-size="9" font-weight="700" font-family="Georgia,serif">R</text>
      <rect x="120" y="118" width="60" height="88" rx="6" fill="${shade}"/>
      <ellipse cx="150" cy="118" rx="30" ry="8" fill="${shade}" opacity="0.7"/>
      <rect x="128" y="305" width="44" height="14" rx="3" fill="${pal.accent}" opacity="0.3"/>
      <text x="150" y="316" text-anchor="middle" fill="${pal.accent}" font-size="7" font-weight="600" letter-spacing="2">RAVANON</text>`,

    blush: `
      <ellipse cx="150" cy="280" rx="72" ry="18" fill="#0A0A12" opacity="0.4"/>
      <rect x="95" y="175" width="110" height="105" rx="14" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="105" y="188" width="90" height="55" rx="8" fill="${shade}" opacity="0.85"/>
      <text x="150" y="222" text-anchor="middle" fill="#fff" font-size="11" font-weight="700" font-family="Georgia,serif" opacity="0.9">RAVANON</text>
      <rect x="115" y="252" width="70" height="20" rx="4" fill="${pal.light}" opacity="0.25"/>
      <text x="150" y="266" text-anchor="middle" fill="${pal.accent}" font-size="8" font-weight="600" letter-spacing="1.5">ALLIK</text>
      <circle cx="150" cy="155" r="8" fill="${pal.accent}" opacity="0.6"/>` ,

    foundation: `
      <rect x="118" y="155" width="64" height="175" rx="10" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="126" y="168" width="48" height="100" rx="6" fill="${shade}" opacity="0.75"/>
      <rect x="130" y="175" width="40" height="30" rx="4" fill="#fff" opacity="0.15"/>
      <text x="150" y="200" text-anchor="middle" fill="#fff" font-size="8" font-weight="700" letter-spacing="2">RAVANON</text>
      <rect x="128" y="278" width="44" height="36" rx="6" fill="${pal.accent}" opacity="0.2"/>
      <text x="150" y="300" text-anchor="middle" fill="${pal.accent}" font-size="7" font-weight="600">FONDÖTEN</text>
      <rect x="138" y="140" width="24" height="22" rx="4" fill="${pal.accent}"/>`,

    concealer: `
      <rect x="105" y="190" width="90" height="120" rx="12" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="118" y="205" width="12" height="75" rx="3" fill="${shade}"/>
      <rect x="138" y="205" width="12" height="75" rx="3" fill="${shade}" opacity="0.7"/>
      <rect x="158" y="205" width="12" height="75" rx="3" fill="${shade}" opacity="0.5"/>
      <text x="150" y="250" text-anchor="middle" fill="${pal.accent}" font-size="9" font-weight="700" letter-spacing="2">RAVANON</text>
      <text x="150" y="290" text-anchor="middle" fill="#fff" font-size="7" opacity="0.6">KAPATICI</text>`,

    mascara: `
      <rect x="130" y="270" width="40" height="60" rx="6" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <text x="150" y="305" text-anchor="middle" fill="${pal.accent}" font-size="6" font-weight="700" letter-spacing="1">RAVANON</text>
      <rect x="138" y="155" width="24" height="120" rx="4" fill="#0A0A12"/>
      <rect x="142" y="130" width="16" height="40" rx="3" fill="${shade}"/>
      <ellipse cx="150" cy="125" rx="14" ry="6" fill="${pal.accent}" opacity="0.5"/>
      <path d="M145 160 Q150 200 155 240" stroke="${pal.accent}" stroke-width="2" fill="none" opacity="0.4"/>`,

    palette: `
      <rect x="80" y="175" width="140" height="100" rx="10" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <text x="150" y="200" text-anchor="middle" fill="${pal.accent}" font-size="9" font-weight="700" letter-spacing="3">RAVANON</text>
      <circle cx="110" cy="235" r="14" fill="${shade}"/>
      <circle cx="150" cy="235" r="14" fill="${pal.light}"/>
      <circle cx="190" cy="235" r="14" fill="${pal.accent}"/>
      <circle cx="130" cy="258" r="14" fill="#B76E79"/>
      <circle cx="170" cy="258" r="14" fill="#7EB8DA"/>
      <text x="150" y="295" text-anchor="middle" fill="#fff" font-size="7" opacity="0.5">GÖZ PALETİ</text>`,

    gloss: `
      <rect x="125" y="200" width="50" height="110" rx="25" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="133" y="215" width="34" height="70" rx="17" fill="${shade}" opacity="0.6"/>
      <ellipse cx="150" cy="200" rx="20" ry="10" fill="${shade}" opacity="0.8"/>
      <text x="150" y="255" text-anchor="middle" fill="#fff" font-size="7" font-weight="700" letter-spacing="1.5">RAVANON</text>
      <text x="150" y="295" text-anchor="middle" fill="${pal.accent}" font-size="6">PARLATICI</text>`,

    serum: `
      <rect x="120" y="160" width="60" height="150" rx="8" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="128" y="175" width="44" height="110" rx="4" fill="${shade}" opacity="0.35"/>
      <rect x="135" y="130" width="30" height="38" rx="4" fill="${pal.accent}" opacity="0.4"/>
      <rect x="140" y="120" width="20" height="14" rx="3" fill="${pal.accent}"/>
      <text x="150" y="220" text-anchor="middle" fill="${pal.accent}" font-size="8" font-weight="700" letter-spacing="2">RAVANON</text>
      <text x="150" y="240" text-anchor="middle" fill="#fff" font-size="7" opacity="0.7">SERUM</text>
      <line x1="132" y1="190" x2="168" y2="190" stroke="#fff" stroke-width="0.5" opacity="0.2"/>
      <line x1="132" y1="210" x2="168" y2="210" stroke="#fff" stroke-width="0.5" opacity="0.15"/>`,

    cream: `
      <ellipse cx="150" cy="295" rx="65" ry="14" fill="#0A0A12" opacity="0.5"/>
      <rect x="95" y="210" width="110" height="80" rx="8" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <ellipse cx="150" cy="210" rx="55" ry="14" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <ellipse cx="150" cy="210" rx="48" ry="10" fill="${shade}" opacity="0.5"/>
      <text x="150" y="255" text-anchor="middle" fill="${pal.accent}" font-size="9" font-weight="700" letter-spacing="2">RAVANON</text>
      <text x="150" y="275" text-anchor="middle" fill="#fff" font-size="7" opacity="0.6">KREM</text>`,

    spf: `
      <rect x="115" y="165" width="70" height="145" rx="10" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="123" y="180" width="54" height="100" rx="5" fill="${shade}" opacity="0.3"/>
      <text x="150" y="215" text-anchor="middle" fill="${pal.accent}" font-size="8" font-weight="700" letter-spacing="2">RAVANON</text>
      <text x="150" y="235" text-anchor="middle" fill="#fff" font-size="14" font-weight="700">SPF</text>
      <text x="150" y="252" text-anchor="middle" fill="#fff" font-size="8" opacity="0.7">50+</text>
      <rect x="130" y="140" width="40" height="28" rx="5" fill="${pal.accent}" opacity="0.5"/>`,

    cleanser: `
      <rect x="118" y="170" width="64" height="140" rx="12" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="126" y="185" width="48" height="95" rx="8" fill="${shade}" opacity="0.25"/>
      <circle cx="150" cy="230" r="20" fill="#fff" opacity="0.08"/>
      <text x="150" y="225" text-anchor="middle" fill="${pal.accent}" font-size="7" font-weight="700" letter-spacing="1.5">RAVANON</text>
      <text x="150" y="245" text-anchor="middle" fill="#fff" font-size="6" opacity="0.6">TEMİZLEYİCİ</text>
      <rect x="135" y="145" width="30" height="28" rx="15" fill="${pal.accent}" opacity="0.4"/>`,

    micellar: `
      <rect x="108" y="165" width="84" height="155" rx="8" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="116" y="178" width="68" height="120" rx="4" fill="${shade}" opacity="0.2"/>
      <text x="150" y="220" text-anchor="middle" fill="${pal.accent}" font-size="8" font-weight="700" letter-spacing="2">RAVANON</text>
      <text x="150" y="240" text-anchor="middle" fill="#fff" font-size="7" opacity="0.7">MICELLAR</text>
      <circle cx="135" cy="270" r="6" fill="#fff" opacity="0.1"/>
      <circle cx="165" cy="265" r="8" fill="#fff" opacity="0.08"/>
      <circle cx="150" cy="285" r="5" fill="#fff" opacity="0.12"/>`,

    shampoo: `
      <rect x="118" y="155" width="64" height="170" rx="10" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="126" y="170" width="48" height="120" rx="5" fill="${shade}" opacity="0.3"/>
      <rect x="132" y="125" width="36" height="38" rx="4" fill="${pal.accent}" opacity="0.35"/>
      <text x="150" y="220" text-anchor="middle" fill="${pal.accent}" font-size="7" font-weight="700" letter-spacing="1.5">RAVANON</text>
      <text x="150" y="240" text-anchor="middle" fill="#fff" font-size="7" opacity="0.6">ŞAMPUAN</text>`,

    hair: `
      <rect x="125" y="175" width="50" height="130" rx="8" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="133" y="190" width="34" height="90" rx="4" fill="${shade}" opacity="0.4"/>
      <text x="150" y="230" text-anchor="middle" fill="${pal.accent}" font-size="7" font-weight="700" letter-spacing="1">RAVANON</text>
      <text x="150" y="248" text-anchor="middle" fill="#fff" font-size="6" opacity="0.6">SAÇ BAKIMI</text>
      <rect x="140" y="150" width="20" height="28" rx="3" fill="${pal.accent}"/>`,

    perfume: `
      <rect x="130" y="250" width="40" height="70" rx="6" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="138" y="175" width="24" height="80" rx="3" fill="${shade}" opacity="0.5"/>
      <rect x="142" y="155" width="16" height="24" rx="2" fill="${pal.accent}"/>
      <circle cx="150" cy="148" r="6" fill="${pal.accent}" opacity="0.7"/>
      <text x="150" y="215" text-anchor="middle" fill="${pal.accent}" font-size="7" font-weight="700" letter-spacing="2">RAVANON</text>
      <text x="150" y="290" text-anchor="middle" fill="#fff" font-size="6" opacity="0.5">PARFÜM</text>
      <path d="M150 130 Q160 140 150 150 Q140 140 150 130" fill="${pal.light}" opacity="0.3"/>`,

    mist: `
      <rect x="120" y="180" width="60" height="140" rx="14" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="128" y="195" width="44" height="95" rx="8" fill="${shade}" opacity="0.3"/>
      <rect x="138" y="155" width="24" height="30" rx="4" fill="${pal.accent}" opacity="0.5"/>
      <text x="150" y="235" text-anchor="middle" fill="${pal.accent}" font-size="7" font-weight="700" letter-spacing="1.5">RAVANON</text>
      <text x="150" y="253" text-anchor="middle" fill="#fff" font-size="6" opacity="0.6">VÜCUT SPREYİ</text>`,

    body: `
      <rect x="115" y="170" width="70" height="150" rx="12" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="123" y="185" width="54" height="105" rx="6" fill="${shade}" opacity="0.35"/>
      <text x="150" y="225" text-anchor="middle" fill="${pal.accent}" font-size="8" font-weight="700" letter-spacing="2">RAVANON</text>
      <text x="150" y="245" text-anchor="middle" fill="#fff" font-size="7" opacity="0.6">VÜCUT KREMİ</text>
      <ellipse cx="150" cy="300" rx="30" ry="6" fill="${pal.accent}" opacity="0.2"/>`,

    bundle: `
      <rect x="85" y="195" width="55" height="100" rx="6" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1" transform="rotate(-8 112 245)"/>
      <rect x="160" y="195" width="55" height="100" rx="6" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1" transform="rotate(8 187 245)"/>
      <rect x="108" y="180" width="84" height="115" rx="8" fill="#1a1a2e" stroke="${pal.accent}" stroke-width="1.5"/>
      <rect x="116" y="192" width="68" height="80" rx="4" fill="${shade}" opacity="0.25"/>
      <text x="150" y="225" text-anchor="middle" fill="${pal.accent}" font-size="9" font-weight="700" letter-spacing="3">RAVANON</text>
      <text x="150" y="248" text-anchor="middle" fill="#fff" font-size="8" font-weight="600">SET</text>
      <rect x="125" y="258" width="50" height="3" rx="1" fill="${pal.accent}" opacity="0.5"/>`
  };

  return `
    <defs>
      <linearGradient id="bg-${product.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${pal.bg1}"/>
        <stop offset="100%" stop-color="${pal.bg2}"/>
      </linearGradient>
      <radialGradient id="glow-${product.id}" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stop-color="${pal.accent}" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="${pal.bg1}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="300" height="380" fill="url(#bg-${product.id})"/>
    <rect width="300" height="380" fill="url(#glow-${product.id})"/>
    <text x="150" y="42" text-anchor="middle" fill="${pal.accent}" font-size="16" font-weight="300" letter-spacing="6" font-family="Georgia,serif">RAVANON</text>
    <line x1="60" y1="52" x2="240" y2="52" stroke="${pal.accent}" stroke-width="0.5" opacity="0.4"/>
    <text x="150" y="72" text-anchor="middle" fill="#fff" font-size="10" font-weight="600" letter-spacing="2" opacity="0.85">${escSvg(meta.label.toUpperCase())}</text>
    ${packs[pack] || packs.serum}
    <text x="150" y="355" text-anchor="middle" fill="#fff" font-size="7" opacity="0.35">${escSvg(sub)}</text>`;
}

function buildProductSvg(product) {
  const meta = getProductVisualMeta(product);
  const shade = getProductShade(product);
  const pal = getProductPalette(product);
  return `<svg class="ravanon-product-svg" viewBox="0 0 300 380" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${packSvg(product, shade, pal, meta)}</svg>`;
}

function getProductImageHTML(product, size = 'full') {
  const h = size === 'mini' ? 'h-12' : size === 'thumb' ? 'h-48' : size === 'hero' ? 'h-96' : 'h-64';
  const label = getRavanonLabel(product);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const showBadge = size !== 'mini';
  const showLabel = size !== 'mini';

  return `<div class="${h} w-full relative overflow-hidden product-visual-wrap${size === 'mini' ? ' product-visual-mini' : ''}" data-product-id="${product.id}" title="${escSvg(label)}">
    ${buildProductSvg(product)}
    ${showBadge && product.badge ? `<span class="absolute top-3 left-3 z-10 bg-gold/95 text-navy text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">${product.badge}</span>` : ''}
    ${showBadge && product.flash && discount ? `<span class="absolute top-3 right-3 z-10 bg-rose-gold text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse-soft shadow-lg">-${discount}%</span>` : ''}
    ${showLabel ? `<div class="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent px-3 py-3">
      <p class="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">${label}</p>
    </div>` : ''}
  </div>`;
}

function getProductGradient(id, category) {
  const pal = CATEGORY_PALETTES[category] || CATEGORY_PALETTES['cilt-bakimi'];
  return `linear-gradient(135deg, ${pal.bg1} 0%, ${pal.bg2} 100%)`;
}