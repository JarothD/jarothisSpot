export type OrderItemDTO = {
  productId: string
  title: string
  imageUrl: string
  unitPrice: number
  qty: number
  lineTotal: number
}

export type OrderDTO = {
  id: string
  createdAt: string
  status: 'PAID' | 'CANCELLED' | 'PENDING'
  total: number
  items: OrderItemDTO[]
}

export type PageResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
