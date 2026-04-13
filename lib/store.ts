import { create } from 'zustand';

interface CartItem {
  name: string;
  price: string;
  image: string;
  category: string; 
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: any) => void;
  removeItem: (name: string) => void;
  updateQuantity: (name: string, type: 'plus' | 'minus') => void;
  clearCart: () => void; 
  toastMessage: string | null;
  showToast: (message: string) => void;
}

export const useCart = create<CartState>((set) => ({
  items: [],
  toastMessage: null,

  // 1. Logic: Adds a new item or increments quantity if already exists
  addItem: (newItem) => set((state) => {
    const existingItem = state.items.find(item => item.name === newItem.name);
    if (existingItem) {
      return {
        items: state.items.map(item =>
          item.name === newItem.name ? { ...item, quantity: item.quantity + 1 } : item
        )
      };
    }
    return { items: [...state.items, { ...newItem, quantity: 1 }] };
  }),

  // 2. Logic: Removes an item entirely from the cart
  removeItem: (name) => set((state) => ({
    items: state.items.filter(item => item.name !== name)
  })),

  // 3. Logic: Safely increments or decrements quantity (minimum 1)
  updateQuantity: (name, type) => set((state) => ({
    items: state.items.map(item => {
      if (item.name === name) {
        const newQty = type === 'plus' ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    })
  })),

  // 4. Logic: Completely resets the cart
  clearCart: () => set({ items: [] }),

  // 5. Logic: Handles global notifications with auto-hide
  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => set({ toastMessage: null }), 3000);
  },
}));