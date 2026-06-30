/* RAVANON — Ödeme altyapısı (admin gateway) */
const Payments = {
  _methods: null,
  _bank: null,

  _api() {
    return (window.RAVANON_API || 'http://localhost:3000/api');
  },

  async loadMethods() {
    if (this._methods) return { methods: this._methods, bank: this._bank };
    try {
      const res = await fetch(this._api() + '/payments/methods', { mode: 'cors' });
      if (!res.ok) throw new Error('methods');
      const data = await res.json();
      this._methods = data.methods || [];
      this._bank = data.bankAccount || null;
      return { methods: this._methods, bank: this._bank };
    } catch {
      this._methods = [
        { id: 'iyzico', name: 'iyzico', type: 'card', logo: '💳', testMode: true, supportedInstallments: [1, 3, 6, 9, 12] },
        { id: 'papara', name: 'Papara', type: 'wallet', logo: '📱', testMode: true, supportedInstallments: [1] },
        { id: 'havale', name: 'Havale / EFT', type: 'transfer', logo: '🏛️', testMode: false, supportedInstallments: [1] }
      ];
      return { methods: this._methods, bank: null };
    }
  },

  async process(payload) {
    const res = await fetch(this._api() + '/payments/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'cors'
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok && !data.payment) {
      return { success: false, status: 'failed', message: data.error || 'Ödeme işlenemedi' };
    }
    return data.payment || data;
  },

  parseCardForm() {
    const num = document.getElementById('card-number')?.value || '';
    const exp = document.getElementById('card-expiry')?.value || '';
    const cvc = document.getElementById('card-cvc')?.value || '';
    const [mm, yy] = exp.split('/');
    const sel = document.getElementById('card-installment');
    const installmentLabel = sel?.value || 'Tek Çekim';
    const installment = installmentLabel.includes('3') ? 3 : installmentLabel.includes('6') ? 6 : installmentLabel.includes('9') ? 9 : installmentLabel.includes('12') ? 12 : 1;
    return {
      card: {
        number: num,
        expireMonth: (mm || '').trim(),
        expireYear: (yy || '').trim(),
        cvc: cvc.trim(),
        holderName: document.getElementById('ship-name')?.value || 'Musteri'
      },
      installment
    };
  },

  needsCard(providerId) {
    return providerId === 'card' || providerId === 'iyzico' || providerId === 'paytr' || providerId === 'stripe' || providerId === 'taksit';
  }
};