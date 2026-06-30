const fs = require("fs");
const path = require("path");

const orders = [
  { id: "RVN-M2K8X4", userId: "u1", customerName: "Elif Kaya", customerEmail: "elif.kaya@email.com", customerPhone: "+90 532 111 2233", items: [{ productId: 6, name: "Soft Pinch Liquid Blush", brand: "Rare Beauty", quantity: 1, price: 1099 }, { productId: 2, name: "Hyaluronic Acid Serum", brand: "The Inkey List", quantity: 1, price: 389 }], subtotal: 1488, shipping: 0, discount: 0, total: 1488, status: "delivered", paymentMethod: "Papara", payment: { provider: "Papara", providerId: "papara", transactionId: "PPR-88291034", status: "paid", amount: 1488, paidAt: "2026-06-28T14:32:00Z" }, shippingInfo: { carrier: "MNG Kargo", carrierCode: "MNG", trackingNumber: "MNG9988776655", status: "delivered", estimatedDelivery: "2026-06-30", events: [] }, shippingAddress: "Kadıköy, İstanbul", pointsEarned: 124, createdAt: "2026-06-28T14:30:00Z", updatedAt: "2026-06-30T10:00:00Z" },
  { id: "RVN-P9L2K1", userId: "u2", customerName: "Zeynep Arslan", customerEmail: "zeynep.a@email.com", items: [{ productId: 48, name: "Relief Sun SPF50+", brand: "Beauty of Joseon", quantity: 2, price: 649 }], subtotal: 1298, shipping: 0, discount: 0, total: 1298, status: "shipped", paymentMethod: "Kredi Kartı", payment: { provider: "iyzico", providerId: "iyzico", transactionId: "IYZ-001", status: "paid", amount: 1298, paidAt: "2026-06-29T18:01:00Z" }, shippingInfo: { carrier: "Yurtiçi Kargo", carrierCode: "YK", trackingNumber: "YK7849201563", status: "in_transit", estimatedDelivery: "2026-07-01", events: [] }, shippingAddress: "Çankaya, Ankara", pointsEarned: 283, createdAt: "2026-06-29T18:00:00Z", updatedAt: "2026-06-30T08:00:00Z" },
  { id: "RVN-A3F8W9", userId: "u10", customerName: "Fatma İnce", customerEmail: "fatma.i@email.com", items: [{ productId: 1, name: "Niacinamide Serum", brand: "The Ordinary", quantity: 2, price: 449 }], subtotal: 898, shipping: 0, discount: 0, total: 898, status: "processing", paymentMethod: "Kredi Kartı", payment: { provider: "iyzico", providerId: "iyzico", transactionId: "IYZ-002", status: "paid", amount: 898 }, shippingInfo: { carrier: "HepsiJet", carrierCode: "HJ", trackingNumber: "HJ20260630001", status: "preparing", estimatedDelivery: "2026-07-02", events: [] }, shippingAddress: "Bornova, İzmir", pointsEarned: 0, createdAt: "2026-06-30T09:15:00Z", updatedAt: "2026-06-30T11:00:00Z" },
];

const out = path.join(__dirname, "../data/orders.json");
if (!fs.existsSync(out)) {
  fs.writeFileSync(out, JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), orders }, null, 2));
  console.log("Seeded orders.json with", orders.length, "orders");
} else {
  console.log("orders.json already exists, skipping seed");
}