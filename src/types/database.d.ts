
/**
 * TypeScript type definitions
 */

// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  phone: number;
  profileImage?: string;
  completionRate?: string;
  averageResponseTime?: number; // Assuming this might be a numerical value (e.g., in milliseconds or seconds)
  createdAt: Date;
  isVerified: boolean;
  tradeCount?: number;
  paymentMethod: PaymentMethod[];
  country?: string;
  piBalance: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: string;
  memo: string;
  paymentId: string;
  txid: string;
  status: TransactionStatus;
  walletAddress: string;
  previousBalance: number;
  currentBalance:number;
  createdAt: Date;
}

// Trade and Order types
export type TransactionType = "Deposit" | "Withdraw";
export type TransactionStatus = "Successful" | "Cancelled" | "Pending";
export type OrderType = "Buy" | "Sell";
export type OrderStatus = "Completed" | "Processing" | "Cancelled";

export interface Trade {
  id: string;
  userId: string;
  type: OrderType;
  quantity: string;
  totalAmount: string
  priceType: PriceType;
  price: string;
  total: string;
  status: OrderStatus;
  date: Date;
  currency: string;
  fiatCurrency: string;
  paymentMethod: string;
  tradeTerms?: string;
  limits?: {
    min: number;
    max: number;
  };
}
export interface Order {
  id: string;
  orderId: string;
  userId: string;
  counterpartyId: string;
  totalAmount: string;
  quanrity: number;
  price: number;
  status: OrderStatus;
  date: Date;
}
// Payment related types (e.g Bank Transafer, Cash)
export interface PaymentMethod {
  id: string;
  name: string;
  color: string;
  available: boolean;
}

// Trading restrictions and settings
export interface TradingRestrictions {
  userId: string;
  paymentTime: string;
  rankLimit: string;
  registrationDays: string;
  specificCountry: string;
  tradeRange: string;
  maxOrdersPerUser: string;
}

// Application component-specific types
export type OrderTab = "all" | "buy" | "sell";
export type TradeMode = "Buy" | "Sell";
export type PriceType = "Fixed" | "Floating";

// Notification types
export interface Notification {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  read: boolean;
  date: Date;
}

// export interface CurrencyInfo {
//   code: string;
//   name: string;
//   icon: string;
//   balance?: string;
//   price?: string;
// }

// // Response types for API calls
// export interface ApiResponse<T> {
//   success: boolean;
//   data?: T;
//   error?: string;
//   message?: string;
// }