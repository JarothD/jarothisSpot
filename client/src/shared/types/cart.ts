export interface CartItemDTO {
  id: string;
  productId: string;
  title: string;
  imageUrl: string;
  price: number;
  qty: number;
}

export interface CartDTO {
  id: string;
  items: CartItemDTO[];
  subtotal: number;
}

export interface CheckoutRequest {
  itemIds: string[];
}
