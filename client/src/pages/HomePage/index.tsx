import { useEffect } from 'react'
import { useCatalogStore } from '@shared/store/catalog.store'
import { FiltersBar } from '@features/catalog/ui/FiltersBar'
import { ProductGrid } from '@features/catalog/ui/ProductGrid'

export function HomePage() {
  const { loadCategories, loadProducts } = useCatalogStore()
  useEffect(()=>{ // inicial
    // Forzar carga de datos frescos
    loadCategories()
    loadProducts({ page: 0 })
  }, [loadCategories, loadProducts])
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4 text-white dark:text-white">Books</h1>
      <FiltersBar />
      <ProductGrid />
    </div>
  )
}
