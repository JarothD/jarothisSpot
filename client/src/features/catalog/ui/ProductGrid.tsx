import { useCatalogStore } from '@shared/store/catalog.store'
import { ProductCard } from './ProductCard'
import { ProductSkeleton } from '@shared/ui/ProductSkeleton'
// import { AuthDebugPanel } from '@features/auth/ui/AuthDebugPanel'

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
      {/* <AuthDebugPanel /> */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
      <div className="flex items-center justify-center gap-2">
        <button disabled={page<=0} className="btn btn-interactive hover:animate-shake"
                onClick={()=>loadProducts({ page: page-1 })}>Prev</button>
        <span>Page {page+1} / {totalPages}</span>
        <button disabled={page+1>=totalPages} className="btn btn-interactive hover:animate-shake"
                onClick={()=>loadProducts({ page: page+1 })}>Next</button>
      </div>
    </div>
  )
}
