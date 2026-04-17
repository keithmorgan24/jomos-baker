import { z } from 'zod';

// Vehicle Schema - High Performance
export const VehicleSchema = z.object({
  plate: z.string()
    .min(4, "Plate must be at least 4 characters")
    .max(10)
    .toUpperCase()
    .trim()
    .regex(/^[A-Z0-9 ]+$/, "Invalid plate format"), // Prevents injection/special chars
  type: z.enum(['Motorbike', 'Tuk Tuk', 'Small Van', 'High-End Sedan']),
});

// Menu Item Schema - Hardened
export const MenuItemSchema = z.object({
  _id: z.string().optional(), // Optional for creation, required for updates
  name: z.string().min(2, "Name is too short").trim(),
  // Enhanced preprocess: handles empty strings, nulls, and commas
  price: z.preprocess((val) => {
    if (typeof val === 'string') return parseFloat(val.replace(/,/g, ''));
    return val;
  }, z.number().positive("Price must be greater than 0")),
  category: z.string().min(1, "Category is required"),
 image: z.string().optional(),
  description: z.string().max(500).optional().default("Handcrafted for excellence."),
  isAvailable: z.boolean().default(true), // New field for availability
});

// Infer types for use in Frontend/Backend
export type MenuItemInput = z.infer<typeof MenuItemSchema>;
export type VehicleInput = z.infer<typeof VehicleSchema>;