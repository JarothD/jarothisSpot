import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CartItemDTO } from '../types/cart';
import { cartApi } from '../api/cart.api';

interface CartState {
  // Estado
  items: CartItemDTO[];
  selected: Set<string>;
  loading: boolean;
  error?: string;

  // Acciones de carrito
  loadCart: () => Promise<void>;
  addToCart: (productId: string, qty?: number) => Promise<void>;
  updateQty: (itemId: string, qty: number) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;

  // Acciones de selección UI (no persisten en backend)
  toggle: (itemId: string) => void;
  selectAll: (flag: boolean) => void;
  clearSelection: () => void;

  // Derivados
  count: number;
  totalSelected: number;
}

export const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      items: [],
      selected: new Set<string>(),
      loading: false,
      error: undefined,

      // Acciones de carrito
      loadCart: async () => {
        set({ loading: true, error: undefined });
        try {
          const cart = await cartApi.getCart();
          set({ 
            items: cart.items,
            loading: false,
            error: undefined 
          });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to load cart' 
          });
        }
      },

      addToCart: async (productId: string, qty = 1) => {
        set({ loading: true, error: undefined });
        try {
          const cart = await cartApi.addItem({ productId, qty });
          set({ 
            items: cart.items,
            loading: false,
            error: undefined 
          });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to add item to cart' 
          });
        }
      },

      updateQty: async (itemId: string, qty: number) => {
        if (qty <= 0) {
          await get().remove(itemId);
          return;
        }

        set({ loading: true, error: undefined });
        try {
          const cart = await cartApi.updateItem(itemId, { qty });
          set({ 
            items: cart.items,
            loading: false,
            error: undefined 
          });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to update item quantity' 
          });
        }
      },

      remove: async (itemId: string) => {
        set({ loading: true, error: undefined });
        try {
          await cartApi.removeItem(itemId);
          const state = get();
          const newSelected = new Set(state.selected);
          newSelected.delete(itemId);
          
          set({ 
            items: state.items.filter(item => item.id !== itemId),
            selected: newSelected,
            loading: false,
            error: undefined 
          });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to remove item from cart' 
          });
        }
      },

      clear: async () => {
        set({ loading: true, error: undefined });
        try {
          await cartApi.clearCart();
          set({ 
            items: [],
            selected: new Set<string>(),
            loading: false,
            error: undefined 
          });
        } catch (error) {
          set({ 
            loading: false, 
            error: error instanceof Error ? error.message : 'Failed to clear cart' 
          });
        }
      },

      // Acciones de selección UI (no persisten en backend)
      toggle: (itemId: string) => {
        const state = get();
        const newSelected = new Set(state.selected);
        
        if (newSelected.has(itemId)) {
          newSelected.delete(itemId);
        } else {
          newSelected.add(itemId);
        }
        
        set({ selected: newSelected });
      },

      selectAll: (flag: boolean) => {
        const state = get();
        if (flag) {
          const allItemIds = new Set(state.items.map(item => item.id));
          set({ selected: allItemIds });
        } else {
          set({ selected: new Set<string>() });
        }
      },

      clearSelection: () => {
        set({ selected: new Set<string>() });
      },

      // Derivados (computed values)
      get count() {
        return get().items.reduce((total, item) => total + item.qty, 0);
      },

      get totalSelected() {
        const state = get();
        return state.items
          .filter(item => state.selected.has(item.id))
          .reduce((total, item) => total + (item.price * item.qty), 0);
      },
    }),
    {
      name: 'cart-store',
    }
  )
);
