export interface CartItemDTO {
  id: string
  productId: string
  productTitle: string
  productPrice: number
  quantity: number
  subtotal: number
}

export interface CartDTO {
  id: string
  userId: string
  items: CartItemDTO[]
  total: number
  itemCount: number
}

export interface AddCartItemRequest {
  productId: string
  qty: number
}

export interface UpdateCartItemRequest {
  qty: number
}

export interface CheckoutRequest {
  itemIds: string[]
}
