import { create } from 'zustand';

// Improved Interface for Type Safety
interface CartItem {
  name: string;
  price: string;
  image: string;
  category: string; 
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void; // Expect item without quantity first
  removeItem: (name: string) => void;
  updateQuantity: (name: string, type: 'plus' | 'minus') => void;
  clearCart: () => void; 
  toastMessage: string | null;
  showToast: (message: string) => void;
  getTotalCount: () => number; // Added helper for the Navbar badge
}

export const useCart = create<CartState>((set, get) => ({
  items: [],
  toastMessage: null,

  // 1. Logic: Robust Add Item
  addItem: (newItem) => set((state) => {
    const existingItem = state.items.find(item => item.name === newItem.name);
    
    // Trigger toast notification on add
    state.showToast(`${newItem.name} added to cart!`);

    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.name === newItem.name ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    // Ensure quantity is strictly 1 for new items
    return { items: [...state.items, { ...newItem, quantity: 1 }] };
  }),

  removeItem: (name) => set((state) => ({
    items: state.items.filter(item => item.name !== name)
  })),

  updateQuantity: (name, type) => set((state) => ({
    items: state.items.map(item => {
      if (item.name === name) {
        const newQty = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    })
  })),

  clearCart: () => set({ items: [] }),

  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => set({ toastMessage: null }), 3000);
  },

  // 2. Logic: Helper to sum up total quantity for the Navbar
  getTotalCount: () => {
    const items = get().items;
    return items.reduce((total, item) => total + item.quantity, 0);
  }
}));