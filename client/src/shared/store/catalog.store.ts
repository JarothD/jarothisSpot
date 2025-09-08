import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CategoryDTO, PageResponse, ProductDTO, ProductFilters } from '@shared/types/catalog'
import { getCategories, getProducts } from '@shared/api/catalog.api'

type CatalogState = {
  categories: CategoryDTO[]
  products: ProductDTO[]
  page: number
  size: number
  totalPages: number
  totalElements: number
  loading: boolean
  error?: string
  filters: ProductFilters
  currentAbort?: AbortController
  loadCategories: () => Promise<void>
  loadProducts: (next?: Partial<ProductFilters>) => Promise<void>
  setFilters: (next: Partial<ProductFilters>) => void
  clearFilters: () => void
}

export const useCatalogStore = create<CatalogState>()(persist((set, get) => ({
  categories: [],
  products: [],
  page: 0,
  size: 12,
  totalPages: 0,
  totalElements: 0,
  loading: false,
  filters: { page: 0, size: 12 },

  setFilters: (next) => set((s) => ({ filters: { ...s.filters, ...next } })),
  clearFilters: () => set({ filters: { page: 0, size: 12 } }),

  loadCategories: async () => {
    set({ loading: true, error: undefined })
    try {
      const { data } = await getCategories()
      set({ categories: data })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed loading categories'
      set({ error: message })
    } finally {
      set({ loading: false })
    }
  },

  loadProducts: async (next) => {
    const ctrl = new AbortController()
    const prev = get().currentAbort
    if (prev) prev.abort()
    set({ loading: true, error: undefined, currentAbort: ctrl })
    try {
      if (next) set((s) => ({ filters: { ...s.filters, ...next } }))
      const { filters } = get()
      const { data } = await getProducts(filters, ctrl.signal)
      const page: PageResponse<ProductDTO> = data
      set({
        products: page.content,
        page: page.number,
        size: page.size,
        totalPages: page.totalPages,
        totalElements: page.totalElements,
      })
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') {
        // Request was aborted, don't set error
        return
      }
      const message = e instanceof Error ? e.message : 'Failed loading products'
      set({ error: message })
    } finally {
      set({ loading: false })
    }
  },
}), {
  name: 'catalog-v2', // Changed version to reset cache
  partialize: (s) => ({
    categories: s.categories,
    products: s.products,
    page: s.page,
    size: s.size,
    totalPages: s.totalPages,
    totalElements: s.totalElements,
    filters: s.filters
  }),
  storage: { 
    getItem: (k) => {
      const item = sessionStorage.getItem(k)
      return item ? JSON.parse(item) : null
    }, 
    setItem: (k, v) => sessionStorage.setItem(k, JSON.stringify(v)), 
    removeItem: (k) => sessionStorage.removeItem(k) 
  }
}))
