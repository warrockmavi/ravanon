/* RAVANON - Mock Product & Site Data */
const RAVANON_DATA = {
  brands: ['The Ordinary', 'The Inkey List', 'MAC', 'NARS', 'Fenty Beauty', 'Rare Beauty', 'Sol de Janeiro', 'CeraVe', 'La Roche-Posay', 'Flormar', 'Golden Rose', 'Pastel', 'L\'Oréal Paris', 'Maybelline', 'NYX', 'Dior', 'Charlotte Tilbury', 'Drunk Elephant', 'Glossier', 'BioNike', 'Bioderma', 'Moroccanoil', 'Olaplex', 'Chanel', 'COSRX', 'Beauty of Joseon', 'Laneige', 'Innisfree', 'SKIN1004', 'Anua', 'Round Lab', 'Torriden', 'RAVANON'],
  categories: [
    { id: 'makyaj', name: 'Makyaj', icon: '💄' },
    { id: 'cilt-bakimi', name: 'Cilt Bakımı', icon: '✨' },
    { id: 'sac-bakimi', name: 'Saç Bakımı', icon: '💇' },
    { id: 'parfum', name: 'Parfüm', icon: '🌸' },
    { id: 'vucut-bakimi', name: 'Vücut Bakımı', icon: '🧴' }
  ],
  collections: [
    {
      id: 'k-beauty',
      name: 'K-Beauty Glow',
      subtitle: 'Cam cilt, 10 adımlı rutin',
      emoji: '🇰🇷',
      gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C44569 50%, #F8B500 100%)',
      filter: { tags: ['k-beauty', 'glass-skin', 'nem'] },
      productIds: [38, 39, 40, 41, 43, 45, 46, 47, 48, 29, 35],
      tagline: 'TikTok\'un favori cam cilt koleksiyonu'
    },
    {
      id: 'clean-beauty',
      name: 'Clean Beauty',
      subtitle: 'Vegan · Cruelty-Free · Temiz formül',
      emoji: '🌿',
      gradient: 'linear-gradient(135deg, #00B894 0%, #55EFC4 50%, #81ECEC 100%)',
      filter: { vegan: true },
      productIds: [1, 2, 5, 6, 15, 18, 19, 27],
      tagline: 'Cildine ve gezegene iyi gelen seçimler'
    },
    {
      id: 'gen-z-picks',
      name: 'Gen Z Picks',
      subtitle: 'Viral ürünler, uygun fiyat',
      emoji: '✨',
      gradient: 'linear-gradient(135deg, #E91E8C 0%, #F48FB1 40%, #FF5252 100%)',
      filter: { new: true },
      productIds: [6, 12, 16, 20, 26, 29, 30, 33, 38, 39, 46, 48],
      tagline: 'For You sayfasından direkt sepete'
    },
    {
      id: 'viral-tiktok',
      name: 'Viral TikTok',
      subtitle: 'Milyonlarca izlenen ürünler',
      emoji: '📱',
      gradient: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 50%, #FD79A8 100%)',
      filter: { bestseller: true },
      productIds: [6, 17, 7, 25, 14, 31, 32],
      tagline: '#beautytok trendleri burada'
    },
    {
      id: 'soft-glam',
      name: 'Soft Glam Edit',
      subtitle: '2026\'nın en hot makyaj stili',
      emoji: '💗',
      gradient: 'linear-gradient(135deg, #E17055 0%, #FDCB6E 50%, #FF7675 100%)',
      filter: { category: 'makyaj' },
      productIds: [4, 6, 14, 17, 15, 34],
      tagline: 'Doğal ışıltı, lüks bitiş'
    },
    {
      id: 'glass-skin',
      name: 'Glass Skin Ritüeli',
      subtitle: 'Kore cam cilt rutini',
      emoji: '💎',
      gradient: 'linear-gradient(135deg, #74B9FF 0%, #A29BFE 50%, #FFEAA7 100%)',
      filter: { tags: ['nem', 'serum'] },
      productIds: [38, 46, 41, 47, 48, 29, 35, 2, 8],
      tagline: '3 katman nem = cam parlaklık'
    },
    {
      id: 'teen-glow',
      name: 'Teen Glow Starter',
      subtitle: 'İlk rutin için mükemmel set',
      emoji: '🌸',
      gradient: 'linear-gradient(135deg, #FD79A8 0%, #FDCB6E 50%, #E84393 100%)',
      filter: { priceMax: 500 },
      productIds: [11, 15, 19, 21, 29, 30],
      tagline: 'Genç ciltlere özel nazik formüller'
    },
    {
      id: 'luxury-night',
      name: 'Gece Lüksü',
      subtitle: 'Retinol & peptit gece bakımı',
      emoji: '🌙',
      gradient: 'linear-gradient(135deg, #2D3436 0%, #636E72 50%, #C9A96E 100%)',
      filter: { tags: ['anti-aging', 'peptit'] },
      productIds: [13, 18, 2, 35, 36],
      tagline: 'Uyurken yenilen, sabah parla'
    }
  ],
  skinTypes: ['Kuru', 'Yağlı', 'Karma', 'Hassas', 'Normal'],
  discountCodes: {
    RAVANON20: { type: 'percent', value: 20, min: 0 },
    CLUB50: { type: 'fixed', value: 50, min: 300 },
    WELCOME15: { type: 'percent', value: 15, min: 0 }
  },
  stores: {
    istanbul: [
      { id: 'ist-kadikoy', name: 'Kadıköy Mağazası', address: 'Bağdat Cad. No:245, Kadıköy' },
      { id: 'ist-nisantasi', name: 'Nişantaşı Mağazası', address: 'Abdi İpekçi Cad. No:42, Şişli' },
      { id: 'ist-istinye', name: 'İstinye Park Mağazası', address: 'İstinye Park AVM, Sarıyer' }
    ],
    ankara: [
      { id: 'ank-kizilay', name: 'Kızılay Mağazası', address: 'Atatürk Bulvarı No:78, Çankaya' },
      { id: 'ank-panora', name: 'Panora Mağazası', address: 'Panora AVM, Çankaya' }
    ],
    izmir: [
      { id: 'izm-alsancak', name: 'Alsancak Mağazası', address: 'Kordon Boyu No:12, Konak' },
      { id: 'izm-hilltown', name: 'Hilltown Mağazası', address: 'Hilltown AVM, Karşıyaka' }
    ],
    bursa: [
      { id: 'bur-osmangazi', name: 'Osmangazi Mağazası', address: 'Atatürk Cad. No:156, Osmangazi' },
      { id: 'bur-korupark', name: 'Korupark Mağazası', address: 'Korupark AVM, Nilüfer' }
    ]
  },
  clubTiers: [
    { id: 'bronze', name: 'Bronze', minPoints: 0, pointRate: 10, color: '#CD7F32', benefits: ['Her 10 TL\'de 1 puan', '%5 doğum günü indirimi'] },
    { id: 'silver', name: 'Silver', minPoints: 500, pointRate: 8, color: '#C0C0C0', benefits: ['Her 8 TL\'de 1 puan', '%10 doğum günü indirimi', 'Ücretsiz kargo 500 TL+'] },
    { id: 'gold', name: 'Gold', minPoints: 1500, pointRate: 6, color: '#C9A96E', benefits: ['Her 6 TL\'de 1 puan', '%15 doğum günü indirimi', 'Öncelikli destek', 'Erken erişim kampanyaları'] },
    { id: 'platinum', name: 'Platinum', minPoints: 5000, pointRate: 4, color: '#E8B4B8', benefits: ['Her 4 TL\'de 1 puan', '%25 doğum günü indirimi', 'VIP etkinlikler', 'Özel hediye paketleri', 'Kişisel güzellik danışmanı'] }
  ],
  clubSettings: { welcomeBonus: 100, freeShippingMin: 750, minRedeemPoints: 100, redeemRate: 10, autoTierUpgrade: true },
  expertTips: [
    {
      id: 1,
      slug: 'kis-rutini-nem-bariyeri',
      emoji: '❄️',
      title: 'Kış Rutini: Nem Bariyeri Nasıl Güçlendirilir?',
      author: 'Dr. Ayşe Kaya',
      authorTitle: 'Dermatoloji Uzmanı',
      category: 'Cilt Bakımı',
      readTime: '5 dk',
      image: 'winter-skin',
      date: '15 Ocak 2026',
      excerpt: 'Soğuk hava ve kalorifer, cildinizin nem bariyerini zayıflatır. Kış aylarında cildi korumanın bilimsel yolları.',
      relatedProducts: [2, 8, 9],
      content: `
        <p>Kış aylarında cildimizin en büyük düşmanı soğuk hava, rüzgâr ve iç mekânlardaki kuru ısıtma sistemleridir. Bu üçlü, cildin koruyucu nem bariyerini — yani stratum corneum'daki lipid tabakasını — ciddi şekilde zayıflatır. Sonuç? Gerginlik, pul pul dökülme, kızarıklık ve hassasiyet.</p>

        <h2>Nem Bariyeri Nedir?</h2>
        <p>Cildinizin en üst tabakası, seramidler, kolesterol ve yağ asitlerinden oluşan bir "çimento" gibi çalışır. Bu tabaka suyun buharlaşmasını engeller ve dış etkenlere karşı koruma sağlar. Kışın bu denge bozulduğunda cilt neminin %25-40'ını kaybedebilir.</p>

        <h2>4 Adımlık Kış Rutini</h2>
        <h3>1. Nazik Temizleme</h3>
        <p>Sabah ve akşam, pH dengeli (5.5 civarı) jel veya kremsi temizleyiciler tercih edin. Köpüren, sülfatlı ürünler lipid tabakasını daha da zayıflatır. Ilık su kullanın — sıcak su bariyeri hızla tahrip eder.</p>

        <h3>2. Hyaluronik Asit Serumu</h3>
        <p>Nemli cilde uygulanan hyaluronik asit, suyu cilde çeker ve tutar. Tek başına yeterli değildir; mutlaka üzerine nemlendirici sürülmelidir. RAVANON Serum koleksiyonumuz bu adım için idealdir.</p>

        <h3>3. Seramid İçerikli Nemlendirici</h3>
        <p>Seramid NP, AP ve EOP içeren kremler bariyeri onarır. Kış aylarında gece rutininde daha zengin kıvamlı, gündüz ise hafif ama koruyucu formüller kullanın.</p>

        <h3>4. SPF — Kışın da Şart</h3>
        <p>UV ışınları bulutlu günlerde de aktiftir. Kışın güneş koruyucu kullanmamak, bariyer hasarını uzun vadede derinleştirir. SPF 50+ geniş spektrumlu ürünler tercih edin.</p>

        <h2>Ekstra İpuçları</h2>
        <ul>
          <li>Oda nemlendiricisi kullanın — ideal nem oranı %40-60</li>
          <li>Günde 2 litre su için</li>
          <li>Omega-3 takviyesi cilt bariyerini destekler</li>
          <li>Haftada 1 kez nazik enzim peelingi yeterli</li>
        </ul>

        <blockquote>RAVANON AI Cilt Analizi ile kış rutininizi kişiselleştirebilir, cilt tipinize özel ürün önerileri alabilirsiniz.</blockquote>
      `
    },
    {
      id: 2,
      slug: 'soft-glam-2026',
      emoji: '💗',
      title: '2026 Makyaj Trendleri: Soft Glam',
      author: 'Merve Demir',
      authorTitle: 'Profesyonel Makyaj Artisti',
      category: 'Makyaj',
      readTime: '4 dk',
      image: 'soft-glam',
      date: '8 Ocak 2026',
      excerpt: '2026\'nın en güçlü makyaj trendi Soft Glam: doğal ışıltı, yumuşak kontür ve kusursuz ama "yapılmamış" görünüm.',
      relatedProducts: [4, 6, 17],
      content: `
        <p>2026 makyaj dünyasında tek bir kelime her şeyi özetliyor: <strong>Soft Glam</strong>. Ağır kontürlerin, mat bitişlerin ve aşırı belirgin kaşların yerini yumuşak ışıltı, cilt odaklı güzellik ve "clean girl" estetiğinin lüks versiyonu alıyor.</p>

        <h2>Soft Glam Nedir?</h2>
        <p>Soft Glam, cildi mükemmelleştiren ama doğallığını koruyan bir makyaj anlayışıdır. Amaç "makyaj yapmamış gibi görünmek" değil — cildinizin en iyi halini ortaya çıkarmak. Sephora ve Ulta'nın 2026 trend raporlarında bu stil birinci sırada.</p>

        <h2>Temel Ürünler</h2>
        <h3>Cilt: Aydınlık Baz</h3>
        <p>Hafif BB krem veya aydınlatıcı fondöten ile başlayın. Tam kapatıcılık yerine "skin tint" mantığı: cilt dokusunu gösteren, hafif kapatıcı formüller. Kapatıcıyı sadece gereken noktalara nokta nokta uygulayın.</p>

        <h3>Allık: Sıvı ve Doğal</h3>
        <p>Krem ve sıvı allıklar 2026'nın yıldızı. Elmacık kemiklerine ve burnun üstüne hafifçe sürülen pembe-şeftali tonları, cilde sağlıklı bir parlaklık verir. RAVANON Allık koleksiyonu bu trend için tasarlandı.</p>

        <h3>Göz: Tek Renk veya Soft Smokey</h3>
        <p>Kahverengi, şampanya ve rose gold tonlarında tek renk far yeterli. Kirpik çizgisine yakın ince bir eyeliner ve bol maskara — hacimli ama doğal kirpikler.</p>

        <h3>Dudak: Nude ve Parlak</h3>
        <p>Pillow Talk tarzı nude rujlar veya şeffaf dudak parlatıcısı. Dudak kontürü çizmek yerine dudakların doğal sınırlarını takip edin.</p>

        <h2>5 Dakikalık Soft Glam Rutini</h2>
        <ol>
          <li>Nemlendirici + SPF (2 dk)</li>
          <li>Hafif fondöten, parmak ucuyla (1 dk)</li>
          <li>Sıvı allık, elmacık kemiklerine (30 sn)</li>
          <li>Maskara (1 dk)</li>
          <li>Nude ruj veya parlatıcı (30 sn)</li>
        </ol>

        <blockquote>RAVANON Sanal Deneme özelliği ile Soft Glam tonlarını yüzünüzde deneyebilirsiniz.</blockquote>
      `
    },
    {
      id: 3,
      slug: 'sac-dokulmesi-ipuclari',
      emoji: '💇‍♀️',
      title: 'Saç Dökülmesine Karşı 7 Etkili İpucu',
      author: 'Uzm. Elif Yılmaz',
      authorTitle: 'Trichology & Saç Bakım Uzmanı',
      category: 'Saç Bakımı',
      readTime: '6 dk',
      image: 'hair-care',
      date: '22 Aralık 2025',
      excerpt: 'Mevsimsel ve stres kaynaklı saç dökülmesiyle başa çıkmanın dermatolog onaylı 7 yöntemi.',
      relatedProducts: [22, 23],
      content: `
        <p>Günde 50-100 tel saç dökülmesi normaldir. Ancak bu sayı aşıldığında — özellikle kış aylarında ve stres dönemlerinde — müdahale etmek gerekir. İşte bilim destekli 7 etkili ipucu.</p>

        <h2>1. Saç Derisini Temiz Tutun</h2>
        <p>Kimyasal birikintiler, stil ürünleri kalıntıları ve aşırı sebum saç foliküllerini tıkar. Haftada 2-3 kez derinlemesine temizleyici şampuan kullanın. RAVANON Şampuan serisi argan yağı ile saç derisini besler.</p>

        <h2>2. Besleyici Şampuan ve Saç Maskesi</h2>
        <p>Biotin, keratin, argan yağı ve pantenol içeren formüller saç telini güçlendirir. Haftada bir kez yoğun bakım maskesi uygulayın — saç derisinden uçlara, 20 dakika bekletin.</p>

        <h2>3. Olaplex Tarzı Bağ Onarımı</h2>
        <p>Isı, boya ve kimyasal işlemler saçtaki disülfit bağlarını kırar. Bağ onarıcı tedaviler (Bis-Aminopropyl Diglycol Dimaleate) salon ve ev bakımında fark yaratır.</p>

        <h2>4. Beslenmeyi Destekleyin</h2>
        <p>Demir, çinko, D vitamini ve B12 eksikliği saç dökülmesinin sık görülen nedenleridir. Kan tahlili yaptırın; eksiklik varsa takviye alın. Protein alımını artırın — saç %91 keratin proteininden oluşur.</p>

        <h2>5. Isı ve Stil Ürünlerini Sınırlayın</h2>
        <p>Düzleştirici ve maşa 180°C üzerinde saçı anında zayıflatır. Isı koruyucu sprey şart. Mümkünse doğal kurutma tercih edin.</p>

        <h2>6. Stres Yönetimi</h2>
        <p>Telogen effluvium — stres kaynaklı geçici dökülme — 2-3 ay sonra kendini gösterir. Yoga, meditasyon ve yeterli uyku (7-8 saat) saç sağlığını doğrudan etkiler.</p>

        <h2>7. Profesyonel Destek Alın</h2>
        <p>3 aydan uzun süren dökülmede dermatolog veya tricholog'a başvurun. PRP, mezoterapi ve minoksidil gibi tedaviler erken müdahalede çok etkilidir.</p>

        <h2>Ne Zaman Endişelenmeli?</h2>
        <ul>
          <li>Yastıkta her sabah 50'den fazla tel</li>
          <li>Saç çizgisinde belirgin gerileme</li>
          <li>5 kuruş büyüklüğünde yuvarlak kelleler</li>
          <li>Saçta ani incelme veya matlaşma</li>
        </ul>

        <blockquote>RAVANON Saç Bakım koleksiyonunda salon kalitesinde ev bakımı ürünleri sizi bekliyor.</blockquote>
      `
    },
    {
      id: 4,
      slug: 'parfum-ten-kokusu',
      emoji: '🌸',
      title: 'Parfüm Seçimi: Ten Kokusu Nasıl Bulunur?',
      author: 'Can Öztürk',
      authorTitle: 'Koku Uzmanı & Parfümör',
      category: 'Parfüm',
      readTime: '3 dk',
      image: 'fragrance',
      date: '5 Ocak 2026',
      excerpt: 'Parfüm teninizde neden farklı kokar? Size en uygun kokuyu bulmanın uzman rehberi.',
      relatedProducts: [24, 25],
      content: `
        <p>Aynı parfüm birinde çiçeksi, diğerinde odunsu kokabilir. Bunun nedeni <strong>ten kokusu</strong> — cildinizin pH'ı, yağ oranı ve vücut ısınızın parfümle kurduğu benzersiz kimyasal etkileşimdir.</p>

        <h2>Ten Kokusu Nedir?</h2>
        <p>Her insanın cildi farklı bir "imza" bırakır. Asitlik (pH), nem oranı, diyet, hormonlar ve hatta ilaçlar parfümün üst, orta ve alt notalarının teninizde nasıl açılacağını belirler. Bu yüzden mağazada harika kokan parfüm, evde farklı hissedebilir.</p>

        <h2>Ten Tipinize Göre Parfüm Ailesi</h2>
        <h3>Kuru Cilt</h3>
        <p>Parfüm hızla buharlaşır, kalıcılık azalır. <strong>Oriental, amber ve vanilya</strong> bazlı kokular daha uzun kalır. Vücudu nemlendirdikten sonra parfüm sıkın.</p>

        <h3>Yağlı Cilt</h3>
        <p>Koku daha yoğun ve kalıcıdır. <strong>Hafif çiçeksi ve narenciye</strong> notaları dengeyi sağlar; ağır kokular bunaltıcı olabilir.</p>

        <h3>Normal / Karma Cilt</h3>
        <p>En geniş yelpazede deneme şansınız var. <strong>Çiçeksi-odunsu</strong> (floral-woody) koku aileleri çoğu tenle uyumludur.</p>

        <h2>Doğru Parfümü Bulma Adımları</h2>
        <ol>
          <li><strong>Pulse noktalarına sıkın:</strong> Bilek içi, boyun, kulak arkası — vücut ısısı kokuyu açar</li>
          <li><strong>15-30 dakika bekleyin:</strong> İlk sıktığınız "üst nota"dır; asıl koku orta ve alt notalarda ortaya çıkar</li>
          <li><strong>Gün içinde test edin:</strong> Sabah sıkıp akşam koklayın — kalıcılığı görün</li>
          <li><strong>Maksimum 3 koku:</strong> Aynı anda 3'ten fazla parfüm test etmeyin — koku yorgunluğu yaşarsınız</li>
          <li><strong>Mevsimi düşünün:</strong> Yaz = hafif, ferah; kış = sıcak, yoğun</li>
        </ol>

        <h2>2026 Trend Koku Notaları</h2>
        <ul>
          <li>Sol de Janeiro tarzı <strong>pistachio ve vanilya</strong></li>
          <li>Zarif <strong>müge ve beyaz çiçek</strong> kokuları</li>
          <li>Maskülen-feminen <strong>odunsu amber</strong> karışımları</li>
        </ul>

        <blockquote>RAVANON Parfüm koleksiyonunda teninize en uygun kokuyu bulmak için numune setlerimizi deneyin.</blockquote>
      `
    }
  ],
      products: [
    { id: 1, name: 'Niacinamide %10 + Zinc %1 Serum', brand: 'The Ordinary', category: 'cilt-bakimi', price: 449, originalPrice: 549, rating: 4.8, reviews: 2341, skinType: ['Yağlı', 'Karma', 'Hassas'], vegan: true, crueltyFree: true, bestseller: true, new: false, flash: true, routineRole: 'serum', tags: ['gözenek', 'leke', 'serum'], description: 'Gözenek görünümünü azaltan ve cilt tonunu eşitleyen güçlü serum.', ingredients: 'Aqua, Niacinamide, Zinc PCA, Pentylene Glycol, Tamarindus Indica Seed Gum', badge: 'Flaş İndirim', stock: 0, sku: 'RVN-1' },
    { id: 2, name: 'Hyaluronic Acid Serum', brand: 'The Inkey List', category: 'cilt-bakimi', price: 389, originalPrice: null, rating: 4.7, reviews: 1823, skinType: ['Kuru', 'Normal', 'Hassas'], vegan: true, crueltyFree: true, bestseller: true, new: false, flash: false, routineRole: 'serum', tags: ['nem', 'kırışıklık', 'serum'], description: 'Derinlemesine nemlendirme sağlayan hafif formül.', ingredients: 'Aqua, Propanediol, Sodium Hyaluronate, Glycerin', badge: 'En Çok Satan' },
    { id: 3, name: 'Retro Matte Lipstick - Ruby Woo', brand: 'MAC', category: 'makyaj', price: 899, originalPrice: null, rating: 4.9, reviews: 5621, skinType: ['Normal'], vegan: false, crueltyFree: false, bestseller: true, new: false, flash: false, tags: ['ruj', 'mat'], description: 'İkonik mat kırmızı ruj, uzun süre kalıcı formül.', ingredients: 'Ricinus Communis Seed Oil, Cera Alba, Ozokerite', badge: 'İkon' },
    { id: 4, name: 'Radiant Creamy Concealer', brand: 'NARS', category: 'makyaj', price: 1249, originalPrice: 1399, rating: 4.8, reviews: 3102, skinType: ['Kuru', 'Karma', 'Normal'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: true, tags: ['kapatıcı', 'aydınlatıcı'], description: 'Kırışıklık görünümünü azaltan aydınlatıcı kapatıcı.', ingredients: 'Aqua, Dimethicone, Glycerin, Titanium Dioxide', badge: 'Flaş İndirim' },
    { id: 5, name: 'Pro Filt\'r Soft Matte Foundation', brand: 'Fenty Beauty', category: 'makyaj', price: 1599, originalPrice: null, rating: 4.7, reviews: 4890, skinType: ['Yağlı', 'Karma'], vegan: true, crueltyFree: true, bestseller: true, new: false, flash: false, tags: ['fondöten', 'mat'], description: '50 ton seçeneğiyle mat bitişli fondöten.', ingredients: 'Aqua, Dimethicone, Cyclopentasiloxane, Glycerin', badge: 'En Çok Satan' },
    { id: 6, name: 'Soft Pinch Liquid Blush - Hope', brand: 'Rare Beauty', category: 'makyaj', price: 1099, originalPrice: null, rating: 4.9, reviews: 7234, skinType: ['Normal', 'Kuru', 'Karma'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: false, tags: ['allık', 'doğal'], description: 'Doğal görünümlü, uzun süre kalıcı sıvı allık.', ingredients: 'Aqua, Dimethicone, Glycerin, Mica', badge: 'Yeni' },
    { id: 7, name: 'Brazilian Bum Bum Cream', brand: 'Sol de Janeiro', category: 'vucut-bakimi', price: 899, originalPrice: 1099, rating: 4.8, reviews: 8901, skinType: ['Kuru', 'Normal'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: true, tags: ['nem', 'parfüm'], description: 'Kafein ve guarana ile sıkılaştırıcı vücut kremi.', ingredients: 'Aqua, Cocos Nucifera Oil, Theobroma Grandiflorum Seed Butter', badge: 'Flaş İndirim' },
    { id: 8, name: 'Moisturizing Cream', brand: 'CeraVe', category: 'cilt-bakimi', price: 549, originalPrice: null, rating: 4.6, reviews: 4521, skinType: ['Kuru', 'Hassas', 'Normal'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: false, routineRole: 'moisturizer', tags: ['nem', 'bariyer'], description: '3 esansiyel seramid ile nem bariyerini onaran krem.', ingredients: 'Aqua, Glycerin, Cetearyl Alcohol, Ceramide NP', badge: 'Dermatolog Onaylı' },
    { id: 9, name: 'Anthelios UVmune 400 SPF50+', brand: 'La Roche-Posay', category: 'cilt-bakimi', price: 799, originalPrice: null, rating: 4.9, reviews: 3210, skinType: ['Hassas', 'Normal', 'Kuru'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: false, routineRole: 'spf', tags: ['güneş', 'koruma'], description: 'Ultra hafif, geniş spektrumlu güneş koruyucu.', ingredients: 'Aqua, Drometrizole Trisiloxane, Glycerin, Tocopherol', badge: 'SPF50+' },
    { id: 10, name: 'Perfect Coverage Foundation', brand: 'Flormar', category: 'makyaj', price: 349, originalPrice: 449, rating: 4.4, reviews: 1890, skinType: ['Karma', 'Yağlı', 'Normal'], vegan: false, crueltyFree: true, bestseller: false, new: false, flash: true, tags: ['fondöten', 'kapatıcı'], description: 'Yerli marka, tam kapatıcılı fondöten.', ingredients: 'Aqua, Cyclopentasiloxane, Titanium Dioxide', badge: 'Türk Markası' },
    { id: 11, name: 'Dream Lips Matte Lipstick', brand: 'Golden Rose', category: 'makyaj', price: 189, originalPrice: null, rating: 4.3, reviews: 5670, skinType: ['Normal'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: false, tags: ['ruj', 'mat'], description: 'Uygun fiyatlı, uzun süre kalıcı mat ruj.', ingredients: 'Ricinus Communis Seed Oil, Cera Microcristallina', badge: 'Uygun Fiyat' },
    { id: 12, name: 'Profashion Eyeshadow Palette', brand: 'Pastel', category: 'makyaj', price: 299, originalPrice: 399, rating: 4.5, reviews: 2340, skinType: ['Normal'], vegan: false, crueltyFree: true, bestseller: false, new: true, flash: false, tags: ['göz', 'palet'], description: '12 renkli profesyonel göz farı paleti.', ingredients: 'Mica, Talc, Magnesium Stearate, Dimethicone', badge: 'Yeni' },
    { id: 13, name: 'Revitalift Laser X3 Serum', brand: 'L\'Oréal Paris', category: 'cilt-bakimi', price: 649, originalPrice: null, rating: 4.5, reviews: 2890, skinType: ['Kuru', 'Normal', 'Karma'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: false, routineRole: 'serum', tags: ['anti-aging', 'kırışıklık', 'serum'], description: '3 etkili anti-aging serum, cildi sıkılaştırır.', ingredients: 'Aqua, Glycerin, Pro-Xylane, Hyaluronic Acid', badge: 'Anti-Aging' },
    { id: 14, name: 'Lash Sensational Mascara', brand: 'Maybelline', category: 'makyaj', price: 399, originalPrice: null, rating: 4.6, reviews: 6780, skinType: ['Normal'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: false, tags: ['maskara', 'hacim'], description: 'Katmanlı hacim veren ikonik maskara.', ingredients: 'Aqua, Paraffin, Cera Alba, Stearic Acid', badge: 'İkon' },
    { id: 15, name: 'Butter Gloss - Tiramisu', brand: 'NYX', category: 'makyaj', price: 279, originalPrice: null, rating: 4.7, reviews: 4320, skinType: ['Kuru', 'Normal'], vegan: true, crueltyFree: true, bestseller: true, new: false, flash: false, tags: ['dudak', 'parlak'], description: 'Kremsi, yapışmayan dudak parlatıcısı.', ingredients: 'Paraffinum Liquidum, Polybutene, Cera Microcristallina', badge: 'Vegan' },
    { id: 16, name: 'Rouge Dior Lipstick', brand: 'Dior', category: 'makyaj', price: 2899, originalPrice: null, rating: 4.9, reviews: 1560, skinType: ['Normal', 'Kuru'], vegan: false, crueltyFree: false, bestseller: false, new: true, flash: false, tags: ['lüks', 'ruj'], description: 'Lüks saten bitişli ikonik Dior ruj.', ingredients: 'Ricinus Communis Seed Oil, Cera Alba, Lanolin', badge: 'Lüks' },
    { id: 17, name: 'Pillow Talk Lipstick', brand: 'Charlotte Tilbury', category: 'makyaj', price: 2199, originalPrice: null, rating: 4.9, reviews: 8900, skinType: ['Normal', 'Kuru'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: false, tags: ['nude', 'ruj'], description: 'Dünyaca ünlü nude ruj tonu Pillow Talk.', ingredients: 'Octyldodecanol, Polyethylene, Cera Alba', badge: 'Kült Ürün' },
    { id: 18, name: 'Protini Polypeptide Cream', brand: 'Drunk Elephant', category: 'cilt-bakimi', price: 1899, originalPrice: 2199, rating: 4.8, reviews: 2100, skinType: ['Kuru', 'Normal', 'Hassas'], vegan: true, crueltyFree: true, bestseller: false, new: false, flash: true, routineRole: 'moisturizer', tags: ['peptit', 'sıkılaştırma', 'kırışıklık'], description: '9 sinyal peptit kompleksi ile sıkılaştırıcı krem.', ingredients: 'Aqua, Glycerin, Signal Peptide Complex, Pygmy Waterlily', badge: 'Flaş İndirim' },
    { id: 19, name: 'Milky Jelly Cleanser', brand: 'Glossier', category: 'cilt-bakimi', price: 599, originalPrice: null, rating: 4.5, reviews: 3450, skinType: ['Hassas', 'Kuru', 'Normal'], vegan: true, crueltyFree: true, bestseller: true, new: false, flash: false, routineRole: 'cleanser', tags: ['temizleyici', 'nazik', 'hassas'], description: 'Hassas ciltler için nazik jel temizleyici.', ingredients: 'Aqua, Rose Water, Poloxamer 184, Allantoin', badge: 'Hassas Cilt' },
    { id: 20, name: 'DEFENCE Hydractive Serum', brand: 'BioNike', category: 'cilt-bakimi', price: 699, originalPrice: null, rating: 4.4, reviews: 890, skinType: ['Hassas', 'Kuru'], vegan: false, crueltyFree: true, bestseller: false, new: true, flash: false, routineRole: 'serum', tags: ['nem', 'hassas', 'serum'], description: 'Hipoalerjenik yoğun nem serumu.', ingredients: 'Aqua, Hyaluronic Acid, Panthenol, Allantoin', badge: 'Yeni' },
    { id: 21, name: 'Sensibio H2O Micellar Water', brand: 'Bioderma', category: 'cilt-bakimi', price: 449, originalPrice: null, rating: 4.8, reviews: 5670, skinType: ['Hassas', 'Normal'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: false, routineRole: 'micellar', tags: ['makyaj temizleme', 'hassas'], description: 'Hassas ciltler için micellar temizleme suyu.', ingredients: 'Aqua, PEG-6 Caprylic/Capric Glycerides, Cucumber Extract', badge: 'Dermatolog Onaylı' },
    { id: 22, name: 'Treatment Shampoo', brand: 'Moroccanoil', category: 'sac-bakimi', price: 899, originalPrice: null, rating: 4.7, reviews: 2340, skinType: ['Kuru', 'Normal'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: false, tags: ['saç', 'nem'], description: 'Argan yağı ile besleyici şampuan.', ingredients: 'Aqua, Argania Spinosa Kernel Oil, Cocamidopropyl Betaine', badge: 'En Çok Satan' },
    { id: 23, name: 'No.3 Hair Perfector', brand: 'Olaplex', category: 'sac-bakimi', price: 1299, originalPrice: null, rating: 4.9, reviews: 7890, skinType: ['Normal'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: false, tags: ['onarım', 'hasar'], description: 'Hasarlı saçları onaran salon tedavisi.', ingredients: 'Aqua, Bis-Aminopropyl Diglycol Dimaleate, Phenoxyethanol', badge: 'Salon Favorisi' },
    { id: 24, name: 'Chance Eau Tendre EDT', brand: 'Chanel', category: 'parfum', price: 4599, originalPrice: null, rating: 4.9, reviews: 1230, skinType: ['Normal'], vegan: false, crueltyFree: false, bestseller: true, new: false, flash: false, tags: ['çiçeksi', 'feminen'], description: 'Zarif ve feminen çiçeksi parfüm.', ingredients: 'Alcohol, Parfum, Aqua, Linalool, Limonene', badge: 'Lüks' },
    { id: 25, name: 'Cheirosa 62 Body Mist', brand: 'Sol de Janeiro', category: 'parfum', price: 649, originalPrice: 799, rating: 4.8, reviews: 4560, skinType: ['Normal'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: true, tags: ['vücut spreyi', 'tropik'], description: 'Pistachio ve vanilya notalarıyla tropik vücut spreyi.', ingredients: 'Alcohol Denat, Parfum, Aqua, Benzyl Salicylate', badge: 'Flaş İndirim' },
    { id: 26, name: 'Vitamin C Brightening Serum', brand: 'The Inkey List', category: 'cilt-bakimi', price: 459, originalPrice: null, rating: 4.6, reviews: 1890, skinType: ['Karma', 'Normal', 'Kuru'], vegan: true, crueltyFree: true, bestseller: false, new: true, flash: false, routineRole: 'serum', tags: ['vitamin c', 'aydınlatma', 'leke', 'serum'], description: 'C vitamini ile cildi aydınlatan serum.', ingredients: 'Aqua, Ascorbic Acid, Squalane, Ferulic Acid', badge: 'Yeni' },
    { id: 27, name: 'Bundle: Cilt Bakım Seti', brand: 'RAVANON', category: 'cilt-bakimi', price: 999, originalPrice: 1499, rating: 4.7, reviews: 456, skinType: ['Kuru', 'Normal', 'Hassas'], vegan: true, crueltyFree: true, bestseller: false, new: false, flash: false, tags: ['set', 'bundle'], description: 'Temizleyici + Serum + Nemlendirici 3\'lü set.', ingredients: 'Çeşitli - set içeriği detay sayfasında', badge: 'Bundle', bundle: true },
    { id: 28, name: 'Bundle: Makyaj Başlangıç Seti', brand: 'RAVANON', category: 'makyaj', price: 749, originalPrice: 1199, rating: 4.5, reviews: 678, skinType: ['Normal', 'Karma'], vegan: false, crueltyFree: true, bestseller: false, new: false, flash: false, tags: ['set', 'başlangıç'], description: 'Fondöten + Maskara + Ruj başlangıç seti.', ingredients: 'Çeşitli - set içeriği detay sayfasında', badge: 'Bundle', bundle: true },
    { id: 29, name: 'RAVANON Glow Toner', brand: 'RAVANON', category: 'cilt-bakimi', price: 329, originalPrice: 399, rating: 4.6, reviews: 1240, skinType: ['Karma', 'Yağlı', 'Normal'], vegan: true, crueltyFree: true, bestseller: false, new: true, flash: true, routineRole: 'toner', tags: ['toner', 'k-beauty', 'glass-skin', 'gözenek'], description: 'Gül suyu ve PHA ile gözenek sıkılaştırıcı, aydınlatıcı toner.', ingredients: 'Rose Water, Gluconolactone, Niacinamide, Panthenol', badge: 'Viral' },
    { id: 30, name: 'RAVANON Lip Oil - Cherry Kiss', brand: 'RAVANON', category: 'makyaj', price: 249, originalPrice: null, rating: 4.8, reviews: 3890, skinType: ['Kuru', 'Normal'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: false, tags: ['dudak', 'parlak', 'k-beauty'], description: 'TikTok fenomeni kirazlı dudak yağı, cam parlaklık verir.', ingredients: 'Jojoba Oil, Cherry Extract, Vitamin E, Hyaluronic Acid', badge: 'TikTok Hit' },
    { id: 31, name: 'RAVANON Cloud Blush - Peach Dream', brand: 'RAVANON', category: 'makyaj', price: 399, originalPrice: 499, rating: 4.9, reviews: 5120, skinType: ['Normal', 'Kuru', 'Karma'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: true, tags: ['allık', 'doğal', 'soft-glam'], description: 'Bulut gibi hafif krem allık, doğal şeftali flush efekti.', ingredients: 'Dimethicone, Mica, Peach Extract, Squalane', badge: 'Viral' },
    { id: 32, name: 'RAVANON Body Glitter Mist', brand: 'RAVANON', category: 'vucut-bakimi', price: 349, originalPrice: null, rating: 4.7, reviews: 2780, skinType: ['Normal'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: false, tags: ['parfüm', 'parlak'], description: 'Festival ve yaz geceleri için ışıltılı vücut spreyi.', ingredients: 'Alcohol Denat, Mica, Jojoba Oil, Vanilla Extract', badge: 'Festival' },
    { id: 33, name: 'RAVANON Pimple Patch Set', brand: 'RAVANON', category: 'cilt-bakimi', price: 179, originalPrice: null, rating: 4.5, reviews: 4560, skinType: ['Yağlı', 'Karma', 'Hassas'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: false, routineRole: 'treatment', tags: ['akne', 'gözenek', 'k-beauty'], description: '72 adet hidrokolloid sivilce bandı, gece boyunca etkili.', ingredients: 'Hydrocolloid, Tea Tree Oil, Centella Asiatica', badge: 'Gen Z Fav' },
    { id: 34, name: 'RAVANON Brow Gel - Fluffy', brand: 'RAVANON', category: 'makyaj', price: 279, originalPrice: null, rating: 4.6, reviews: 1890, skinType: ['Normal'], vegan: true, crueltyFree: true, bestseller: false, new: true, flash: false, tags: ['kaş', 'soft-glam'], description: 'Soap brow efekti veren şeffaf kaş jeli, 24 saat kalıcı.', ingredients: 'Aqua, Glycerin, Panthenol, Biotin', badge: 'Yeni' },
    { id: 35, name: 'RAVANON Sleeping Mask', brand: 'RAVANON', category: 'cilt-bakimi', price: 459, originalPrice: 559, rating: 4.8, reviews: 2340, skinType: ['Kuru', 'Normal', 'Hassas'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: true, routineRole: 'mask', tags: ['nem', 'k-beauty', 'glass-skin'], description: 'Gece boyunca nem kilitleyen uyku maskesi, sabah cam cilt.', ingredients: 'Ceramide NP, Squalane, Centella, Hyaluronic Acid', badge: 'K-Beauty' },
    { id: 36, name: 'RAVANON Retinol Night Serum', brand: 'RAVANON', category: 'cilt-bakimi', price: 549, originalPrice: null, rating: 4.7, reviews: 1670, skinType: ['Normal', 'Karma', 'Kuru'], vegan: true, crueltyFree: true, bestseller: false, new: true, flash: false, routineRole: 'treatment', tags: ['anti-aging', 'kırışıklık', 'peptit', 'serum'], description: '0.3% retinol + bakuchiol, nazik gece yenileme serumu.', ingredients: 'Retinol, Bakuchiol, Squalane, Peptide Complex', badge: 'Gece Bakımı' },
    { id: 37, name: 'RAVANON Setting Spray - Dewy', brand: 'RAVANON', category: 'makyaj', price: 319, originalPrice: null, rating: 4.6, reviews: 2100, skinType: ['Kuru', 'Normal'], vegan: true, crueltyFree: true, bestseller: false, new: true, flash: false, tags: ['makyaj sabitleyici', 'glass-skin'], description: 'Nemli bitiş veren makyaj sabitleyici sprey.', ingredients: 'Aqua, Glycerin, Niacinamide, Rose Extract', badge: 'Yeni' },
    { id: 38, name: 'Advanced Snail 96 Mucin Essence', brand: 'COSRX', category: 'cilt-bakimi', price: 689, originalPrice: 799, rating: 4.9, reviews: 12400, skinType: ['Kuru', 'Normal', 'Hassas', 'Karma'], vegan: false, crueltyFree: true, bestseller: true, new: true, flash: true, routineRole: 'essence', tags: ['k-beauty', 'nem', 'glass-skin', 'hassas'], description: 'Kore\'nin efsane salyangoz essansı — cam cilt rutininin kalbi.', ingredients: 'Snail Secretion Filtrate 96%, Betaine, Sodium Hyaluronate', badge: 'K-Beauty İkon' },
    { id: 39, name: 'Glow Deep Serum Rice + Alpha Arbutin', brand: 'Beauty of Joseon', category: 'cilt-bakimi', price: 549, originalPrice: null, rating: 4.8, reviews: 8900, skinType: ['Kuru', 'Normal', 'Karma'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: false, routineRole: 'serum', tags: ['k-beauty', 'leke', 'aydınlatma', 'serum'], description: 'Hanbang formülü pirinç + alpha arbutin ile leke giderici serum.', ingredients: 'Oryza Sativa Extract, Alpha-Arbutin, Niacinamide, Glycerin', badge: 'TikTok Viral' },
    { id: 40, name: 'Heartleaf 77% Soothing Toner', brand: 'Anua', category: 'cilt-bakimi', price: 479, originalPrice: null, rating: 4.8, reviews: 6700, skinType: ['Hassas', 'Yağlı', 'Karma'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: false, routineRole: 'toner', tags: ['k-beauty', 'toner', 'hassas', 'gözenek'], description: '%77 heartleaf ekstraktı ile yatıştırıcı Kore toniği.', ingredients: 'Houttuynia Cordata Extract, Panthenol, Hyaluronic Acid', badge: 'K-Beauty' },
    { id: 41, name: 'Water Sleeping Mask', brand: 'Laneige', category: 'cilt-bakimi', price: 899, originalPrice: 1099, rating: 4.9, reviews: 15200, skinType: ['Kuru', 'Normal', 'Hassas'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: true, routineRole: 'mask', tags: ['k-beauty', 'nem', 'glass-skin'], description: 'Laneige\'nin ikonik gece maskesi — sabaha kadar yoğun nem.', ingredients: 'Squalane, Evening Primrose Extract, Apricot Extract', badge: 'Kore Favorisi' },
    { id: 42, name: 'Green Tea Seed Hyaluronic Serum', brand: 'Innisfree', category: 'cilt-bakimi', price: 599, originalPrice: null, rating: 4.7, reviews: 4300, skinType: ['Karma', 'Yağlı', 'Normal'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: false, routineRole: 'serum', tags: ['k-beauty', 'nem', 'serum'], description: 'Jeju yeşil çay tohumu + hyaluronik asit nem serumu.', ingredients: 'Green Tea Seed Oil, Hyaluronic Acid, Glycerin', badge: 'K-Beauty' },
    { id: 43, name: 'Madagascar Centella Ampoule', brand: 'SKIN1004', category: 'cilt-bakimi', price: 529, originalPrice: null, rating: 4.8, reviews: 9800, skinType: ['Hassas', 'Kuru', 'Normal'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: false, routineRole: 'serum', tags: ['k-beauty', 'hassas', 'serum', 'hassasiyet'], description: '%100 saf centella ampul — kızarıklık ve tahrişe karşı.', ingredients: 'Centella Asiatica Extract, Panthenol, Madecassoside', badge: 'Hassas Cilt' },
    { id: 44, name: '1025 Dokdo Cleanser', brand: 'Round Lab', category: 'cilt-bakimi', price: 399, originalPrice: null, rating: 4.7, reviews: 5600, skinType: ['Hassas', 'Kuru', 'Normal', 'Karma'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: false, routineRole: 'cleanser', tags: ['k-beauty', 'temizleyici', 'hassas'], description: 'pH 5.5 Dokdo deniz suyu ile nazik köpük temizleyici.', ingredients: 'Sea Water, Panthenol, Allantoin, Glycerin', badge: 'K-Beauty' },
    { id: 45, name: 'RAVANON Rice Cleansing Oil', brand: 'RAVANON', category: 'cilt-bakimi', price: 369, originalPrice: 449, rating: 4.7, reviews: 3200, skinType: ['Kuru', 'Normal', 'Karma', 'Hassas'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: true, routineRole: 'oil-cleanser', tags: ['k-beauty', 'makyaj temizleme', 'temizleyici'], description: 'Kore tarzı pirinç yağı ile çift aşamalı temizliğin ilk adımı.', ingredients: 'Rice Bran Oil, Camellia Oil, Vitamin E, Squalane', badge: 'Çift Temizlik' },
    { id: 46, name: 'Dive-In Low Molecule Hyaluronic Serum', brand: 'Torriden', category: 'cilt-bakimi', price: 499, originalPrice: null, rating: 4.8, reviews: 7100, skinType: ['Kuru', 'Normal', 'Hassas'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: false, routineRole: 'serum', tags: ['k-beauty', 'nem', 'serum', 'glass-skin'], description: '5 tip hyaluronik asit ile derinlemesine cam cilt nemi.', ingredients: 'Sodium Hyaluronate, Panthenol, Allantoin, Trehalose', badge: 'Glass Skin' },
    { id: 47, name: 'Advanced Snail 92 All in One Cream', brand: 'COSRX', category: 'cilt-bakimi', price: 749, originalPrice: null, rating: 4.8, reviews: 8900, skinType: ['Kuru', 'Normal', 'Karma'], vegan: false, crueltyFree: true, bestseller: true, new: false, flash: false, routineRole: 'moisturizer', tags: ['k-beauty', 'nem', 'bariyer'], description: 'Salyangoz müsin + nemlendirici — Kore\'nin çok satan kremi.', ingredients: 'Snail Secretion Filtrate, Betaine, Sodium Hyaluronate', badge: 'K-Beauty' },
    { id: 48, name: 'Relief Sun Rice + Probiotics SPF50+', brand: 'Beauty of Joseon', category: 'cilt-bakimi', price: 649, originalPrice: 749, rating: 4.9, reviews: 18500, skinType: ['Hassas', 'Kuru', 'Normal', 'Karma'], vegan: true, crueltyFree: true, bestseller: true, new: true, flash: true, routineRole: 'spf', tags: ['k-beauty', 'güneş', 'koruma'], description: 'Hanbang güneş kremi — yapışmayan, beyaz iz bırakmayan SPF.', ingredients: 'Rice Extract, Probiotics, Niacinamide, Chemical UV Filters', badge: 'SPF50+ K-Beauty' }
  ]
};

function getCollectionById(id) {
  return RAVANON_DATA.collections.find(c => c.id === id);
}

function getCollectionProducts(collection) {
  if (!collection) return [];
  const byId = (collection.productIds || []).map(id => getProductById(id)).filter(Boolean);
  if (byId.length >= 4) return byId;
  const extras = RAVANON_DATA.products.filter(p => {
    if (collection.filter?.vegan && !p.vegan) return false;
    if (collection.filter?.new && !p.new) return false;
    if (collection.filter?.bestseller && !p.bestseller) return false;
    if (collection.filter?.category && p.category !== collection.filter.category) return false;
    if (collection.filter?.priceMax && p.price > collection.filter.priceMax) return false;
    if (collection.filter?.tags && !collection.filter.tags.some(t => p.tags?.includes(t))) return false;
    return true;
  });
  const merged = [...byId];
  extras.forEach(p => { if (!merged.find(x => x.id === p.id)) merged.push(p); });
  return merged.slice(0, 8);
}

function getProductById(id) {
  return RAVANON_DATA.products.find(p => p.id === Number(id));
}

function getProductRole(product) {
  if (!product) return null;
  if (product.routineRole) return product.routineRole;
  const tags = product.tags || [];
  const name = product.name.toLowerCase();
  if (tags.includes('güneş')) return 'spf';
  if (tags.includes('toner')) return 'toner';
  if (tags.includes('makyaj temizleme')) return 'micellar';
  if (tags.includes('temizleyici')) return 'cleanser';
  if (name.includes('mask') || name.includes('maske')) return 'mask';
  if (name.includes('patch') || name.includes('band')) return 'treatment';
  if (name.includes('retinol')) return 'treatment';
  if (name.includes('serum') || name.includes('ampoule') || name.includes('essence')) return 'serum';
  if (tags.includes('bariyer') || tags.includes('nem')) return 'moisturizer';
  return 'serum';
}

function getSkincareProducts() {
  return RAVANON_DATA.products.filter(p => p.category === 'cilt-bakimi' && !p.bundle);
}

function getArticleById(idOrSlug) {
  if (!idOrSlug) return null;
  const num = Number(idOrSlug);
  if (!isNaN(num) && String(idOrSlug) !== '') {
    return RAVANON_DATA.expertTips.find(a => a.id === num) || null;
  }
  return RAVANON_DATA.expertTips.find(a => a.slug === idOrSlug) || null;
}

function formatPrice(price) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', minimumFractionDigits: 0 }).format(price);
}

function getClubTier(points) {
  const tiers = [...RAVANON_DATA.clubTiers].reverse();
  return tiers.find(t => points >= t.minPoints) || RAVANON_DATA.clubTiers[0];
}

function getNextTier(points) {
  const tiers = RAVANON_DATA.clubTiers;
  for (let i = 0; i < tiers.length; i++) {
    if (points < tiers[i].minPoints) return tiers[i];
  }
  return null;
}