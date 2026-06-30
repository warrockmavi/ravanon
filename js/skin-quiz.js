/* RAVANON - AI Skin Analysis (Enhanced v2) */
const SkinQuiz = {
  step: 0,
  answers: {},
  steps: [
    { id: 'skinType', question: 'Cildinizi nasıl tanımlarsınız?', options: [
      { value: 'Kuru', label: 'Kuru', desc: 'Gergin ve pul pul hissediyorum', icon: '🏜️' },
      { value: 'Yağlı', label: 'Yağlı', desc: 'Gün içinde parlaklaşıyor', icon: '💧' },
      { value: 'Karma', label: 'Karma', desc: 'T-bölge yağlı, yanaklar kuru', icon: '⚖️' },
      { value: 'Hassas', label: 'Hassas', desc: 'Kolayca kızarıyor ve tahriş oluyor', icon: '🌸' },
      { value: 'Normal', label: 'Normal', desc: 'Dengeli ve sorunsuz', icon: '✨' }
    ]},
    { id: 'concerns', question: 'Ana cilt endişeleriniz neler?', multi: true, options: [
      { value: 'leke', label: 'Leke & Ton Eşitsizliği', icon: '🔆' },
      { value: 'kırışıklık', label: 'Kırışıklık & Yaşlanma', icon: '⏳' },
      { value: 'gözenek', label: 'Gözenek & Akne', icon: '🔍' },
      { value: 'nem', label: 'Kuruluk & Nem Kaybı', icon: '💦' },
      { value: 'hassasiyet', label: 'Hassasiyet & Kızarıklık', icon: '🔴' }
    ]},
    { id: 'age', question: 'Yaş aralığınız?', options: [
      { value: '18-25', label: '18-25', icon: '🌱' },
      { value: '26-35', label: '26-35', icon: '🌿' },
      { value: '36-45', label: '36-45', icon: '🌳' },
      { value: '45+', label: '45+', icon: '🌲' }
    ]},
    { id: 'sunExposure', question: 'Güneşe ne kadar maruz kalıyorsunuz?', options: [
      { value: 'low', label: 'Az', desc: 'Çoğunlukla iç mekân', icon: '🏠' },
      { value: 'mid', label: 'Orta', desc: 'Günde 1-2 saat dışarıda', icon: '☀️' },
      { value: 'high', label: 'Yoğun', desc: 'Spor, plaj veya açık hava işi', icon: '🌞' }
    ]},
    { id: 'makeupHabits', question: 'Makyaj alışkanlığınız?', options: [
      { value: 'none', label: 'Hiç / Nadir', desc: 'Temiz cilt odaklıyım', icon: '🫧' },
      { value: 'light', label: 'Hafif', desc: 'BB krem, allık, maskara', icon: '💗' },
      { value: 'full', label: 'Tam Makyaj', desc: 'Fondöten ve tam look günlük', icon: '💄' },
      { value: 'glam', label: 'Soft Glam', desc: 'Trend makyaj, sık güncelleme', icon: '✨' }
    ]},
    { id: 'sensitivity', question: 'Cildiniz hangi içeriklere tepki veriyor?', multi: true, options: [
      { value: 'fragrance', label: 'Parfüm / Koku', icon: '🌺' },
      { value: 'alcohol', label: 'Alkol', icon: '🍶' },
      { value: 'acid', label: 'Asitler (AHA/BHA)', icon: '🧪' },
      { value: 'retinol', label: 'Retinol', icon: '🌙' },
      { value: 'none', label: 'Hiçbiri / Bilmiyorum', icon: '✅' }
    ]},
    { id: 'kbeauty', question: 'K-Beauty (Kore cilt bakımı) ilginiz?', options: [
      { value: 'love', label: 'Bayılıyorum!', desc: 'Cam cilt, essans, çift temizlik', icon: '🇰🇷' },
      { value: 'curious', label: 'Denemek İsterim', desc: 'TikTok\'ta gördüm, merak ediyorum', icon: '✨' },
      { value: 'neutral', label: 'Fark Etmez', desc: 'En iyi ürün neyse onu isterim', icon: '💗' }
    ]},
    { id: 'routine', question: 'Mevcut rutininiz?', options: [
      { value: 'minimal', label: 'Minimal', desc: 'Sadece temizleyici', icon: '1️⃣' },
      { value: 'basic', label: 'Temel', desc: 'Temizleyici + nemlendirici', icon: '2️⃣' },
      { value: 'advanced', label: 'Gelişmiş', desc: 'Serum, SPF dahil tam rutin', icon: '3️⃣' },
      { value: 'expert', label: 'Uzman', desc: 'Retinol, asitler dahil', icon: '4️⃣' }
    ]},
    { id: 'budget', question: 'Aylık bütçeniz?', options: [
      { value: 'low', label: '500 TL altı', icon: '💰' },
      { value: 'mid', label: '500-1500 TL', icon: '💰💰' },
      { value: 'high', label: '1500 TL üzeri', icon: '💰💰💰' }
    ]}
  ],

  ingredientTips: {
    Kuru: ['Hyaluronik asit ve seramid içeren nemlendiriciler', 'Yağ bazlı temizleyiciler (oil cleanser)', 'Alkol içermeyen tonikler'],
    Yağlı: ['Niacinamide %5-10 gözenek kontrolü', 'Salisilik asit veya BHA haftada 2-3 kez', 'Hafif jel nemlendirici, yağsız SPF'],
    Karma: ['T-bölgeye BHA, yanaklara nem serumu', 'Çift aşamalı temizlik akşamları', 'Hafif ama dengeli nemlendirici'],
    Hassas: ['Centella, panthenol, aloe içerikleri', 'Fragrance-free ve hipoalerjenik formüller', 'Patch test yapmadan yeni ürün kullanmayın'],
    Normal: ['C vitamini sabah aydınlatma', 'Düzenli SPF her gün', 'Mevsimsel nemlendirici ayarı']
  },

  concernSerumMap: {
    leke: ['leke', 'aydınlatma', 'vitamin c'],
    kırışıklık: ['anti-aging', 'kırışıklık', 'peptit'],
    gözenek: ['gözenek', 'akne'],
    nem: ['nem', 'glass-skin'],
    hassasiyet: ['hassas', 'hassasiyet']
  },

  open() {
    this.step = 0;
    this.answers = {};
    const modal = document.getElementById('skin-quiz-modal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      this.render();
    }
  },

  close() {
    document.getElementById('skin-quiz-modal')?.classList.add('hidden');
    document.body.style.overflow = '';
  },

  select(value) {
    const current = this.steps[this.step];
    if (current.multi) {
      if (value === 'none') {
        this.answers[current.id] = ['none'];
      } else {
        this.answers[current.id] = (this.answers[current.id] || []).filter(v => v !== 'none');
        const idx = this.answers[current.id].indexOf(value);
        if (idx >= 0) this.answers[current.id].splice(idx, 1);
        else this.answers[current.id].push(value);
      }
      this.render();
    } else {
      this.answers[current.id] = value;
      if (this.step < this.steps.length - 1) {
        this.step++;
        this.render();
      } else {
        this.showResults();
      }
    }
  },

  next() {
    const current = this.steps[this.step];
    if (current.multi && (!this.answers[current.id] || !this.answers[current.id].length)) {
      showToast('En az bir seçenek işaretleyin', 'error');
      return;
    }
    if (this.step < this.steps.length - 1) { this.step++; this.render(); }
    else this.showResults();
  },

  back() {
    if (this.step > 0) { this.step--; this.render(); }
  },

  render() {
    const container = document.getElementById('quiz-content');
    if (!container) return;
    const current = this.steps[this.step];
    const progress = ((this.step + 1) / this.steps.length) * 100;

    container.innerHTML = `
      <div class="mb-6">
        <div class="flex justify-between text-xs text-cream/50 mb-2">
          <span>Adım ${this.step + 1} / ${this.steps.length}</span>
          <span>%${Math.round(progress)}</span>
        </div>
        <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-[#E91E8C] to-[#F48FB1] rounded-full transition-all duration-500" style="width:${progress}%"></div>
        </div>
      </div>
      <h3 class="text-xl md:text-2xl font-light text-cream mb-2 text-center">${current.question}</h3>
      ${current.multi ? '<p class="text-xs text-cream/50 text-center mb-6">Birden fazla seçebilirsiniz</p>' : '<div class="mb-6"></div>'}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        ${current.options.map(opt => {
          const selected = current.multi
            ? (this.answers[current.id] || []).includes(opt.value)
            : this.answers[current.id] === opt.value;
          return `<button onclick="SkinQuiz.select('${opt.value}')" class="quiz-option p-4 rounded-xl border text-left transition-all duration-300 ${selected ? 'border-[#E91E8C] bg-[#FFF0F3]' : 'border-gold/20 hover:border-[#F48FB1]/50 bg-navy'}">
            <div class="flex items-center gap-3">
              <span class="text-2xl">${opt.icon}</span>
              <div>
                <p class="font-medium text-cream">${opt.label}</p>
                ${opt.desc ? `<p class="text-xs text-cream/50 mt-0.5">${opt.desc}</p>` : ''}
              </div>
              ${selected ? '<span class="ml-auto text-[#E91E8C]">✓</span>' : ''}
            </div>
          </button>`;
        }).join('')}
      </div>
      <div class="flex justify-between">
        <button onclick="SkinQuiz.back()" class="px-6 py-2.5 text-cream/60 hover:text-cream transition-colors ${this.step === 0 ? 'invisible' : ''}">← Geri</button>
        ${current.multi ? `<button onclick="SkinQuiz.next()" class="px-8 py-2.5 btn-rose rounded-xl font-semibold">Devam →</button>` : ''}
      </div>`;
  },

  preferKBeauty() {
    return this.answers.kbeauty === 'love' || this.answers.kbeauty === 'curious' ||
      this.answers.age === '18-25' || this.answers.makeupHabits === 'glam';
  },

  getFilteredPool() {
    const budgetMax = { low: 500, mid: 1500, high: 99999 };
    const max = budgetMax[this.answers.budget] || 99999;
    const sens = (this.answers.sensitivity || []).filter(s => s !== 'none');

    return getSkincareProducts().filter(p => {
      if (p.price > max) return false;
      if (this.answers.skinType && !p.skinType?.includes(this.answers.skinType)) return false;
      if (sens.includes('retinol') && p.name.toLowerCase().includes('retinol')) return false;
      if (sens.includes('acid') && p.tags?.includes('gözenek') && !p.tags?.includes('hassas')) return false;
      return true;
    });
  },

  scoreProduct(product) {
    let score = product.rating * 10;
    const concerns = this.answers.concerns || [];

    concerns.forEach(c => {
      const keys = this.concernSerumMap[c] || [c];
      if (keys.some(k => product.tags?.includes(k))) score += 18;
    });

    if (this.answers.skinType && product.skinType?.includes(this.answers.skinType)) score += 12;
    if (this.preferKBeauty() && product.tags?.includes('k-beauty')) score += 20;
    if (product.bestseller) score += 5;
    if (product.new) score += 3;
    return score;
  },

  pickByRole(pool, role, usedIds, extraTags = []) {
    let candidates = pool.filter(p => getProductRole(p) === role && !usedIds.has(p.id));

    if (extraTags.length) {
      const tagged = candidates.filter(p => extraTags.some(t => p.tags?.includes(t)));
      if (tagged.length) candidates = tagged;
    }

    if (!candidates.length) {
      const budgetMax = { low: 500, mid: 1500, high: 99999 };
      const max = budgetMax[this.answers.budget] || 99999;
      candidates = getSkincareProducts().filter(p =>
        getProductRole(p) === role && !usedIds.has(p.id) && p.price <= max
      );
    }

    candidates.sort((a, b) => this.scoreProduct(b) - this.scoreProduct(a));
    const picked = candidates[0] || null;
    if (picked) usedIds.add(picked.id);
    return picked;
  },

  pickSerumForConcern(pool, usedIds) {
    const concerns = this.answers.concerns || [];
    const priority = concerns[0] || 'nem';
    const tagKeys = this.concernSerumMap[priority] || ['serum'];

    let candidates = pool.filter(p => {
      const role = getProductRole(p);
      return (role === 'serum' || role === 'essence') && !usedIds.has(p.id);
    });

    const matched = candidates.filter(p => tagKeys.some(t => p.tags?.includes(t)));
    if (matched.length) candidates = matched;

    candidates.sort((a, b) => this.scoreProduct(b) - this.scoreProduct(a));
    const picked = candidates[0] || this.pickByRole(pool, 'serum', usedIds);
    return picked;
  },

  buildRoutine(pool, period) {
    const usedIds = new Set();
    const hasMakeup = ['light', 'full', 'glam'].includes(this.answers.makeupHabits);
    const budgetMax = { low: 500, mid: 1500, high: 99999 };

    if (period === 'am') {
      const steps = [];
      const cleanser = this.pickByRole(pool, 'cleanser', usedIds);
      if (cleanser) steps.push({ step: 'Temizleyici', product: cleanser, icon: '🫧' });

      const toner = this.pickByRole(pool, 'toner', usedIds);
      if (toner) steps.push({ step: 'Tonik', product: toner, icon: '💧' });

      const essence = this.preferKBeauty() ? this.pickByRole(pool, 'essence', usedIds, ['k-beauty']) : null;
      if (essence) steps.push({ step: 'Essans', product: essence, icon: '🇰🇷' });

      const serum = this.pickSerumForConcern(pool, usedIds);
      if (serum) steps.push({ step: 'Serum', product: serum, icon: '✨' });

      const moisturizer = this.pickByRole(pool, 'moisturizer', usedIds, ['nem', 'bariyer']);
      if (moisturizer) steps.push({ step: 'Nemlendirici', product: moisturizer, icon: '💗' });

      const spf = this.pickByRole(pool, 'spf', usedIds) ||
        (this.preferKBeauty() ? this.pickByRole(getSkincareProducts(), 'spf', usedIds, ['k-beauty']) : null);
      if (spf) steps.push({ step: 'SPF Koruma', product: spf, icon: '☀️' });

      return steps;
    }

    const pmSteps = [];

    if (hasMakeup) {
      const oil = this.pickByRole(pool, 'oil-cleanser', usedIds, ['k-beauty']);
      if (oil) pmSteps.push({ step: 'Temizlik Yağı', product: oil, icon: '🛢️' });
      else {
        const micellar = this.pickByRole(pool, 'micellar', usedIds);
        if (micellar) pmSteps.push({ step: 'Micellar Temizlik', product: micellar, icon: '🫧' });
      }
    }

    const pmCleanser = this.pickByRole(pool, 'cleanser', usedIds);
    if (pmCleanser) pmSteps.push({ step: 'Jel Temizleyici', product: pmCleanser, icon: '🫧' });

    const pmToner = this.pickByRole(pool, 'toner', usedIds);
    if (pmToner) pmSteps.push({ step: 'Tonik', product: pmToner, icon: '💧' });

    const pmSerum = this.pickSerumForConcern(pool, usedIds);
    if (pmSerum) pmSteps.push({ step: 'Aktif Serum', product: pmSerum, icon: '✨' });

    const wantsRetinol = (this.answers.routine === 'expert' || this.answers.concerns?.includes('kırışıklık')) &&
      !(this.answers.sensitivity || []).includes('retinol');
    if (wantsRetinol) {
      const retinol = this.pickByRole(pool, 'treatment', usedIds, ['anti-aging']) ||
        getSkincareProducts().find(p => p.name.includes('Retinol') && !usedIds.has(p.id));
      if (retinol) {
        usedIds.add(retinol.id);
        pmSteps.push({ step: 'Retinol Tedavi', product: retinol, icon: '🌙' });
      }
    }

    if (this.answers.concerns?.includes('gözenek')) {
      const patch = this.pickByRole(pool, 'treatment', usedIds, ['akne']);
      if (patch && getProductRole(patch) === 'treatment') {
        pmSteps.push({ step: 'Sivilce Bandı', product: patch, icon: '⭐' });
      }
    }

    const nightMask = this.pickByRole(pool, 'mask', usedIds, ['k-beauty', 'glass-skin']);
    if (nightMask) pmSteps.push({ step: 'Gece Maskesi', product: nightMask, icon: '💎' });
    else {
      const nightCream = this.pickByRole(pool, 'moisturizer', usedIds, ['nem']);
      if (nightCream) pmSteps.push({ step: 'Gece Kremi', product: nightCream, icon: '🌙' });
    }

    return pmSteps;
  },

  calculateSkinScore() {
    let score = 72;
    const typeBonus = { Normal: 12, Karma: 6, Kuru: 0, Yağlı: 2, Hassas: -4 };
    score += typeBonus[this.answers.skinType] || 0;
    const routineBonus = { minimal: -8, basic: 0, advanced: 8, expert: 12 };
    score += routineBonus[this.answers.routine] || 0;
    const sunPenalty = { low: 0, mid: -4, high: -10 };
    score += sunPenalty[this.answers.sunExposure] || 0;
    score -= (this.answers.concerns || []).length * 3;
    if ((this.answers.concerns || []).includes('hassasiyet')) score -= 4;
    score -= (this.answers.sensitivity || []).filter(s => s !== 'none').length * 2;
    const ageAdj = { '18-25': 5, '26-35': 0, '36-45': -3, '45+': -6 };
    score += ageAdj[this.answers.age] || 0;
    if (this.preferKBeauty()) score += 3;
    return Math.max(28, Math.min(98, Math.round(score)));
  },

  getSkinStatus(score) {
    if (score >= 85) return { label: 'Mükemmel', emoji: '💎', color: '#00B894' };
    if (score >= 70) return { label: 'İyi', emoji: '✨', color: '#E91E8C' };
    if (score >= 55) return { label: 'Orta', emoji: '🌸', color: '#F48FB1' };
    return { label: 'Dikkat Gerekli', emoji: '💗', color: '#CF112C' };
  },

  getIngredientRecommendations() {
    const tips = [...(this.ingredientTips[this.answers.skinType] || [])];
    const concerns = this.answers.concerns || [];
    if (concerns.includes('leke')) tips.push('C vitamini + alpha arbutin (Beauty of Joseon) leke için altın ikili');
    if (concerns.includes('gözenek')) tips.push('Anua Heartleaf toner + sivilce bandı kombinasyonu');
    if (concerns.includes('kırışıklık')) tips.push('Retinol veya bakuchiol gece rutinine ekleyin');
    if (concerns.includes('nem')) tips.push('COSRX Snail Essence + Torriden serum = cam cilt');
    if (concerns.includes('hassasiyet')) tips.push('SKIN1004 Centella ampul yatıştırıcı süperstar');
    if (this.preferKBeauty()) tips.push('Kore çift temizlik: yağ temizleyici → jel temizleyici');
    if (this.answers.sunExposure === 'high') tips.push('Beauty of Joseon SPF veya Anthelios — her 2 saatte yenileyin');
    if ((this.answers.sensitivity || []).includes('fragrance')) tips.push('Parfüm içermeyen (fragrance-free) ürünler tercih edin');
    return [...new Set(tips)].slice(0, 6);
  },

  getUniqueProducts(amRoutine, pmRoutine) {
    const map = new Map();
    [...amRoutine, ...pmRoutine].forEach(s => {
      if (s.product) map.set(s.product.id, s.product);
    });
    return [...map.values()];
  },

  showResults() {
    const container = document.getElementById('quiz-content');
    const score = this.calculateSkinScore();
    const status = this.getSkinStatus(score);
    const pool = this.getFilteredPool();
    const amRoutine = this.buildRoutine(pool, 'am');
    const pmRoutine = this.buildRoutine(pool, 'pm');
    const allProducts = this.getUniqueProducts(amRoutine, pmRoutine);
    const tips = this.getIngredientRecommendations();
    const totalPrice = allProducts.reduce((s, p) => s + p.price, 0);
    const kbeautyCount = allProducts.filter(p => p.tags?.includes('k-beauty')).length;
    const concernLabels = { leke: 'Leke', kırışıklık: 'Anti-Aging', gözenek: 'Gözenek', nem: 'Nem', hassasiyet: 'Hassasiyet' };
    const concernText = (this.answers.concerns || []).map(c => concernLabels[c] || c).join(' · ') || 'Genel Bakım';

    container.innerHTML = `
      <div class="text-center mb-6">
        <p class="text-xs text-[#E91E8C] uppercase tracking-[0.3em] mb-3">AI Cilt Raporu</p>
        <div class="skin-score-ring mx-auto mb-3" style="--score:${score}">
          <span>${score}</span>
        </div>
        <p class="text-sm font-medium mb-1" style="color:${status.color}">${status.emoji} Cilt Sağlığı: ${status.label}</p>
        <h3 class="text-xl font-light text-cream mb-1">Kişisel Rutininiz Hazır!</h3>
        <p class="text-cream/60 text-sm">${this.answers.skinType} cilt · ${concernText}</p>
        ${kbeautyCount ? `<span class="inline-block mt-2 badge-new">🇰🇷 ${kbeautyCount} K-Beauty ürünü dahil</span>` : ''}
      </div>

      <div class="grid md:grid-cols-2 gap-4 mb-5">
        <div class="p-4 rounded-xl border border-[#E91E8C]/15 bg-[#FFF0F3]/40">
          <p class="text-xs text-[#E91E8C] uppercase tracking-wider mb-3 font-semibold">☀️ Sabah Rutini (AM)</p>
          ${amRoutine.map((step, i) => this.renderRoutineStep(step, i)).join('')}
        </div>
        <div class="p-4 rounded-xl border border-[#6C5CE7]/15 bg-[#F8F7FF]">
          <p class="text-xs text-[#6C5CE7] uppercase tracking-wider mb-3 font-semibold">🌙 Akşam Rutini (PM)</p>
          ${pmRoutine.map((step, i) => this.renderRoutineStep(step, i)).join('')}
        </div>
      </div>

      <div class="mb-5">
        <p class="text-xs text-gold uppercase tracking-wider mb-3 text-center">🛍️ Rutin Ürünleriniz (${allProducts.length} ürün)</p>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto custom-scrollbar">
          ${allProducts.map(p => `
            <a href="product.html?id=${p.id}" class="flex items-center gap-2 p-2 rounded-lg border border-gold/10 bg-white hover:border-[#E91E8C]/30 transition-all">
              <div class="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">${getProductImageHTML(p, 'mini')}</div>
              <div class="min-w-0">
                <p class="text-[10px] text-cream/40 truncate">${p.brand}</p>
                <p class="text-xs text-cream font-medium truncate">${p.name}</p>
                <p class="text-[10px] text-[#E91E8C] font-semibold">${formatPrice(p.price)}</p>
              </div>
            </a>`).join('')}
        </div>
      </div>

      <div class="p-4 rounded-xl border border-gold/10 bg-navy/50 mb-5">
        <p class="text-xs text-gold uppercase tracking-wider mb-3">🧪 AI İçerik Önerileri</p>
        <ul class="space-y-2">
          ${tips.map(t => `<li class="text-sm text-cream/70 flex gap-2"><span class="text-[#E91E8C] flex-shrink-0">•</span><span>${t}</span></li>`).join('')}
        </ul>
      </div>

      <div class="p-4 rounded-xl border border-[#E91E8C]/20 bg-[#FFF0F3]/30 mb-5 text-center">
        <p class="text-sm text-cream/60">Önerilen rutin toplamı · ${allProducts.length} ürün</p>
        <p class="text-2xl font-semibold text-cream">${formatPrice(totalPrice)}</p>
        <p class="text-xs text-cream/40 mt-1">Club üyelerine ek %15 · Kod: <strong class="text-[#E91E8C]">RAVANON20</strong></p>
      </div>

      <div class="flex flex-wrap gap-3 justify-center">
        <button onclick="SkinQuiz.addAllToCart()" class="px-6 py-3 btn-rose rounded-xl font-semibold">Tümünü Sepete Ekle</button>
        <a href="shop.html?collection=k-beauty" onclick="SkinQuiz.close()" class="px-6 py-3 btn-outline-rose rounded-xl text-sm flex items-center">🇰🇷 K-Beauty Mağaza</a>
        <button onclick="AIChat.toggle(true);SkinQuiz.close()" class="px-6 py-3 border border-gold/30 text-gold rounded-xl hover:bg-gold/10 transition-colors text-sm">AI'a Sor</button>
        <button onclick="SkinQuiz.close()" class="px-6 py-3 border border-gold/30 text-gold rounded-xl hover:bg-gold/10 transition-colors text-sm">Kapat</button>
      </div>`;

    Storage.set('quizResults', {
      answers: this.answers,
      score,
      status: status.label,
      recommendations: allProducts.map(p => p.id),
      kbeautyCount,
      date: Date.now()
    });
    window.dispatchEvent(new CustomEvent('ravanon-quiz-complete'));
  },

  renderRoutineStep(step, i) {
    if (!step?.product) return '';
    const isK = step.product.tags?.includes('k-beauty');
    return `<div class="flex items-center gap-3 py-2.5 ${i > 0 ? 'border-t border-gold/5' : ''}">
      <span class="text-base flex-shrink-0">${step.icon || (i + 1)}</span>
      <div class="flex-1 min-w-0">
        <p class="text-[10px] text-cream/40 uppercase">${step.step}</p>
        <p class="text-sm text-cream font-medium leading-tight">${step.product.name}</p>
        <p class="text-[10px] text-cream/40">${step.product.brand}${isK ? ' · 🇰🇷' : ''} · ${formatPrice(step.product.price)}</p>
      </div>
      <button onclick="Cart.add(${step.product.id})" class="text-[10px] px-2 py-1 border border-[#E91E8C]/30 text-[#E91E8C] rounded-lg hover:bg-[#FFF0F3] transition-colors flex-shrink-0">+</button>
    </div>`;
  },

  addAllToCart() {
    const results = Storage.get('quizResults', null);
    if (results?.recommendations) {
      results.recommendations.forEach(id => Cart.add(id));
      showToast('Rutin sepete eklendi!', 'success');
      this.close();
    }
  }
};