const fs = require('fs');
const path = require('path');
const { PDFParse } = require(path.join(__dirname, '..', 'admin', 'node_modules', 'pdf-parse'));

async function main() {
  const pdfPath = process.argv[2] || 'C:\\Users\\ASUS\\Downloads\\Documents\\Watsons - Haziran_insert_2026.pdf';
  const buf = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: buf });
  const info = await parser.getInfo();
  const text = await parser.getText();
  const out = path.join(__dirname, 'watsons-catalog-extract.txt');
  const body = `Pages: ${info.totalPages || info.numPages || '?'}\nTitle: ${info.info?.Title || ''}\n\n${text.text || text}`;
  fs.writeFileSync(out, body, 'utf8');
  console.log('Pages:', info.totalPages || info.numPages);
  console.log('Text length:', (text.text || text).length);
  console.log('Written:', out);
  console.log('--- PREVIEW ---');
  console.log((text.text || text).slice(0, 12000));
}

main().catch((e) => { console.error(e); process.exit(1); });