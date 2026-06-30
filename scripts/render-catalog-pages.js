const fs = require('fs');
const path = require('path');
const { PDFParse } = require(path.join(__dirname, '..', 'admin', 'node_modules', 'pdf-parse'));

const PDF = process.argv[2] || path.join(__dirname, '..', 'assets', 'catalogs', 'watsons-haziran-2026.pdf');
const OUT = path.join(__dirname, '..', 'assets', 'catalogs', 'pages');
const WIDTH = 1200;

async function main() {
  if (!fs.existsSync(PDF)) {
    console.error('PDF yok:', PDF);
    process.exit(1);
  }
  fs.mkdirSync(OUT, { recursive: true });

  const parser = new PDFParse({ data: fs.readFileSync(PDF) });
  const info = await parser.getInfo();
  const total = info.totalPages || 51;
  console.log('Sayfa sayisi:', total);

  for (let p = 1; p <= total; p++) {
    const name = `page-${String(p).padStart(3, '0')}.png`;
    const outPath = path.join(OUT, name);
    if (fs.existsSync(outPath)) {
      console.log(`[${p}/${total}] atlandi (mevcut)`);
      continue;
    }
    process.stdout.write(`[${p}/${total}] render... `);
    const result = await parser.getScreenshot({ partial: [p], desiredWidth: WIDTH, imageBuffer: true, imageDataUrl: false });
    const page = result.pages?.[0];
    if (!page?.data) {
      console.log('HATA');
      continue;
    }
    fs.writeFileSync(outPath, page.data);
    console.log('OK', Math.round(page.data.length / 1024) + 'KB');
  }

  const manifest = {
    title: 'Watsons Haziran 2026',
    totalPages: total,
    width: WIDTH,
    pattern: 'page-{n}.png',
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
  console.log('Tamamlandi:', OUT);
  await parser.destroy();
}

main().catch((e) => { console.error(e); process.exit(1); });