#!/usr/bin/env node
/**
 * RAVANON kurulum doğrulama — clone sonrası çalıştırın: npm run verify
 */
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.resolve(__dirname, '..');
const ADMIN = path.join(ROOT, 'admin');
const REQUIRED = [
  'index.html',
  'Baslat.vbs',
  'admin/package.json',
  'admin/package-lock.json',
  'data/products.json',
  'js/store-bridge.js',
];

let failed = 0;

function ok(msg) { console.log(`  ✓ ${msg}`); }
function fail(msg) { console.error(`  ✗ ${msg}`); failed++; }

console.log('\nRAVANON Kurulum Doğrulama\n');

for (const f of REQUIRED) {
  if (fs.existsSync(path.join(ROOT, f))) ok(f);
  else fail(`Eksik: ${f}`);
}

if (!fs.existsSync(path.join(ADMIN, 'node_modules'))) {
  fail('admin/node_modules yok — KURULUM.bat veya "npm run setup" çalıştırın');
} else {
  ok('admin/node_modules mevcut');
}

function ping(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(3000, () => { req.destroy(); resolve(false); });
  });
}

async function checkServers() {
  const store = await ping('http://localhost:8765');
  const admin = await ping('http://localhost:3000/admin/login');

  if (store) ok('Mağaza sunucusu çalışıyor (8765)');
  else console.log('  · Mağaza sunucusu kapalı (8765) — Baslat.vbs ile başlatın');

  if (admin) ok('Admin panel çalışıyor (3000)');
  else console.log('  · Admin panel kapalı (3000) — admin/Baslat-Admin.vbs ile başlatın');
}

checkServers().then(() => {
  console.log(failed ? `\n${failed} sorun bulundu.\n` : '\nKurulum hazır.\n');
  process.exit(failed > 0 ? 1 : 0);
});