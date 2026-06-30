const fs = require("fs");
const path = require("path");

const dataJs = fs.readFileSync(path.join(__dirname, "../js/data.js"), "utf8");
const fn = new Function(`${dataJs}\nreturn RAVANON_DATA;`);
const data = fn();

const out = {
  version: 1,
  updatedAt: new Date().toISOString(),
  products: data.products,
};

const outDir = path.join(__dirname, "../data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "products.json"), JSON.stringify(out, null, 2));
console.log(`Extracted ${data.products.length} products to data/products.json`);