import type { ShipmentStatus, ShippingTrackingEvent } from "@/types/admin";

export interface ShippingQuoteRequest {
  subtotal: number;
  methodId: string;
  city?: string;
  itemCount?: number;
}

export interface ShippingQuoteResult {
  methodId: string;
  carrierId: string;
  serviceId: string;
  type: "delivery" | "pickup" | "free";
  price: number;
  etaDays: number;
  etaLabel: string;
  carrierName: string;
  freeShippingApplied: boolean;
}

export interface CheckoutShippingMethod {
  methodId: string;
  carrierId: string;
  serviceId: string;
  type: "delivery" | "pickup" | "free";
  name: string;
  description: string;
  logo: string;
  price: number;
  etaDays: number;
  etaLabel: string;
}

export interface CreateShipmentRequest {
  orderId: string;
  carrierId: string;
  serviceId: string;
  recipient: {
    name: string;
    phone: string;
    address: string;
    city: string;
    district?: string;
  };
  items: Array<{ name: string; quantity: number }>;
  subtotal: number;
}

export interface ShipmentCreateResult {
  success: boolean;
  trackingNumber: string;
  carrierId: string;
  carrierName: string;
  carrierCode: string;
  serviceId: string;
  labelUrl?: string;
  estimatedDelivery: string;
  status: ShipmentStatus;
  events: ShippingTrackingEvent[];
  testMode: boolean;
  message?: string;
}

export interface TrackingSyncResult {
  success: boolean;
  status: ShipmentStatus;
  events: ShippingTrackingEvent[];
  estimatedDelivery?: string;
  message?: string;
}