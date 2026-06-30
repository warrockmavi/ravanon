const fs = require('fs');
const path = require('path');
const { PDFParse } = require(path.join(__dirname, '..', 'admin', 'node_modules', 'pdf-parse'));

async function main() {
  const pdfPath = 'C:\\Users\\ASUS\\Downloads\\Documents\\Watsons - Haziran_insert_2026.pdf';
  const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
  try {
    const tables = await parser.getTable();
    console.log(JSON.stringify(tables, null, 2).slice(0, 5000));
  } catch (e) {
    console.log('getTable error:', e.message);
  }
  try {
    const shot = await parser.getScreenshot({ partial: [1], scale: 0.5 });
    console.log('screenshot pages:', shot?.pages?.length || shot?.length || Object.keys(shot || {}));
  } catch (e) {
    console.log('screenshot error:', e.message);
  }
}
main();