import { http } from '@shared/api/http'
import { CartDTO, AddCartItemRequest, UpdateCartItemRequest, CheckoutRequest } from '../types/cart'

export const cartApi = {
  // Get current user's cart
  getCart: async (): Promise<CartDTO> => {
    const { data } = await http.get<CartDTO>('/cart')
    return data
  },

  // Add item to cart
  addItem: async (request: AddCartItemRequest): Promise<CartDTO> => {
    const { data } = await http.post<CartDTO>('/cart/items', request)
    return data
  },

  // Update cart item quantity
  updateItem: async (itemId: string, request: UpdateCartItemRequest): Promise<CartDTO> => {
    const { data } = await http.patch<CartDTO>(`/cart/items/${itemId}`, request)
    return data
  },

  // Remove item from cart
  removeItem: async (itemId: string): Promise<void> => {
    await http.delete(`/cart/items/${itemId}`)
  },

  // Clear entire cart
  clearCart: async (): Promise<void> => {
    await http.delete('/cart')
  },

  // Checkout selected items
  checkout: async (request: CheckoutRequest): Promise<{ id: string; message?: string }> => {
    const { data } = await http.post<{ id: string; message?: string }>('/orders', request)
    return data
  }
}
