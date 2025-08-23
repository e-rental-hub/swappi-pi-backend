import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from '../types';
import { TransactionStatus, TradeModeEnum, TradeTypeEnum } from './enum/transaction';

interface ITransactionDocument extends ITransaction, Document {}

const TransactionSchema = new Schema<ITransactionDocument>({
  sender_uid: { type: String, required: true },
  sender_id: { type: Schema.Types.ObjectId, ref: 'User' }, 
  receiver_uid: { 
    type: String, 
    required: function(this: any) { return this.trade_mode === TradeModeEnum.Buy; },
    default: null 
  },
  receiver_id: { 
    type: Schema.Types.ObjectId, 
    required: function(this: any) { return this.trade_mode === TradeModeEnum.Buy; },
    default: null, 
    ref: 'User' 
  }, 
  trade_type: { type: String, enum: Object.values(TradeTypeEnum), required: true },
  trade_mode: { type: String, enum: Object.values(TradeModeEnum), required: true },
  amount: { type: Schema.Types.Decimal128, required: true, default: 0.00 }, 
  memo: { type: String, required: true },
  payment_id: { 
    type: String, 
    required: function(this: any) { return this.trade_mode === TradeModeEnum.Sell; }, 
    unique: false, 
    default: null
  }, 
  txid: { type: String, required: false, unique: false, default: null },
  status: { type: String, enum: Object.values(TransactionStatus), required: true, default: TransactionStatus.Initialized },
  wallet_address: { 
    type: String, 
    required: function(this: any) { return this.trade_mode === TradeModeEnum.Buy; }, 
    default: null 
  },
  prev_balance: { type: Number, required: true, default: 0.00 },
  current_balance: { type: Number, required: true, default: 0.00 },
  payment_account: { 
    type: Schema.Types.ObjectId, 
    ref: 'Payment-Account', 
    required: function(this: any) { return this.trade_mode === TradeModeEnum.Sell; }, 
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.__v;
      ret.amount = parseFloat(ret.amount.toString());
    }
  }
});

TransactionSchema.index({ txid: 1 }, {
  unique: true,
  partialFilterExpression: { txid: { $type: "string" } }
});
TransactionSchema.index({ payment_id: 1 }, {
  unique: true,
  partialFilterExpression: { payment_id: { $type: "string" } }
});

const Transaction =  mongoose.model<ITransactionDocument>('Transaction', TransactionSchema);

export default Transaction;