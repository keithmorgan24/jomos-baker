import { Schema, model, models } from 'mongoose';

const ItemSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Dish name is required'],
    trim: true,
    index: true  // ✅ Speeds up name searches
  },
  price: { 
    type: Number,
    required: [true, 'Price is required'],
    index: true  // ✅ Speeds up price-range filtering
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    index: true  // ✅ Essential for the "Pastries/Meals" filter
  },
  image: { 
    type: String,
    required: false
  },
  isAvailable: {
    type: Boolean,
    default: true,
    index: true  // ✅ CRITICAL: Used on every public GET request
  }
}, {
  timestamps: true,
});

// ✅ Compound index: Speeds up the exact query used in your public API
ItemSchema.index({ isAvailable: 1, category: 1 });

const Item = models.Item || model('Item', ItemSchema);

export default Item;