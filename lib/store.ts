import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_MENU_ITEMS, MenuItem } from './menu'; // Import the seeding data

interface CartItem extends MenuItem {
  quantity: number;
}

interface JomoState {
  menu: MenuItem[]; 
  setMenu: (newMenu: MenuItem[]) => void;
  updateMenuItem: (name: string, updatedItem: MenuItem) => void;
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (name: string) => void;
  updateQuantity: (name: string, type: 'plus' | 'minus') => void;
  clearCart: () => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  getTotalCount: () => number;
}

export const useCart = create<JomoState>()(
  persist(
    (set, get) => ({
      // Initialize with the data from menu.ts
      menu: INITIAL_MENU_ITEMS,

      setMenu: (newMenu) => set({ menu: newMenu }),

      updateMenuItem: (name, updatedItem) => set((state) => ({
        menu: state.menu.map((item) => item.name === name ? updatedItem : item)
      })),

      items: [],
      toastMessage: null,

      addItem: (newItem) => {
        const state = get();
        const existingItem = state.items.find(item => item.name === newItem.name);
        state.showToast(`${newItem.name} added!`);
        if (existingItem) {
          set({ items: state.items.map(i => i.name === newItem.name ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...state.items, { ...newItem, quantity: 1 }] });
        }
      },

      removeItem: (name) => set((state) => ({ items: state.items.filter(i => i.name !== name) })),

      updateQuantity: (name, type) => set((state) => ({
        items: state.items.map(i => i.name === name ? { ...i, quantity: Math.max(1, type === 'plus' ? i.quantity + 1 : i.quantity - 1) } : i)
      })),

      clearCart: () => set({ items: [] }),

      showToast: (message) => {
        set({ toastMessage: message });
        setTimeout(() => set({ toastMessage: null }), 3000);
      },

      getTotalCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    { name: 'jomos-baker-storage' }
  )
);