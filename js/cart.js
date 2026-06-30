/* RAVANON - Cart, Wishlist & Orders */
const Cart = {
  get() { return Storage.get('cart', []); },
  save(items) { Storage.set('cart', items); this.updateBadge(); },
  
  add(productId, qty = 1) {
    const product = getProductById(productId);
    if (!product) return;
    const cart = this.get();
    const existing = cart.find(i => i.productId === productId);
    if (existing) existing.quantity += qty;
    else cart.push({ productId, quantity: qty, addedAt: Date.now() });
    this.save(cart);
    showToast(`${product.name} sepete eklendi`);
  },

  remove(productId) {
    this.save(this.get().filter(i => i.productId !== productId));
    showToast('Ürün sepetten kaldırıldı', 'info');
  },

  updateQty(productId, qty) {
    const cart = this.get();
    const item = cart.find(i => i.productId === productId);
    if (item) {
      if (qty <= 0) this.remove(productId);
      else { item.quantity = qty; this.save(cart); }
    }
  },

  clear() { this.save([]); },

  getItems() {
    return this.get().map(item => {
      const product = getProductById(item.productId);
      return product ? { ...item, product } : null;
    }).filter(Boolean);
  },

  getSubtotal() {
    return this.getItems().reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  },

  getCount() {
    return this.get().reduce((sum, i) => sum + i.quantity, 0);
  },

  updateBadge() {
    const count = this.getCount();
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = count;
      el.classList.toggle('hidden', count === 0);
    });
  }
};

const Wishlist = {
  get() { return Storage.get('wishlist', []); },
  save(items) { Storage.set('wishlist', items); this.updateBadge(); },

  toggle(productId) {
    const list = this.get();
    const idx = list.indexOf(productId);
    if (idx >= 0) {
      list.splice(idx, 1);
      showToast('Favorilerden kaldırıldı', 'info');
    } else {
      list.push(productId);
      const p = getProductById(productId);
      showToast(`${p?.name || 'Ürün'} favorilere eklendi`);
    }
    this.save(list);
    return list.includes(productId);
  },

  has(productId) { return this.get().includes(productId); },

  updateBadge() {
    const count = this.get().length;
    document.querySelectorAll('.wishlist-badge').forEach(el => {
      el.textContent = count;
      el.classList.toggle('hidden', count === 0);
    });
  }
};

const Orders = {
  get() { return Storage.get('orders', []); },

  getForUser(userId) {
    if (!userId) return [];
    const sid = String(userId);
    return this.get().filter(o => String(o.userId) === sid);
  },

  create(orderData) {
    const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;
    const orders = this.get();
    const order = {
      id: generateOrderId(),
      userId: user?.id ? String(user.id) : null,
      userEmail: user?.email || orderData.shippingAddress?.email || null,
      ...orderData,
      createdAt: Date.now(),
      status: 'Hazırlanıyor'
    };
    orders.unshift(order);
    Storage.set('orders', orders);
    this.syncToAdmin(order);
    return order;
  },

  syncToAdmin(order) {
    const api = window.RAVANON_API || 'http://localhost:3000/api';
    fetch(api + '/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
      mode: 'cors'
    }).then(function (r) {
      if (r.ok) console.info('[RAVANON] Sipariş admin panele gönderildi:', order.id);
    }).catch(function () { /* admin kapalı */ });
  }
};

const Discount = {
  applied: null,
  
  apply(code) {
    const upper = code.toUpperCase().trim();
    const discount = RAVANON_DATA.discountCodes[upper];
    if (!discount) { showToast('Geçersiz indirim kodu', 'error'); return false; }
    const subtotal = Cart.getSubtotal();
    if (subtotal < discount.min) {
      showToast(`Minimum ${formatPrice(discount.min)} alışveriş gerekli`, 'error');
      return false;
    }
    this.applied = { code: upper, ...discount };
    showToast(`${upper} kodu uygulandı!`);
    return true;
  },

  clear() { this.applied = null; },

  calculate(subtotal) {
    if (!this.applied) return 0;
    if (this.applied.type === 'percent') return subtotal * (this.applied.value / 100);
    return Math.min(this.applied.value, subtotal);
  }
};

function calculateShipping(subtotal, method) {
  const freeMin = window.RAVANON_FREE_SHIPPING_MIN ?? RAVANON_DATA.clubSettings?.freeShippingMin ?? 750;
  if (method === 'free' || subtotal >= freeMin) return 0;
  const rates = { standard: 49.90, express: 89.90, pickup: 0 };
  return rates[method] || 49.90;
}

function calculatePointsEarned(total) {
  const user = typeof Auth !== 'undefined' ? Auth.getUser() : null;
  if (!user) return 0;
  return Club.calculateEarned(total, user.points || 0);
}