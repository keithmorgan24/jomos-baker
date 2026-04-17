import mongoose, { Schema, model, models } from 'mongoose';

// Nested Vehicle Schema for the Fleet
const VehicleSchema = new Schema({
  plate: { 
    type: String, 
    required: true, 
    uppercase: true, // Force KBA 123 format
    trim: true 
  },
  type: { 
    type: String, 
    enum: ['Motorbike', 'Tuk Tuk', 'Small Van', 'High-End Sedan'], 
    default: 'Motorbike' 
  },
  status: { 
    type: String, 
    enum: ['active', 'maintenance', 'retired'], 
    default: 'active' 
  }
});

// Main Driver Schema
const DriverSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    index: true // Optimized for verify-driver lookups
  },
  phone: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    index: true // Critical for login performance
  },
  location: { 
    type: String, 
    required: true,
    default: 'Main Hub'
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  orders: { 
    type: Number, 
    default: 0 
  },
  // Sub-document array for fleet management
  vehicles: [VehicleSchema], 
}, { 
  timestamps: true,
  // Ensure we match the collection name used in your earlier logic
  collection: 'fleet' 
});

// Prevent model re-compilation error in Next.js HMR
const Driver = models.Driver || model('Driver', DriverSchema);

export default Driver;