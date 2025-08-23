// import mongoose, { Schema, Document } from 'mongoose';
// import { Trade as TradeInterface, OrderType, OrderStatus, PriceType } from '../types/database';

// export interface ITradeDocument extends TradeInterface, Document {}

// const TradeSchema: Schema = new Schema({
//     id: { type: String, required: true, unique: true, index: true },
//     userId: { type: String, required: true, index: true }, // or type: Schema.Types.ObjectId, ref: 'User'
//     type: { type: String, enum: Object.values(OrderType), required: true },
//     quantity: { type: String, required: true },
//     totalAmount: { type: String, required: true }, // Consistent naming
//     priceType: { type: String, enum: Object.values(PriceType), required: true },
//     price: { type: String, required: true },
//     total: { type: String, required: true },
//     status: { type: String, enum: Object.values(OrderStatus), required: true },
//     date: { type: Date, default: Date.now },
//     currency: { type: String, required: true },
//     fiatCurrency: { type: String, required: true },
//     paymentMethod: { type: String, required: true },
//     tradeTerms: { type: String },
//     limits: {
//         min: { type: Number },
//         max: { type: Number },
//     },
// }, {
//     timestamps: true,
//     toJSON: {
//         transform(doc, ret) {
//             // ret.id = ret._id;
//             // delete ret._id;
//             delete ret.__v;
//         }
//     }
// });

// export default mongoose.model<ITradeDocument>('Trade', TradeSchema);