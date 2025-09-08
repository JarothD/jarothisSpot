import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import { cartApi } from '../api/cart.api'
import { CartDTO, AddCartItemRequest } from '../types/cart'

interface CartState {
  cart: CartDTO | null
  selectedItemIds: Set<string>
  loading: boolean
  
  // Actions
  loadCart: () => Promise<void>
  addToCart: (request: AddCartItemRequest) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  resetCart: () => void
  checkout: () => Promise<string> // returns orderId
  
  // Selection for checkout
  toggleItemSelection: (itemId: string) => void
  selectAllItems: () => void
  clearSelection: () => void
  
  // Computed values
  count: number
  totalSelected: number
  selectedCount: number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      selectedItemIds: new Set(),
      loading: false,
      
      loadCart: async () => {
        try {
          set({ loading: true })
          const cart = await cartApi.getCart()
          set({ cart, loading: false })
        } catch (error) {
          console.error('Failed to load cart:', error)
          set({ loading: false })
        }
      },
      
      addToCart: async (request: AddCartItemRequest) => {
        try {
          set({ loading: true })
          const cart = await cartApi.addItem(request)
          set({ cart, loading: false })
        } catch (error) {
          console.error('Failed to add to cart:', error)
          set({ loading: false })
          
          // Check for stock conflicts (409 or 422)
          if (axios.isAxiosError(error) && (error.response?.status === 409 || error.response?.status === 422)) {
            throw new Error('INSUFFICIENT_STOCK')
          }
          throw error
        }
      },
      
      updateQuantity: async (itemId: string, quantity: number) => {
        try {
          const cart = await cartApi.updateItem(itemId, { qty: quantity })
          set({ cart })
        } catch (error) {
          console.error('Failed to update cart item:', error)
          
          // Check for stock conflicts (409 or 422) and restore previous quantity
          if (axios.isAxiosError(error) && (error.response?.status === 409 || error.response?.status === 422)) {
            // Restore the cart state by reloading
            await get().loadCart()
            throw new Error('INSUFFICIENT_STOCK')
          }
          throw error
        }
      },
      
      removeItem: async (itemId: string) => {
        try {
          await cartApi.removeItem(itemId)
          const state = get()
          const newSelection = new Set(state.selectedItemIds)
          newSelection.delete(itemId)
          set({ selectedItemIds: newSelection })
          // Reload cart to get updated state
          await get().loadCart()
        } catch (error) {
          console.error('Failed to remove cart item:', error)
          throw error
        }
      },
      
      clearCart: async () => {
        try {
          await cartApi.clearCart()
          set({ cart: null, selectedItemIds: new Set() })
        } catch (error) {
          console.error('Failed to clear cart:', error)
          throw error
        }
      },
      
      // Reset cart state (useful for logout)
      resetCart: () => {
        set({ cart: null, selectedItemIds: new Set(), loading: false })
      },
      
      checkout: async () => {
        const { selectedItemIds } = get()
        if (selectedItemIds.size === 0) {
          throw new Error('No items selected for checkout')
        }
        
        try {
          const result = await cartApi.checkout({ 
            itemIds: Array.from(selectedItemIds) 
          })
          
          // Remove checked out items from cart and clear selection only on success
          await get().loadCart()
          set({ selectedItemIds: new Set() })
          
          return result.id
        } catch (error) {
          console.error('Failed to checkout:', error)
          
          // Check for stock conflicts (409 or 422) - don't clear selection
          if (axios.isAxiosError(error) && (error.response?.status === 409 || error.response?.status === 422)) {
            // Reload cart to get updated state but keep selection
            await get().loadCart()
            throw new Error('INSUFFICIENT_STOCK')
          }
          throw error
        }
      },
      
      toggleItemSelection: (itemId: string) => {
        const state = get()
        const newSelection = new Set(state.selectedItemIds)
        if (newSelection.has(itemId)) {
          newSelection.delete(itemId)
        } else {
          newSelection.add(itemId)
        }
        set({ selectedItemIds: newSelection })
      },
      
      selectAllItems: () => {
        const { cart } = get()
        if (cart) {
          const allItemIds = new Set(cart.items.map(item => item.id))
          set({ selectedItemIds: allItemIds })
        }
      },
      
      clearSelection: () => {
        set({ selectedItemIds: new Set() })
      },
      
      // Computed values
      get count() {
        return get().cart?.itemCount || 0
      },
      
      get totalSelected() {
        const { cart, selectedItemIds } = get()
        if (!cart) return 0
        
        return cart.items
          .filter(item => selectedItemIds.has(item.id))
          .reduce((sum, item) => sum + item.subtotal, 0)
      },
      
      get selectedCount() {
        return get().selectedItemIds.size
      }
    }),
    {
      name: 'cart-store',
      partialize: (state) => ({ 
        selectedItemIds: Array.from(state.selectedItemIds) 
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.selectedItemIds)) {
          state.selectedItemIds = new Set(state.selectedItemIds)
        }
      }
    }
  )
)
