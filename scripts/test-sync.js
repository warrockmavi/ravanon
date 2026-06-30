const fs = require("fs");
const path = require("path");

async function main() {
  const res = await fetch("http://localhost:3000/api/products/1");
  const { product } = await res.json();
  product.price = 599;
  product.description = "ENTEGRE TEST — Admin panelden güncellendi";
  product.ingredients = "Aqua, Niacinamide %10, Zinc PCA — GÜNCEL";

  const put = await fetch("http://localhost:3000/api/products/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  console.log("PUT status:", put.status);

  const json = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json"), "utf8"));
  const p = json.products.find((x) => x.id === 1);
  console.log("products.json price:", p?.price, "desc:", p?.description?.slice(0, 40));

  const dataJs = fs.readFileSync(path.join(__dirname, "../js/data.js"), "utf8");
  console.log("data.js contains 599:", dataJs.includes("price: 599"));
  console.log("data.js contains ENTEGRE TEST:", dataJs.includes("ENTEGRE TEST"));

  const store = await fetch("http://localhost:3000/api/store");
  const storeData = await store.json();
  const sp = storeData.products.find((x) => x.id === 1);
  console.log("api/store price:", sp?.price);
}

main().catch(console.error);