export function CartSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
      
      {/* Selection Controls Skeleton */}
      <div className="flex items-center justify-between mb-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          <div className="w-32 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
        </div>
        <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
      </div>

      {/* Cart Items Skeleton */}
      <div className="space-y-4 mb-6">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="border rounded-lg p-4 bg-white dark:bg-neutral-900">
            <div className="flex items-start gap-4">
              {/* Checkbox Skeleton */}
              <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mt-1"></div>
              
              {/* Item Details Skeleton */}
              <div className="flex-1">
                <div className="w-48 h-6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-2"></div>
                <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-3"></div>
                
                {/* Quantity Controls Skeleton */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                    <div className="w-8 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Subtotal and Remove Skeleton */}
              <div className="text-right">
                <div className="w-20 h-6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-2"></div>
                <div className="w-16 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary Skeleton */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="w-32 h-6 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
          <div className="w-20 h-4 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex gap-4 justify-end">
          <div className="w-32 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse"></div>
          <div className="w-40 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
