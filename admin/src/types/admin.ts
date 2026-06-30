export type AdminRole =
  | "super_admin"
  | "platform_admin"
  | "support_agent"
  | "content_manager"
  | "finance";

export type UserStatus = "active" | "banned" | "pending" | "invited";
export type ClubTier = "bronze" | "silver" | "gold" | "platinum";

export interface Permission {
  id: string;
  label: string;
  group: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: UserStatus;
  roles: AdminRole[];
  permissions: string[];
  isClubMember: boolean;
  clubTier: ClubTier;
  clubPoints: number;
  lifetimeSpend: number;
  totalOrders: number;
  lastLoginAt: string;
  createdAt: string;
  bannedAt?: string;
  bannedReason?: string;
}

export interface ActivityEvent {
  id: string;
  userId: string;
  type: "login" | "order" | "profile" | "club" | "support" | "admin";
  title: string;
  description: string;
  createdAt: string;
  meta?: Record<string, string | number>;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  actorId: string;
  actorName: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface ClubTierHistory {
  id: string;
  userId: string;
  from: ClubTier;
  to: ClubTier;
  reason: string;
  createdAt: string;
}

export interface PointHistoryEntry {
  id: string;
  userId: string;
  type: "earn" | "redeem" | "bonus" | "adjust";
  amount: number;
  description: string;
  orderId?: string;
  createdAt: string;
}

export interface DashboardStats {
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  users: number;
  usersChange: number;
  clubMembers: number;
  clubChange: number;
  shipmentsInTransit: number;
  pendingPayments: number;
}

export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: number;
  name: string;
  brand: string;
  sales: number;
  revenue: number;
}

export interface ClubGrowthPoint {
  month: string;
  members: number;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partial_refund";
export type ShipmentStatus = "preparing" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "returned";

export interface OrderItem {
  productId: number;
  name: string;
  brand: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface ShippingTrackingEvent {
  id: string;
  status: ShipmentStatus;
  title: string;
  location: string;
  createdAt: string;
}

export interface OrderShipping {
  carrier: string;
  carrierId: string;
  carrierCode: string;
  serviceId?: string;
  trackingNumber: string;
  status: ShipmentStatus;
  estimatedDelivery?: string;
  labelUrl?: string;
  events: ShippingTrackingEvent[];
}

export interface OrderShippingMethod {
  methodId: string;
  carrierId: string;
  serviceId: string;
  type: "delivery" | "pickup" | "free";
  price: number;
  etaDays: number;
}

export interface OrderPayment {
  provider: string;
  providerId: string;
  transactionId: string;
  status: PaymentStatus;
  amount: number;
  paidAt?: string;
  installment?: number;
  authCode?: string;
  cardBrand?: string;
  lastFour?: string;
}

export interface AdminOrder {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  payment: OrderPayment;
  shippingInfo: OrderShipping;
  shippingMethod?: OrderShippingMethod;
  shippingAddress: string;
  billingAddress?: string;
  pointsEarned: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CosmeticCategory =
  | "makyaj"
  | "cilt-bakimi"
  | "sac-bakimi"
  | "parfum"
  | "vucut-bakimi"
  | "tirnak"
  | "erkek-bakim"
  | "aksesuar";

export type SkinType = "Kuru" | "Yağlı" | "Karma" | "Hassas" | "Normal";
export type RoutineRole = "cleanser" | "toner" | "serum" | "moisturizer" | "spf" | "mask" | "exfoliant" | "eye" | "lip" | "makeup" | "";

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  shade?: string;
}

export interface AdminProduct {
  id: number;
  name: string;
  brand: string;
  brandId: string;
  category: CosmeticCategory;
  categoryLabel: string;
  subcategory?: string;
  description: string;
  ingredients: string;
  howToUse?: string;
  skinTypes: SkinType[];
  tags: string[];
  routineRole?: RoutineRole;
  spf?: number;
  volume?: string;
  shade?: string;
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
  barcode?: string;
  rating: number;
  reviews: number;
  vegan: boolean;
  crueltyFree: boolean;
  cleanBeauty: boolean;
  kBeauty: boolean;
  bestseller: boolean;
  new: boolean;
  flash: boolean;
  badge?: string;
  active: boolean;
  collections: string[];
  images: string[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  country: string;
  logo?: string;
  productCount: number;
  active: boolean;
}

export interface Category {
  id: CosmeticCategory;
  name: string;
  icon: string;
  productCount: number;
}

export interface Collection {
  id: string;
  name: string;
  emoji: string;
  productCount: number;
  active: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  code: string;
  type: "percent" | "fixed" | "shipping" | "points";
  value: number;
  minOrder?: number;
  usageCount: number;
  usageLimit?: number;
  active: boolean;
  startsAt: string;
  endsAt: string;
}

export interface ClubTierConfig {
  id: ClubTier;
  name: string;
  minPoints: number;
  pointRate: number;
  birthdayDiscount: number;
  color: string;
  benefits: string[];
  memberCount: number;
}

export interface ShippingServiceRate {
  id: string;
  name: string;
  basePrice: number;
  etaDays: number;
  active: boolean;
}

export interface ShippingWarehouse {
  name: string;
  address: string;
  city: string;
  phone: string;
}

export interface ShippingCarrier {
  id: string;
  name: string;
  code: string;
  logo: string;
  trackingUrl: string;
  active: boolean;
  testMode: boolean;
  avgDeliveryDays: number;
  apiKeyMasked?: string;
  apiKey?: string;
  apiSecret?: string;
  customerCode?: string;
  services: ShippingServiceRate[];
  warehouse?: ShippingWarehouse;
}

export interface Shipment {
  id: string;
  orderId: string;
  customerName: string;
  carrier: string;
  carrierCode: string;
  trackingNumber: string;
  status: ShipmentStatus;
  city: string;
  itemCount: number;
  estimatedDelivery: string;
  events: ShippingTrackingEvent[];
  createdAt: string;
}

export interface PaymentProvider {
  id: string;
  name: string;
  type: "card" | "wallet" | "transfer" | "installment";
  logo: string;
  active: boolean;
  testMode: boolean;
  commission: number;
  supportedInstallments: number[];
  apiKeyMasked: string;
  apiKey?: string;
  apiSecret?: string;
  merchantId?: string;
}

export interface PaymentBankAccount {
  bank: string;
  iban: string;
  holder: string;
  branch?: string;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  provider: string;
  amount: number;
  status: PaymentStatus;
  customerName: string;
  installment?: number;
  createdAt: string;
}