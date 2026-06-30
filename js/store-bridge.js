/* RAVANON — Admin panel ile tam canlı veri senkronizasyonu */
(function () {
  const ADMIN_API = 'http://localhost:3000/api/store';
  const LOCAL = {
    products: 'data/products.json',
    campaigns: 'data/campaigns.json',
    club: 'data/club.json',
  };

  function normalizeProduct(p) {
    return { ...p, skinType: p.skinType || p.skinTypes || [], originalPrice: p.originalPrice ?? null, active: p.active !== false };
  }

  function filterActive(products) {
    return (products || []).filter(function (p) { return p.active !== false; });
  }

  function applyStoreData(data, source) {
    if (!data) return false;
    var changed = false;

    if (data.products && data.products.length) {
      RAVANON_DATA.products = data.products.map(normalizeProduct);
      changed = true;
    }
    if (data.discountCodes) {
      RAVANON_DATA.discountCodes = data.discountCodes;
      changed = true;
    }
    if (data.clubTiers && data.clubTiers.length) {
      RAVANON_DATA.clubTiers = data.clubTiers;
      changed = true;
    }
    if (data.clubSettings) {
      RAVANON_DATA.clubSettings = data.clubSettings;
      changed = true;
    }

    RAVANON_DATA._syncSource = source;
    RAVANON_DATA._syncedAt = data.updatedAt || new Date().toISOString();
    applyClubConfig();
    return changed;
  }

  function applyClubConfig() {
    if (typeof Club === 'undefined') return;
    var settings = RAVANON_DATA.clubSettings || {};
    var tiers = RAVANON_DATA.clubTiers || [];
    Club.WELCOME_BONUS = settings.welcomeBonus ?? 100;
    Club.POINT_RATES = {};
    tiers.forEach(function (t) { Club.POINT_RATES[t.id] = t.pointRate || 10; });
    if (!Club.POINT_RATES.bronze) Club.POINT_RATES = { bronze: 10, silver: 8, gold: 6, platinum: 4 };
    window.RAVANON_FREE_SHIPPING_MIN = settings.freeShippingMin ?? 750;
  }

  async function loadLocalFallback() {
    var merged = { products: null, discountCodes: null, clubTiers: null, clubSettings: null };
    try {
      var pRes = await fetch(LOCAL.products + '?t=' + Date.now());
      if (pRes.ok) { var pData = await pRes.json(); merged.products = filterActive(pData.products); }
    } catch (_) {}
    try {
      var cRes = await fetch(LOCAL.campaigns + '?t=' + Date.now());
      if (cRes.ok) {
        var cData = await cRes.json();
        var codes = {};
        var now = new Date();
        (cData.campaigns || []).forEach(function (c) {
          if (!c.active || (c.type !== 'percent' && c.type !== 'fixed')) return;
          if (new Date(c.startsAt) > now || new Date(c.endsAt) < now) return;
          codes[c.code.toUpperCase()] = { type: c.type, value: c.value, min: c.minOrder || 0 };
        });
        merged.discountCodes = codes;
      }
    } catch (_) {}
    try {
      var clRes = await fetch(LOCAL.club + '?t=' + Date.now());
      if (clRes.ok) {
        var clData = await clRes.json();
        merged.clubTiers = clData.tiers;
        merged.clubSettings = clData.settings;
      }
    } catch (_) {}
    return applyStoreData(merged, 'local-json');
  }

  window.RAVANON_STORE_READY = (async function () {
    try {
      var res = await fetch(ADMIN_API, { cache: 'no-store', mode: 'cors' });
      if (res.ok) {
        var data = await res.json();
        if (applyStoreData(data, 'admin-api')) {
          console.info('[RAVANON] Mağaza verisi admin panelden yüklendi ✓');
          return true;
        }
      }
    } catch (_) {}

    if (await loadLocalFallback()) {
      console.info('[RAVANON] Mağaza verisi JSON dosyalarından yüklendi ✓');
      return true;
    }

    applyClubConfig();
    console.info('[RAVANON] Yerleşik data.js kullanılıyor');
    return false;
  })();

  var lastSync = null;
  setInterval(async function () {
    try {
      var res = await fetch(ADMIN_API, { cache: 'no-store', mode: 'cors' });
      if (!res.ok) return;
      var data = await res.json();
      if (data.updatedAt && data.updatedAt !== lastSync) {
        lastSync = data.updatedAt;
        if (applyStoreData(data, 'admin-api')) {
          window.dispatchEvent(new CustomEvent('ravanon:store-updated', { detail: data }));
        }
      }
    } catch (_) {}
  }, 8000);

  window.onStoreReady = function (fn) {
    var run = function () { RAVANON_STORE_READY.then(fn); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
    else run();
  };

  window.addEventListener('ravanon:store-updated', function () {
    if (typeof ShopPage !== 'undefined' && ShopPage.applyFilters) ShopPage.applyFilters();
    if (typeof ProductPage !== 'undefined' && ProductPage.product) {
      var updated = getProductById(ProductPage.product.id);
      if (updated) { ProductPage.product = updated; ProductPage.render(); }
    }
    if (typeof CartPage !== 'undefined' && CartPage.render) CartPage.render();
  });

  window.RAVANON_API = 'http://localhost:3000/api';
})();