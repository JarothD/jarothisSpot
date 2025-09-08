import { http } from './http' // ya existente
import { PageResponse, ProductDTO, ProductFilters, CategoryDTO } from '@shared/types/catalog'

export const getCategories = () => http.get<CategoryDTO[]>('/categories')

export const getProducts = (filters: ProductFilters = {}, signal?: AbortSignal) => {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.categoryId) params.set('categoryId', filters.categoryId)
  if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice))
  params.set('page', String(filters.page ?? 0))
  params.set('size', String(filters.size ?? 12))
  if (filters.sort) params.set('sort', filters.sort)
  return http.get<PageResponse<ProductDTO>>(`/products?${params.toString()}`, { signal })
}
