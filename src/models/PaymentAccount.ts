
import mongoose, { Schema } from 'mongoose';
import { IPaymentAccount } from '../types';

const PaymentAccountSchema = new Schema<IPaymentAccount>({
  uid: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User' }, 
  bank_name: { type: String, required: true },
  account_number: { type: String, required: true },
  account_name: { type: String, required: true }
  
}, {
  timestamps: true
});
const PaymentAccount =  mongoose.model<IPaymentAccount>('Payment-Account', PaymentAccountSchema);

export default PaymentAccount;