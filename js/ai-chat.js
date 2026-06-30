/* RAVANON - AI Beauty Advisor Chatbot */
const AIChat = {
  isOpen: false,
  messages: [],
  context: {},

  init() {
    this.injectWidget();
    this.bindEvents();
  },

  injectWidget() {
    if (document.getElementById('ai-chat-widget')) return;
    const widget = document.createElement('div');
    widget.id = 'ai-chat-widget';
    widget.innerHTML = `
      <button id="ai-chat-toggle" class="ai-chat-btn fixed bottom-6 right-6 z-[9000] w-16 h-16 rounded-full bg-gradient-to-br from-gold to-rose-gold shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 group" aria-label="AI Güzellik Danışmanı">
        <span class="text-2xl group-hover:scale-110 transition-transform">✨</span>
        <span class="absolute -top-1 -right-1 w-5 h-5 bg-navy border-2 border-gold rounded-full flex items-center justify-center text-[10px] text-gold font-bold">AI</span>
      </button>
      <div id="ai-chat-panel" class="fixed bottom-24 right-6 z-[9000] w-[380px] max-w-[calc(100vw-2rem)] bg-navy-light border border-gold/20 rounded-2xl shadow-2xl overflow-hidden transform scale-95 opacity-0 pointer-events-none transition-all duration-300">
        <div class="bg-gradient-to-r from-navy to-navy-light p-4 border-b border-gold/20">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-rose-gold flex items-center justify-center text-lg">🤖</div>
              <div>
                <h3 class="font-semibold text-cream text-sm">RAVANON AI Danışman</h3>
                <p class="text-xs text-gold/70">Cilt tipinize özel öneriler</p>
              </div>
            </div>
            <button id="ai-chat-close" class="text-cream/50 hover:text-cream text-xl">&times;</button>
          </div>
        </div>
        <div id="ai-chat-messages" class="h-80 overflow-y-auto p-4 space-y-3 custom-scrollbar"></div>
        <div class="p-3 border-t border-gold/10">
          <div id="ai-quick-replies" class="flex flex-wrap gap-2 mb-3"></div>
          <div class="flex gap-2">
            <input id="ai-chat-input" type="text" placeholder="Sorunuzu yazın..." class="flex-1 bg-navy border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/50">
            <button id="ai-chat-send" class="bg-gold text-navy px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-gold-light transition-colors">Gönder</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(widget);
  },

  bindEvents() {
    document.getElementById('ai-chat-toggle')?.addEventListener('click', () => this.toggle());
    document.getElementById('ai-chat-close')?.addEventListener('click', () => this.toggle(false));
    document.getElementById('ai-chat-send')?.addEventListener('click', () => this.sendUserMessage());
    document.getElementById('ai-chat-input')?.addEventListener('keypress', e => {
      if (e.key === 'Enter') this.sendUserMessage();
    });
  },

  toggle(open) {
    this.isOpen = open !== undefined ? open : !this.isOpen;
    const panel = document.getElementById('ai-chat-panel');
    const btn = document.getElementById('ai-chat-toggle');
    if (this.isOpen) {
      panel.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
      panel.classList.add('scale-100', 'opacity-100');
      btn.classList.add('scale-0');
      if (this.messages.length === 0) this.startConversation();
    } else {
      panel.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
      panel.classList.remove('scale-100', 'opacity-100');
      btn.classList.remove('scale-0');
    }
  },

  startConversation() {
    this.addBotMessage('Merhaba! Ben RAVANON AI Güzellik Danışmanınız. Size en uygun ürünleri bulmama yardımcı olun. 🌟');
    this.showQuickReplies(['2026 trendleri', 'Glass skin rutini', 'Kuru cilt için öneri', 'Vegan ürünler']);
  },

  showQuickReplies(replies) {
    const container = document.getElementById('ai-quick-replies');
    if (!container) return;
    container.innerHTML = replies.map(r =>
      `<button class="quick-reply-btn text-xs px-3 py-1.5 rounded-full border border-gold/30 text-gold hover:bg-gold/10 transition-colors">${r}</button>`
    ).join('');
    container.querySelectorAll('.quick-reply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('ai-chat-input').value = btn.textContent;
        this.sendUserMessage();
      });
    });
  },

  addBotMessage(text, products = null) {
    this.messages.push({ role: 'bot', text });
    const container = document.getElementById('ai-chat-messages');
    const div = document.createElement('div');
    div.className = 'flex gap-2 items-start';
    let productHTML = '';
    if (products && products.length) {
      productHTML = `<div class="mt-2 space-y-2">${products.map(p => `
        <a href="product.html?id=${p.id}" class="flex items-center gap-2 p-2 bg-navy rounded-lg hover:bg-navy/80 transition-colors">
          <div class="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden">${getProductImageHTML(p, 'mini')}</div>
          <div class="min-w-0">
            <p class="text-xs text-cream truncate">${p.name}</p>
            <p class="text-xs text-gold">${formatPrice(p.price)}</p>
          </div>
        </a>`).join('')}</div>`;
    }
    div.innerHTML = `
      <div class="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-xs flex-shrink-0">🤖</div>
      <div class="bg-navy rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%]">
        <p class="text-sm text-cream/90 leading-relaxed">${text}</p>
        ${productHTML}
      </div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  addUserMessage(text) {
    this.messages.push({ role: 'user', text });
    const container = document.getElementById('ai-chat-messages');
    const div = document.createElement('div');
    div.className = 'flex gap-2 items-start justify-end';
    div.innerHTML = `
      <div class="bg-gold/20 rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
        <p class="text-sm text-cream">${text}</p>
      </div>
      <div class="w-7 h-7 rounded-full bg-rose-gold/20 flex items-center justify-center text-xs flex-shrink-0">👤</div>`;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  },

  sendUserMessage() {
    const input = document.getElementById('ai-chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    this.addUserMessage(text);
    document.getElementById('ai-quick-replies').innerHTML = '';
    setTimeout(() => this.processMessage(text), 400);
  },

  async processMessage(text) {
    const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;
    const api = (window.RAVANON_API || 'http://localhost:3000/api') + '/ai/chat';

    try {
      const res = await fetch(api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          userId: user?.id ? String(user.id) : undefined,
          userEmail: user?.email,
          userName: user?.name,
          skinType: this.context.skinType
        }),
        mode: 'cors'
      });
      if (res.ok) {
        const data = await res.json();
        const products = (data.products || [])
          .map(p => getProductById(p.id) || p)
          .filter(p => p && p.name);
        this.addBotMessage(data.response, products.length ? products : null);
        if (data.quickReplies?.length) this.showQuickReplies(data.quickReplies);
        return;
      }
    } catch (_) { /* admin kapalı — yerel mod */ }

    this.processMessageLocal(text);
  },

  processMessageLocal(text) {
    const lower = text.toLowerCase();
    let response = '';
    let products = [];

    if (lower.includes('kuru') || lower.includes('nem')) {
      this.context.skinType = 'Kuru';
      products = this.recommendProducts({ skinType: 'Kuru', concern: 'nem' });
      response = 'Kuru ciltler için nem bariyerini güçlendiren ürünler öneriyorum. Hyaluronik asit ve seramid içeren formüller idealdir:';
    } else if (lower.includes('yağlı') || lower.includes('gözenek') || lower.includes('akne')) {
      this.context.skinType = 'Yağlı';
      products = this.recommendProducts({ skinType: 'Yağlı', concern: 'gözenek' });
      response = 'Yağlı ve karma ciltler için hafif, gözenek tıkamayan formüller seçtim. Niacinamide harika bir seçenek:';
    } else if (lower.includes('hassas')) {
      this.context.skinType = 'Hassas';
      products = this.recommendProducts({ skinType: 'Hassas' });
      response = 'Hassas ciltler için parfümsüz, hipoalerjenik ürünler öneriyorum:';
    } else if (lower.includes('makyaj') || lower.includes('fondöten') || lower.includes('ruj')) {
      products = RAVANON_DATA.products.filter(p => p.category === 'makyaj').sort((a, b) => b.rating - a.rating).slice(0, 3);
      response = 'En popüler makyaj ürünlerimizden birkaçını seçtim:';
    } else if (lower.includes('bütçe') || lower.includes('ucuz') || lower.includes('ekonomik')) {
      products = [...RAVANON_DATA.products].sort((a, b) => a.price - b.price).slice(0, 3);
      response = 'Bütçe dostu ama kaliteli seçenekler:';
    } else if (lower.includes('saç')) {
      products = RAVANON_DATA.products.filter(p => p.category === 'sac-bakimi').slice(0, 3);
      response = 'Saç bakım rutininiz için önerilerim:';
    } else if (lower.includes('parfüm') || lower.includes('koku')) {
      products = RAVANON_DATA.products.filter(p => p.category === 'parfum').slice(0, 3);
      response = 'En sevilen parfüm ve vücut spreylerimiz:';
    } else if (lower.includes('vegan')) {
      products = RAVANON_DATA.products.filter(p => p.vegan).slice(0, 3);
      response = 'Vegan sertifikalı ürünlerimiz:';
    } else if (lower.includes('anti') || lower.includes('kırışık') || lower.includes('aging')) {
      products = RAVANON_DATA.products.filter(p => p.tags?.includes('anti-aging') || p.tags?.includes('kırışıklık')).slice(0, 3);
      if (!products.length) products = this.recommendProducts({ concern: 'kırışıklık' });
      response = 'Anti-aging rutininiz için peptit ve retinol bazlı öneriler:';
    } else if (lower.includes('cilt tip')) {
      response = 'Cilt tipinizi belirlemek için birkaç soru sorayım:\n\n• Cildiniz gün içinde parlaklaşıyor mu? → Yağlı/Karma\n• Sık sık gerginlik hissediyor musunuz? → Kuru\n• Kızarıklık ve tahriş yaşıyor musunuz? → Hassas\n\nDaha detaylı analiz için "AI Rutin Quiz"ini deneyin!';
      this.showQuickReplies(['Kuru cilt', 'Yağlı cilt', 'Hassas cilt', 'Quiz\'e git']);
    } else if (lower.includes('quiz')) {
      response = 'Harika seçim! Ana sayfadaki "AI ile Rutinini Keşfet" butonuna tıklayarak kişiselleştirilmiş rutininizi oluşturabilirsiniz.';
      this.showQuickReplies(['Kuru cilt için öneri', 'Makyaj önerisi']);
    } else if (lower.includes('trend') || lower.includes('2026')) {
      response = '2026\'nın öne çıkan güzellik trendleri: Skinimalism (az ürün, max etki), Glass Skin, peptit bazlı bakım ve sürdürülebilir refill ambalajlar. RAVANON\'da hepsini keşfedebilirsiniz!';
      products = RAVANON_DATA.products.filter(p => p.new || p.bestseller).slice(0, 3);
      this.showQuickReplies(['Glass skin rutini', 'Vegan ürünler', 'Anti-aging']);
    } else if (lower.includes('glass')) {
      products = RAVANON_DATA.products.filter(p => p.tags?.includes('nem') || p.tags?.includes('aydınlatma')).slice(0, 3);
      response = 'Glass Skin için hyaluronik asit serumu, hafif nemlendirici ve SPF içeren bir rutin öneriyorum:';
    } else if (lower.includes('sürdür') || lower.includes('vegan') || lower.includes('eco')) {
      products = RAVANON_DATA.products.filter(p => p.vegan || p.crueltyFree).slice(0, 3);
      response = 'Sürdürülebilir güzellik seçeneklerimiz — vegan ve cruelty-free sertifikalı ürünler:';
    } else {
      products = RAVANON_DATA.products.filter(p => p.bestseller).slice(0, 3);
      response = 'Size en çok satan ürünlerimizi önerebilirim. Daha spesifik öneriler için cilt tipinizi veya endişelerinizi paylaşın:';
      this.showQuickReplies(['Kuru cilt için öneri', 'Makyaj önerisi', 'Bütçe dostu', 'Vegan ürünler']);
    }

    this.addBotMessage(response, products);
  },

  recommendProducts({ skinType, concern, maxPrice } = {}) {
    let filtered = [...RAVANON_DATA.products];
    if (skinType) filtered = filtered.filter(p => p.skinType?.includes(skinType));
    if (concern) filtered = filtered.filter(p => p.tags?.some(t => t.includes(concern)));
    if (maxPrice) filtered = filtered.filter(p => p.price <= maxPrice);
    return filtered.sort((a, b) => b.rating - a.rating).slice(0, 3);
  }
};