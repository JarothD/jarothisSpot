// ProductSkeleton.tsx
export function ProductSkeleton() {
  return (
    <div className="rounded-2xl p-3 animate-pulse bg-white dark:bg-neutral-900">
      <div className="aspect-[2/3] w-full rounded-xl bg-neutral-200 dark:bg-neutral-800 mb-3"></div>
      <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded mb-2"></div>
      <div className="h-3 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded mb-4"></div>
      <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
    </div>
  )
}
