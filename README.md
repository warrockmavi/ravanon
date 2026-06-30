# RAVANON

Premium kozmetik e-ticaret platformu — AI destekli mağaza + tam özellikli admin panel.

| Bileşen | Teknoloji | Port |
|---------|-----------|------|
| **Mağaza** | HTML / CSS / JS + Tailwind | `8765` |
| **Admin Panel** | Next.js 16 + React 19 | `3000` |
| **Veri** | `data/*.json` (paylaşımlı) | — |

---

## GitHub'dan İndirme (Yeni PC)

### Gereksinimler

- [Node.js](https://nodejs.org/) **v20 veya üzeri** (LTS önerilir)
- Windows 10/11 (`.vbs` başlatıcılar için)
- Git (isteğe bağlı — ZIP indirme de çalışır)

### 1. Projeyi indirin

```bash
git clone https://github.com/warrockmavi/ravanon.git
cd ravanon
```

veya GitHub'dan **Download ZIP** ile indirip klasöre çıkarın.

### 2. Kurulum (bir kez)

`KURULUM.bat` dosyasına çift tıklayın. Bu adım:

- Admin panel bağımlılıklarını yükler (`npm install`)
- Masaüstüne RAVANON kısayolu oluşturur

Alternatif (komut satırı):

```bash
npm run setup
```

### 3. Başlatın (tek tık)

| Kısayol | Ne açar? |
|---------|----------|
| **`RAVANON.lnk`** | Mağaza → http://localhost:8765 |
| **`RAVANON Admin.lnk`** | Admin → http://localhost:3000/admin |
| `Baslat-Hepsi.vbs` | İkisini birden |
| **`Demo.vbs`** | Demo modu — admin açar + örnek sipariş bildirimi (ses + balon) |

> Kısayollar proje klasöründe ve masaüstünde oluşur.

### Klasörü başka yere kopyaladıysanız

`.lnk` dosyaları eski yolu tutar — **bir kez** şunu çalıştırın:

```
KISAYOLLAR.bat
```

Ardından `RAVANON.lnk` ve `RAVANON Admin.lnk` yeni klasörde çalışır.  
(Alternatif: `RAVANON.bat` / `RAVANON Admin.bat` her zaman doğru yolu kullanır.)

### 4. Admin girişi

| Alan | Değer |
|------|-------|
| URL | http://localhost:3000/admin/login |
| E-posta | `admin@ravanon.com` |
| Şifre | `Ravanon2026!` |

### 5. Kurulumu doğrulayın

```bash
npm run verify
```

---

## Mimari

```
Mağaza (8765)  ──POST──►  Admin API (3000)  ──►  data/*.json
Mağaza (8765)  ◄──GET───  /api/store         ◄──  data/*.json
```

Admin'de yapılan ürün, kampanya, kullanıcı ve sipariş değişiklikleri `data/` klasörüne yazılır; mağaza `js/store-bridge.js` ile anında senkronize olur.

---

## Klasör Yapısı

```
RAVANON/
├── index.html, shop.html, cart.html ...   # Mağaza sayfaları
├── js/                                     # Mağaza JavaScript
├── css/                                    # Stiller
├── data/                                   # Paylaşımlı JSON veritabanı
├── assets/                                 # İkon & görseller
├── admin/                                  # Next.js admin panel
│   ├── src/app/admin/                      # Admin sayfaları
│   ├── src/app/api/                        # REST API
│   └── Baslat-Admin.vbs                    # Admin başlatıcı
├── RAVANON.lnk                             # Tek tık — mağaza
├── RAVANON Admin.lnk                       # Tek tık — admin panel
├── Baslat.vbs / Baslat-Hepsi.vbs           # Alternatif başlatıcılar
├── KURULUM.bat                             # İlk kurulum
├── KISAYOLLAR.bat                          # Kısayolları yenile
└── scripts/                                # Yardımcı scriptler
```

---

## Geliştirici Komutları

```bash
# Admin bağımlılıkları
npm run setup

# Mağaza (statik sunucu)
npm run dev:store

# Admin (geliştirme modu)
npm run dev:admin

# Admin production build
npm run build:admin
```

---

## İndirim Kodları (Mağaza)

- `RAVANON20` — %20 indirim
- `CLUB50` — 50 TL indirim (min. 300 TL)
- `WELCOME15` — %15 indirim

---

## Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| Admin açılmıyor | `KURULUM.bat` tekrar çalıştırın |
| Mağaza admin'e bağlanamıyor | Admin'in 3000 portunda çalıştığından emin olun |
| `npm` çalışmıyor | Node.js kurulu mu kontrol edin, terminali yeniden açın |
| Port meşgul | `Sunucuyu-Kapat.bat` veya görev yöneticisinden node süreçlerini kapatın |

---

## Lisans

Özel proje — RAVANON © 2026