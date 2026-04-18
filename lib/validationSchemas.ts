import { z } from 'zod';

/**
 * Input validation schemas for API endpoints
 * Prevents injection attacks, type errors, and invalid data
 */

// ========================================
// AUTHENTICATION
// ========================================
export const AdminLoginSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .max(256, 'Password is too long'),
});

// ========================================
// CUSTOMER & PROFILE
// ========================================
export const PhoneSchema = z
  .string()
  .regex(/^254\d{9}$/, 'Phone must be in format 254XXXXXXXXX')
  .or(z.string().regex(/^\+254\d{9}$/, 'Phone must be in format +254XXXXXXXXX'))
  .transform(p => p.startsWith('+') ? p.substring(1) : p);

export const CustomerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name contains invalid characters'),
  phone: PhoneSchema,
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(256, 'Address is too long'),
  email: z
    .string()
    .email('Invalid email format')
    .optional(),
});

// ========================================
// PRODUCTS & MENU
// ========================================
export const MenuItemSchema = z.object({
  name: z
    .string()
    .min(2, 'Item name must be at least 2 characters')
    .max(100, 'Item name is too long')
    .regex(/^[a-zA-Z0-9\s&'-]+$/, 'Item name contains invalid characters'),
  price: z
    .number()
    .positive('Price must be positive')
    .max(1000000, 'Price is too high'),
  category: z
    .string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category is too long'),
  description: z
    .string()
    .max(1000, 'Description is too long')
    .optional(),
  image: z
    .string()
    .url('Invalid image URL')
    .optional(),
  isAvailable: z
    .boolean()
    .optional()
    .default(true),
});

// ========================================
// CART & CHECKOUT
// ========================================
export const CartItemSchema = z.object({
  menuItemId: z
    .string()
    .regex(/^[0-9a-f]{24}$/, 'Invalid menu item ID'),
  name: z.string(),
  price: z.number().positive(),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be at least 1')
    .max(100, 'Quantity cannot exceed 100'),
});

export const CheckoutSchema = z.object({
  customer: CustomerSchema,
  items: z
    .array(CartItemSchema)
    .min(1, 'Cart cannot be empty')
    .max(100, 'Too many items in cart'),
  paymentMethod: z
    .enum(['mpesa', 'stripe', 'paypal'])
    .optional()
    .default('mpesa'),
});

// ========================================
// ORDERS
// ========================================
export const OrderUpdateSchema = z.object({
  status: z
    .enum(['pending', 'preparing', 'dispatched', 'delivered', 'cancelled'])
    .optional(),
  paymentStatus: z
    .enum(['unpaid', 'paid'])
    .optional(),
  assignedDriver: z
    .string()
    .regex(/^[0-9a-f]{24}$/, 'Invalid driver ID')
    .optional(),
});

// ========================================
// PAYMENTS
// ========================================
export const M2CPaymentSchema = z.object({
  phone: PhoneSchema,
  amount: z
    .number()
    .positive('Amount must be positive')
    .max(10000000, 'Amount is too high'),
  accountReference: z
    .string()
    .max(50, 'Account reference is too long'),
  transactionDesc: z
    .string()
    .max(100, 'Transaction description is too long')
    .optional(),
});

// ========================================
// PAGINATION & FILTERING
// ========================================
export const PaginationSchema = z.object({
  limit: z
    .number()
    .int()
    .positive('Limit must be positive')
    .max(1000, 'Limit cannot exceed 1000')
    .optional()
    .default(10),
  page: z
    .number()
    .int()
    .positive('Page must be positive')
    .optional()
    .default(1),
  sort: z
    .enum(['createdAt', '-createdAt', 'price', '-price', 'name'])
    .optional()
    .default('-createdAt'),
});

// ========================================
// DRIVERS
// ========================================
export const DriverLoginSchema = z.object({
  phone: PhoneSchema,
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(256, 'Password is too long'),
});

export const DriverSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  phone: PhoneSchema,
  vehicleNumber: z
    .string()
    .regex(/^[A-Z]{3}-\d{3}[A-Z]$/, 'Invalid vehicle number format (e.g., KCA-123A)'),
  licenseNumber: z
    .string()
    .min(6, 'License number is too short')
    .max(20, 'License number is too long'),
});

// ========================================
// VALIDATION HELPERS
// ========================================
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
      return { success: false, error: errorMessages };
    }
    return { success: false, error: 'Validation failed' };
  }
}
