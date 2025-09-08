import { http } from './http'
import { OrderDTO, PageResponse } from '@shared/types/order'

export const getMyOrders = (page = 0, size = 10) => 
  http.get<PageResponse<OrderDTO>>(`/orders?page=${page}&size=${size}`)

export const getOrderById = (id: string) => 
  http.get<OrderDTO>(`/orders/${id}`)
