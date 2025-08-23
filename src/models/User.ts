import mongoose, { Schema } from "mongoose";

import { IUser } from "../types";

const userSchema = new Schema<IUser>(
  {
    uid: {  
      type: String,
      required: true,
      unique: true,
      index: true, // Index for faster lookups
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },    
    roles: {
      type: String,
      enum: ["pioneer", "merchant", "admin"],
      required: true,
      default: "user"
    }
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;


// Re-define PaymentMethod for Mongoose schema if it's embedded or referenced
// const PaymentMethodSchema = new Schema<PaymentMethodInterface>({
//   name: { type: String, required: true },
//   color: { type: String, required: true },
//   available: { type: Boolean, required: true, default: true },
// }); 

// // export interface IUserDocument extends UserInterface, Document {}

// const UserSchema: Schema = new Schema({
//   id: { type: String, required: true, unique: true, index: true }, // If you want to use your own 'id'
//   username: { type: String, required: true, unique: true, trim: true },
//   email: { type: String, required: true, unique: true, trim: true, lowercase: true },
//   phone: {type: Number, required: true},
//   profileImage: { type: String },
//   completionRate: { type: String }, // Consider if this should be Number
//   averageResponseTime: { type: Number }, // Changed from string in .d.ts
//   createdAt: { type: Date, default: Date.now },
//   isVerified: { type: Boolean, default: false },
//   tradeCount: { type: Number, default: 0 },
//   // paymentMethod: [PaymentMethodSchema], // Embedding payment methods
//   // If PaymentMethod is a separate collection, you would use:
//   paymentMethod: [{ type: Schema.Types.ObjectId, ref: 'PaymentMethod' }],
//   country: { type: String },
//   piBalance: { type: Number, required: true, default: 0 },
// }, {
//   timestamps: true,
//   toJSON: {
//     transform(doc, ret) {
//       // If you are not using your own 'id' field and want to use mongo's _id as id
//       // ret.id = ret._id;
//       // delete ret._id;
//       delete ret.__v;
//       // delete ret.password; // Ensure password is not sent back
//     }
//   }
// });


// // export default mongoose.model<IUserDocument>('User', UserSchema);