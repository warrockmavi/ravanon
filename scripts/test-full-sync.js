const fs = require("fs");
const path = require("path");

async function main() {
  const store = await fetch("http://localhost:3000/api/store").then((r) => r.json());
  console.log("Store API:");
  console.log("  products:", store.products?.length);
  console.log("  campaigns:", store.campaigns?.length);
  console.log("  discountCodes:", Object.keys(store.discountCodes || {}));
  console.log("  clubTiers:", store.clubTiers?.length);
  console.log("  freeShippingMin:", store.clubSettings?.freeShippingMin);
  console.log("  orders:", store.orders?.length);

  const dataJs = fs.readFileSync(path.join(__dirname, "../js/data.js"), "utf8");
  console.log("\ndata.js sync:");
  console.log("  clubSettings:", dataJs.includes("clubSettings"));
  console.log("  pointRate:", dataJs.includes("pointRate"));
  console.log("  WELCOME15:", dataJs.includes("WELCOME15"));
}

main().catch((e) => console.error("Admin sunucusu kapalı olabilir:", e.message));