import { getStoreProducts } from "./repository";
import { getActiveDiscountCodes, getCampaigns } from "./campaigns-repo";
import { getClubData } from "./club-repo";
import { getOrders } from "./orders-repo";

export async function getFullStore() {
  const [products, campaigns, club, orders] = await Promise.all([
    getStoreProducts(),
    getCampaigns(),
    getClubData(),
    getOrders(),
  ]);
  const discountCodes = await getActiveDiscountCodes();
  return {
    updatedAt: new Date().toISOString(),
    products: products.products,
    productsUpdatedAt: products.updatedAt,
    campaigns,
    discountCodes,
    clubTiers: club.tiers,
    clubSettings: club.settings,
    orders: orders.map((o) => ({
      id: o.id,
      status: o.status,
      total: o.total,
      trackingNumber: o.shippingInfo.trackingNumber,
      carrier: o.shippingInfo.carrier,
      carrierId: o.shippingInfo.carrierId,
      shipmentStatus: o.shippingInfo.status,
      estimatedDelivery: o.shippingInfo.estimatedDelivery,
      customerEmail: o.customerEmail,
    })),
  };
}