async function main() {
  const res = await fetch("http://localhost:3000/api/products/1");
  const { product } = await res.json();
  product.price = 449;
  product.description = "Gözenek görünümünü azaltan ve cilt tonunu eşitleyen güçlü serum.";
  product.ingredients = "Aqua, Niacinamide, Zinc PCA, Pentylene Glycol, Tamarindus Indica Seed Gum";
  const put = await fetch("http://localhost:3000/api/products/1", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  console.log("Reverted product 1:", put.status);
}
main();