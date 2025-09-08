import { useCatalogStore } from '@shared/store/catalog.store'
import { ProductCard } from './ProductCard'
import { ProductSkeleton } from '@shared/ui/ProductSkeleton'

export function ProductGrid() {
  const { products, totalPages, page, loadProducts, loading } = useCatalogStore()
  
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({length: 8}, (_, i) => `skeleton-${Date.now()}-${i}`).map(key=><ProductSkeleton key={key} />)}
      </div>
    )
  }
  
  if (!products.length) return <div className="py-10 text-center">No books found.</div>
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
      <div className="flex items-center justify-center gap-2">
        <button disabled={page<=0} className="btn btn-interactive hover:animate-shake bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold px-4 py-2"
                onClick={()=>loadProducts({ page: page-1 })}>Prev</button>
        <span className="text-white dark:text-white font-medium px-3">Page {page+1} / {totalPages}</span>
        <button disabled={page+1>=totalPages} className="btn btn-interactive hover:animate-shake bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold px-4 py-2"
                onClick={()=>loadProducts({ page: page+1 })}>Next</button>
      </div>
    </div>
  )
}
