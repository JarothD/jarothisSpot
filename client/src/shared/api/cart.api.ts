import { http } from './http';
import { CartDTO, CheckoutRequest } from '../types/cart';

// OrderDTO interface for checkout response
export interface OrderDTO {
  id: string;
  totalAmount: number;
  status: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    priceAtPurchase: number;
  }>;
}

export interface AddCartItemRequest {
  productId: string;
  qty: number;
}

export interface UpdateCartItemRequest {
  qty: number;
}

export const cartApi = {
  // GET /api/cart
  getCart: async (): Promise<CartDTO> => {
    const response = await http.get<CartDTO>('/api/cart');
    return response.data;
  },

  // POST /api/cart/items
  addItem: async (request: AddCartItemRequest): Promise<CartDTO> => {
    const response = await http.post<CartDTO>('/api/cart/items', request);
    return response.data;
  },

  // PATCH /api/cart/items/{itemId}
  updateItem: async (itemId: string, request: UpdateCartItemRequest): Promise<CartDTO> => {
    const response = await http.patch<CartDTO>(`/api/cart/items/${itemId}`, request);
    return response.data;
  },

  // DELETE /api/cart/items/{itemId}
  removeItem: async (itemId: string): Promise<void> => {
    await http.delete(`/api/cart/items/${itemId}`);
  },

  // DELETE /api/cart
  clearCart: async (): Promise<void> => {
    await http.delete('/api/cart');
  },

  // POST /api/orders
  checkout: async (body: CheckoutRequest): Promise<OrderDTO> => {
    const response = await http.post<OrderDTO>('/api/orders', body);
    return response.data;
  },
};
