
/**
 * TypeScript type definitions
 */

import { Document, Types } from "mongoose";
import { TradeModeEnum, TradeTypeEnum, TransactionStatus } from "./models/enum/transaction";

export interface IUser extends Document {
  _id: Types.ObjectId;
  uid: string;
  username: string;
  roles: "user" | "merchant" | "admin";
}

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

export interface ITransaction {
  sender_uid: string;
  receiver_uid: string | null;
  sender_id: Types.ObjectId;
  receiver_id: Types.ObjectId | null;
  trade_type: TradeTypeEnum;
  trade_mode: TradeModeEnum;
  amount: Types.Decimal128;
  memo: string;
  payment_id: string | null; // Payment ID is required for Sell transactions  
  txid: string | null;
  status: TransactionStatus;
  wallet_address?: string | null; // Wallet address is required for Buy transactions
  prev_balance?: Number;
  current_balance?: Number;
  payment_account: Types.ObjectId; // Field for payment account reference
}

export interface IPaymentAccount extends Document {
  uid: string;
  user_id: Types.ObjectId;
  bank_name: string;
  account_number: string;
  account_name: string;
}

// Trade and Order types
export type TransactionType = "Deposit" | "Withdraw";
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

export interface PaymentDTO {
  amount: number,
  user_uid: string,
  created_at: string,
  identifier: string,
  metadata: {
    trade_type: TradeTypeEnum,
    trade_mode: TradeModeEnum,
    payment_account: string,
    wallet_address: string
  },
  memo: string,
  status: {
    developer_approved: boolean,
    transaction_verified: boolean,
    developer_completed: boolean,
    cancelled: boolean,
    user_cancelled: boolean,
  },
  from_address: string,
  to_address: string,
  transaction: null | {
    txid: string,
    verified: boolean,
    _link: string,
  },
};

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