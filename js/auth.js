/* RAVANON - Auth & RAVANON Club Loyalty */
const Club = {
  WELCOME_BONUS: 100,
  POINT_RATES: { bronze: 10, silver: 8, gold: 6, platinum: 4 },

  getRate(tierId) {
    const rates = this.POINT_RATES || {};
    if (rates[tierId]) return rates[tierId];
    const tier = (RAVANON_DATA.clubTiers || []).find(t => t.id === tierId);
    return tier?.pointRate || 10;
  },

  calculateEarned(orderTotal, userPoints = 0) {
    const tier = getClubTier(userPoints || 0);
    const rate = this.getRate(tier.id);
    return Math.max(1, Math.floor(orderTotal / rate));
  },

  getRateLabel(tierId) {
    const rate = this.getRate(tierId);
    return `Her ${rate} TL = 1 puan`;
  }
};

const Auth = {
  _apiBase() {
    return window.RAVANON_API || 'http://localhost:3000/api';
  },

  _normalizePhone(phone) {
    return String(phone || '').replace(/\D/g, '').slice(-10);
  },

  async _postUsers(body) {
    try {
      const res = await fetch(this._apiBase() + '/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        mode: 'cors'
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok, status: res.status, data };
    } catch {
      return { ok: false, status: 0, data: {} };
    }
  },

  _serverToLocal(serverUser, password) {
    const created = serverUser.createdAt;
    return {
      id: serverUser.id,
      name: serverUser.name,
      email: serverUser.email,
      phone: serverUser.phone || '',
      password: password || serverUser.password || '',
      points: serverUser.points ?? serverUser.clubPoints ?? 0,
      tier: serverUser.tier ?? serverUser.clubTier ?? 'bronze',
      lifetimeSpend: serverUser.lifetimeSpend ?? 0,
      totalOrders: serverUser.totalOrders ?? 0,
      birthday: serverUser.birthday || '',
      addresses: serverUser.addresses || [],
      pointHistory: serverUser.pointHistory || [],
      clubJoinedAt: serverUser.clubJoinedAt || Date.now(),
      createdAt: typeof created === 'string' ? Date.parse(created) : (created || Date.now()),
      status: serverUser.status || 'active'
    };
  },

  _saveLocalUser(user) {
    const users = Storage.get('users', []);
    const idx = users.findIndex(u => String(u.id) === String(user.id));
    if (idx >= 0) users[idx] = { ...users[idx], ...user };
    else users.push(user);
    Storage.set('users', users);
    const safe = this._toSafeUser(users[idx >= 0 ? idx : users.length - 1]);
    Storage.set('user', safe);
    window.dispatchEvent(new CustomEvent('ravanon-club-update', { detail: safe }));
    return safe;
  },

  syncToAdmin(user) {
    if (!user) return;
    this._postUsers({
      action: 'sync',
      id: String(user.id),
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      points: user.points,
      tier: user.tier,
      lifetimeSpend: user.lifetimeSpend,
      totalOrders: user.totalOrders,
      birthday: user.birthday,
      pointHistory: user.pointHistory,
      clubJoinedAt: user.clubJoinedAt,
      createdAt: user.createdAt
    }).then(r => {
      if (r.ok) console.info('[RAVANON] Kullanıcı admin panele senkronize edildi:', user.email);
    });
  },

  getUser() {
    const session = Storage.get('user', null);
    if (!session) return null;
    const users = Storage.get('users', []);
    const fresh = users.find(u => String(u.id) === String(session.id));
    if (!fresh) {
      Storage.set('user', null);
      return null;
    }
    if (fresh.status === 'banned') {
      Storage.set('user', null);
      return null;
    }
    return this._toSafeUser(fresh);
  },

  _toSafeUser(user) {
    const { password, ...safe } = user;
    safe.points = safe.points || 0;
    safe.lifetimeSpend = safe.lifetimeSpend || 0;
    safe.pointHistory = safe.pointHistory || [];
    safe.tier = getClubTier(safe.points).id;
    return safe;
  },

  _persistUser(user) {
    const users = Storage.get('users', []);
    const idx = users.findIndex(u => String(u.id) === String(user.id));
    if (idx < 0) return null;
    users[idx] = user;
    Storage.set('users', users);
    const safe = this._toSafeUser(user);
    Storage.set('user', safe);
    this.syncToAdmin(user);
    window.dispatchEvent(new CustomEvent('ravanon-club-update', { detail: safe }));
    return safe;
  },

  isLoggedIn() { return !!this.getUser(); },

  async register(data) {
    const welcomeBonus = RAVANON_DATA.clubSettings?.welcomeBonus ?? Club.WELCOME_BONUS;
    const result = await this._postUsers({
      action: 'register',
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      birthday: data.birthday,
      points: welcomeBonus
    });

    if (result.ok && result.data.user) {
      const local = this._serverToLocal(result.data.user, data.password);
      local.pointHistory = [{
        id: Date.now(),
        type: 'welcome',
        amount: welcomeBonus,
        description: 'RAVANON Club hoş geldin bonusu',
        orderId: null,
        createdAt: Date.now()
      }];
      local.addresses = [];
      local.birthday = data.birthday || '';
      this._saveLocalUser(local);
      showToast(`RAVANON Club'a hoş geldiniz! ${welcomeBonus} puan hediye 🎉`);
      return true;
    }

    if (result.status === 400 && result.data.error) {
      showToast(result.data.error, 'error');
      return false;
    }

    const users = Storage.get('users', []);
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      showToast('Bu e-posta zaten kayıtlı', 'error');
      return false;
    }
    if (data.phone) {
      const np = this._normalizePhone(data.phone);
      if (users.some(u => u.phone && this._normalizePhone(u.phone) === np)) {
        showToast('Bu telefon numarası zaten kayıtlı', 'error');
        return false;
      }
    }

    const user = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone || '',
      points: welcomeBonus,
      tier: 'bronze',
      lifetimeSpend: 0,
      totalOrders: 0,
      birthday: data.birthday || '',
      addresses: [],
      pointHistory: [{
        id: Date.now(),
        type: 'welcome',
        amount: welcomeBonus,
        description: 'RAVANON Club hoş geldin bonusu',
        orderId: null,
        createdAt: Date.now()
      }],
      clubJoinedAt: Date.now(),
      createdAt: Date.now(),
      status: 'active'
    };
    users.push(user);
    Storage.set('users', users);
    Storage.set('user', this._toSafeUser(user));
    this.syncToAdmin(user);
    window.dispatchEvent(new CustomEvent('ravanon-club-update', { detail: this._toSafeUser(user) }));
    showToast(`RAVANON Club'a hoş geldiniz! ${welcomeBonus} puan hediye 🎉`);
    return true;
  },

  async login(identifier, password) {
    const result = await this._postUsers({
      action: 'login',
      identifier: identifier.trim(),
      password
    });

    if (result.ok && result.data.user) {
      const server = result.data.user;
      if (server.status === 'banned') {
        showToast('Hesabınız askıya alınmış', 'error');
        return false;
      }
      const users = Storage.get('users', []);
      const existing = users.find(u => String(u.id) === String(server.id));
      const local = this._serverToLocal(server, password);
      if (existing) {
        local.addresses = existing.addresses || [];
        local.pointHistory = existing.pointHistory?.length ? existing.pointHistory : local.pointHistory;
        local.birthday = existing.birthday || local.birthday;
      }
      this._saveLocalUser(local);
      const tier = getClubTier(local.points);
      showToast(`Tekrar hoş geldiniz, ${local.name}! ${tier.name} üye · ${local.points} puan`);
      return true;
    }

    if (result.status === 401 && result.data.error) {
      showToast(result.data.error, 'error');
      return false;
    }

    const users = Storage.get('users', []);
    const idLower = identifier.toLowerCase().trim();
    const phoneNorm = this._normalizePhone(identifier);
    const user = users.find(u => {
      if (u.status === 'banned') return false;
      if (u.email.toLowerCase() === idLower && u.password === password) return true;
      if (u.phone && this._normalizePhone(u.phone) === phoneNorm && u.password === password) return true;
      return false;
    });
    if (!user) {
      showToast('E-posta/telefon veya şifre hatalı', 'error');
      return false;
    }
    const safe = this._toSafeUser(user);
    Storage.set('user', safe);
    window.dispatchEvent(new CustomEvent('ravanon-club-update', { detail: safe }));
    const tier = getClubTier(safe.points);
    showToast(`Tekrar hoş geldiniz, ${user.name}! ${tier.name} üye · ${safe.points} puan`);
    return true;
  },

  logout() {
    Storage.set('user', null);
    showToast('Çıkış yapıldı', 'info');
    setTimeout(() => window.location.href = 'index.html', 500);
  },

  updateProfile(data) {
    const user = this.getUser();
    if (!user) return;
    const users = Storage.get('users', []);
    const idx = users.findIndex(u => String(u.id) === String(user.id));
    if (idx >= 0) {
      Object.assign(users[idx], data);
      this._persistUser(users[idx]);
      showToast('Profil güncellendi');
    }
  },

  addPoints(amount, meta = {}) {
    const user = this.getUser();
    if (!user || amount <= 0) return null;

    const users = Storage.get('users', []);
    const idx = users.findIndex(u => String(u.id) === String(user.id));
    if (idx < 0) return null;

    const oldPoints = users[idx].points || 0;
    const oldTier = getClubTier(oldPoints);
    const newPoints = oldPoints + amount;

    users[idx].points = newPoints;
    users[idx].tier = getClubTier(newPoints).id;
    users[idx].pointHistory = users[idx].pointHistory || [];
    users[idx].pointHistory.unshift({
      id: Date.now(),
      type: meta.type || 'purchase',
      amount,
      description: meta.description || 'Puan kazanımı',
      orderId: meta.orderId || null,
      createdAt: Date.now()
    });
    if (users[idx].pointHistory.length > 50) {
      users[idx].pointHistory = users[idx].pointHistory.slice(0, 50);
    }

    const newTier = getClubTier(newPoints);
    const result = {
      earned: amount,
      newTotal: newPoints,
      oldTier,
      newTier,
      tierUpgraded: newTier.id !== oldTier.id
    };

    const safe = this._persistUser(users[idx]);
    return { ...result, user: safe };
  },

  recordPurchase(orderTotal, orderId) {
    const user = this.getUser();
    if (!user) return null;

    const users = Storage.get('users', []);
    const idx = users.findIndex(u => String(u.id) === String(user.id));
    if (idx < 0) return null;

    const pointsEarned = Club.calculateEarned(orderTotal, users[idx].points || 0);

    users[idx].lifetimeSpend = (users[idx].lifetimeSpend || 0) + orderTotal;
    users[idx].totalOrders = (users[idx].totalOrders || 0) + 1;
    Storage.set('users', users);

    const result = this.addPoints(pointsEarned, {
      type: 'purchase',
      description: `Sipariş alışverişi (${formatPrice(orderTotal)})`,
      orderId
    });

    if (result?.tierUpgraded) {
      setTimeout(() => {
        showToast(`🎉 Tebrikler! ${result.newTier.name} seviyesine yükseldiniz!`, 'success');
      }, 500);
    }

    return result;
  },

  addAddress(address) {
    const user = this.getUser();
    if (!user) return;
    const users = Storage.get('users', []);
    const idx = users.findIndex(u => String(u.id) === String(user.id));
    if (idx >= 0) {
      const addr = { id: Date.now(), ...address };
      users[idx].addresses = users[idx].addresses || [];
      users[idx].addresses.push(addr);
      this._persistUser(users[idx]);
      showToast('Adres eklendi');
      return addr;
    }
  },

  removeAddress(addrId) {
    const user = this.getUser();
    if (!user) return;
    const users = Storage.get('users', []);
    const idx = users.findIndex(u => String(u.id) === String(user.id));
    if (idx >= 0) {
      users[idx].addresses = (users[idx].addresses || []).filter(a => a.id !== addrId);
      this._persistUser(users[idx]);
      showToast('Adres silindi', 'info');
    }
  },

  async acceptInvite(token, data) {
    const result = await this._postUsers({
      action: 'accept-invite',
      token,
      password: data.password,
      phone: data.phone,
      birthday: data.birthday
    });
    if (result.ok && result.data.user) {
      const local = this._serverToLocal(result.data.user, data.password);
      local.pointHistory = result.data.user.pointHistory || local.pointHistory || [];
      local.addresses = [];
      this._saveLocalUser(local);
      showToast('Davet kabul edildi! RAVANON Club\'a hoş geldiniz 🎉');
      return true;
    }
    showToast(result.data?.error || 'Davet kabul edilemedi', 'error');
    return false;
  },

  async impersonateLogin(userId, email, token) {
    const result = await this._postUsers({
      action: 'impersonate-login',
      userId: String(userId),
      email,
      token
    });
    if (result.ok && result.data.user) {
      const local = this._serverToLocal(result.data.user, '');
      const users = Storage.get('users', []);
      const idx = users.findIndex(u => String(u.id) === String(local.id));
      if (idx >= 0) {
        local.addresses = users[idx].addresses || [];
        local.pointHistory = users[idx].pointHistory?.length ? users[idx].pointHistory : local.pointHistory;
      }
      this._saveLocalUser(local);
      showToast(`Admin görünümü: ${local.name}`, 'info');
      return true;
    }
    showToast(result.data?.error || 'Oturum açılamadı', 'error');
    return false;
  },

  async handleAccountParams() {
    const params = new URLSearchParams(window.location.search);
    const invite = params.get('invite');
    const impersonate = params.get('impersonate');
    const email = params.get('email');
    const token = params.get('token');

    if (impersonate && email && token) {
      const ok = await this.impersonateLogin(impersonate, email, token);
      if (ok) {
        history.replaceState(null, '', 'account.html');
        return 'impersonate';
      }
    }

    if (invite) {
      return { type: 'invite', token: invite };
    }

    return null;
  },

  getClubSummary() {
    const user = this.getUser();
    if (!user) return null;
    const tier = getClubTier(user.points || 0);
    const next = getNextTier(user.points || 0);
    const progress = next
      ? ((user.points - tier.minPoints) / (next.minPoints - tier.minPoints)) * 100
      : 100;
    return {
      user,
      tier,
      next,
      progress: Math.min(100, Math.max(0, progress)),
      rate: Club.getRate(tier.id),
      rateLabel: Club.getRateLabel(tier.id)
    };
  }
};