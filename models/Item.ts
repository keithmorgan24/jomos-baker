import { Schema, model, models } from 'mongoose';

// The Schema defines the structure of the document
const ItemSchema = new Schema({
  name: { 
    type: String, 
    required: [true, 'Dish name is required'],
    trim: true 
  },
  price: { 
    type: Number, // We store as a Number for math, format as KSh in UI
    required: [true, 'Price is required'] 
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'] 
  },
  image: { 
    type: String, // Base64 string from your camera or a URL
    required: false
  },
}, {
  // This automatically manages 'createdAt' and 'updatedAt' fields
  timestamps: true, 
});

// IMPORTANT NEXT.JS PATTERN:
// Models are cleared on every hot-reload in development. 
// This line checks if the model exists before creating a new one.
const Item = models.Item || model('Item', ItemSchema);

export default Item;