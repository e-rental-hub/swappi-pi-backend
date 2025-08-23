// import mongoose, { Schema, Document } from 'mongoose';
// import { Order as OrderInterface, OrderStatus } from '../types/database';

// export interface IOrderDocument extends OrderInterface, Document {}

// const OrderSchema: Schema = new Schema({
//     id: { type: String, required: true, unique: true, index: true },
//     orderId: { type: String, required: true, unique: true }, // Assuming this needs to be unique
//     userId: { type: String, required: true, index: true },  // or type: Schema.Types.ObjectId, ref: 'User'
//     counterpartyId: { type: String, required: true, index: true }, // or ref: 'User'
//     totalAmount: { type: String, required: true },
//     quantity: { type: Number, required: true }, // Corrected spelling
//     price: { type: Number, required: true },
//     status: { type: String, enum: Object.values(OrderStatus), required: true },
//     date: { type: Date, default: Date.now },
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

// export default mongoose.model<IOrderDocument>('Order', OrderSchema);