export interface CartItemDTO {
  id: string
  productId: string
  title: string
  price: number
  qty: number
  imageUrl: string
}

export interface CartDTO {
  id: string
  items: CartItemDTO[]
  subtotal: number
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
