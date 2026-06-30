/* RAVANON — Kargo entegrasyonu (admin gateway) */
const Shipping = {
  _methods: null,
  _lastSubtotal: 0,

  _api() {
    return (window.RAVANON_API || 'http://localhost:3000/api');
  },

  async loadMethods(subtotal) {
    const st = subtotal ?? 0;
    if (this._methods && this._lastSubtotal === st) return this._methods;
    try {
      const res = await fetch(this._api() + '/shipping/methods?subtotal=' + st, { mode: 'cors' });
      if (!res.ok) throw new Error('methods');
      const data = await res.json();
      this._methods = data.methods || [];
      this._lastSubtotal = st;
      return this._methods;
    } catch {
      this._methods = [
        { methodId: 'free-hepsijet', carrierId: 'hepsijet', serviceId: 'standard', type: 'free', name: 'Ücretsiz Kargo', description: '750 TL ve üzeri', logo: '⚡', price: 0, etaDays: 2, etaLabel: '2 iş günü' },
        { methodId: 'hepsijet-express', carrierId: 'hepsijet', serviceId: 'express', type: 'delivery', name: 'HepsiJet — Hızlı Teslimat', description: '1 iş günü', logo: '⚡', price: 89.9, etaDays: 1, etaLabel: '1 iş günü' },
        { methodId: 'yurtici-standard', carrierId: 'yurtici', serviceId: 'standard', type: 'delivery', name: 'Yurtiçi Kargo — Standart', description: '2 iş günü', logo: '📦', price: 44.9, etaDays: 2, etaLabel: '2 iş günü' },
        { methodId: 'pickup', carrierId: 'pickup', serviceId: 'pickup', type: 'pickup', name: 'Mağazadan Teslimat', description: 'Click & Collect', logo: '🏪', price: 0, etaDays: 0, etaLabel: 'Aynı gün' }
      ];
      this._lastSubtotal = st;
      return this._methods;
    }
  },

  async quote(methodId, subtotal, city) {
    const res = await fetch(this._api() + '/shipping/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ methodId, subtotal, city }),
      mode: 'cors'
    });
    const data = await res.json().catch(() => ({}));
    return data.quote || null;
  },

  getSelectedMethod() {
    const el = document.querySelector('input[name="shipping"]:checked');
    if (!el) return null;
    const methodId = el.value;
    return (this._methods || []).find(m => m.methodId === methodId) || {
      methodId,
      carrierId: el.dataset?.carrier || methodId,
      serviceId: el.dataset?.service || 'standard',
      type: methodId === 'pickup' ? 'pickup' : 'delivery',
      price: Number(el.dataset?.price || 0),
      etaDays: Number(el.dataset?.eta || 2)
    };
  },

  getCost(subtotal) {
    const m = this.getSelectedMethod();
    if (!m) return calculateShippingFallback(subtotal, 'standard');
    if (m.type === 'pickup' || m.type === 'free' || m.price === 0) return 0;
    return m.price;
  },

  buildOrderMethod() {
    const m = this.getSelectedMethod();
    if (!m) return null;
    return {
      methodId: m.methodId,
      carrierId: m.carrierId,
      serviceId: m.serviceId,
      type: m.type,
      price: m.price,
      etaDays: m.etaDays
    };
  }
};

function calculateShippingFallback(subtotal, method) {
  const freeMin = window.RAVANON_FREE_SHIPPING_MIN ?? 750;
  if (method === 'free' || method === 'pickup' || subtotal >= freeMin) return 0;
  const rates = { standard: 49.90, express: 89.90 };
  return rates[method] || 49.90;
}