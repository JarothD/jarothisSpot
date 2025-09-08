export type UUID = string
export type ProductType = 'BOOK'
export type CategoryType = 'GENRE_BOOK'

export type CategoryDTO = {
  id: UUID
  name: string
  type: CategoryType
  colorHex: string
}

export type ProductDTO = {
  id: UUID
  productType: ProductType
  title: string
  description: string
  price: number
  imageUrl: string
  active: boolean
  categories: CategoryDTO[]
  stock?: number
}

export type PageResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export type ProductFilters = {
  q?: string
  categoryId?: UUID
  minPrice?: number
  maxPrice?: number
  page?: number
  size?: number
  sort?: string
}
