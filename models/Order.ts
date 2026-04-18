import mongoose, { Schema, model, models } from 'mongoose';
import { randomUUID } from 'crypto';

const OrderSchema = new Schema({
  orderNumber: { 
    type: String, 
    unique: true,
    required: true,
    index: true,
    default: () => {
      const timestamp = Date.now();
      const uuid = randomUUID().split('-')[0];
      return `JB-${timestamp}-${uuid}`;
    }
  },
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  items: [{
    menuItemId: { type: Schema.Types.ObjectId, ref: 'Item' },
    name: String,
    price: Number,
    quantity: Number
  }],
  subtotal: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'preparing', 'dispatched', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  assignedDriver: { type: Schema.Types.ObjectId, ref: 'Driver', default: null },
  paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
}, { timestamps: true });

// Indexing for the Live Stream performance
OrderSchema.index({ status: 1, createdAt: -1 });

export default models.Order || model('Order', OrderSchema);