export interface PaymentCardInput {
  number: string;
  expireMonth: string;
  expireYear: string;
  cvc: string;
  holderName: string;
}

export interface PaymentCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface PaymentBasketItem {
  name: string;
  price: number;
  quantity: number;
}

export interface PaymentProcessRequest {
  providerId: string;
  amount: number;
  installment?: number;
  orderRef: string;
  card?: PaymentCardInput;
  customer: PaymentCustomer;
  basket: PaymentBasketItem[];
}

export interface PaymentProcessResult {
  success: boolean;
  status: "paid" | "pending" | "failed";
  transactionId: string;
  providerId: string;
  providerName: string;
  authCode?: string;
  installment?: number;
  testMode: boolean;
  message?: string;
  errorCode?: string;
  bankTransfer?: { bank: string; iban: string; holder: string; reference: string };
}