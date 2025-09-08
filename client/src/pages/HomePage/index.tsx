import { useEffect } from 'react'
import { useCatalogStore } from '@shared/store/catalog.store'
import { FiltersBar } from '@features/catalog/ui/FiltersBar'
import { ProductGrid } from '@features/catalog/ui/ProductGrid'

export function HomePage() {
  const { categories, products, loadCategories, loadProducts } = useCatalogStore()
  useEffect(()=>{ // inicial
    // Solo cargar si no hay datos en persistencia
    if (categories.length === 0) {
      loadCategories()
    }
    if (products.length === 0) {
      loadProducts({ page: 0 })
    }
  }, [categories.length, products.length, loadCategories, loadProducts])
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Books</h1>
      <FiltersBar />
      <ProductGrid />
    </div>
  )
}
