import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_MENU_ITEMS } from './menu';

export interface MenuItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  isAvailable?: boolean; // New field to track availability
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface JomoState {
  menu: MenuItem[];
  items: CartItem[];
  setMenu: (newMenu: MenuItem[]) => void;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, type: 'plus' | 'minus') => void;
  clearCart: () => void;
  toastMessage: string | null;
  showToast: (message: string) => void;
  getTotalCount: () => number;
  _hasHydrated: boolean; // New: Hydration tracker
  setHasHydrated: (state: boolean) => void;
}

export const useCart = create<JomoState>()(
  persist(
    (set, get) => ({
      menu: (INITIAL_MENU_ITEMS as unknown) as MenuItem[],
      items: [],
      toastMessage: null,
      _hasHydrated: false, // Initial state for hydration

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      setMenu: (newMenu) => set({ menu: newMenu }),

      addItem: (newItem) => {
        const { items, showToast } = get();
        // Strict ID check for reliability
        const existingItem = items.find(item => item._id === newItem._id);
        
        showToast(`${newItem.name} added!`);
        
        if (existingItem) {
          set({ 
            items: items.map(i => 
              i._id === newItem._id ? { ...i, quantity: i.quantity + 1 } : i
            ) 
          });
        } else {
          // Force price to Number to prevent NaN in Sidebar
          const safePrice = typeof newItem.price === 'string' ? parseFloat(newItem.price) : newItem.price;
          set({ items: [...items, { ...newItem, price: safePrice, quantity: 1 }] });
        }
      },

      removeItem: (id) => set((state) => ({ 
        items: state.items.filter(i => i._id !== id) 
      })),

      updateQuantity: (id, type) => set((state) => ({
        items: state.items.map(i => 
          i._id === id 
          ? { ...i, quantity: Math.max(1, type === 'plus' ? i.quantity + 1 : i.quantity - 1) } 
          : i
        )
      })),

      clearCart: () => set({ items: [] }),

      showToast: (message) => {
        set({ toastMessage: message });
        setTimeout(() => set({ toastMessage: null }), 3000);
      },

      getTotalCount: () => get().items.reduce((total, item) => total + item.quantity, 0),
    }),
    { 
      name: 'jomos-baker-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // Mark as hydrated when storage is loaded
      }
    }
  )
);