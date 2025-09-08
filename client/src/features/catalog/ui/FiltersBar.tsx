import { useCatalogStore } from '@shared/store/catalog.store'
import { ChangeEvent, useState } from 'react'

export function FiltersBar() {
  const { categories, filters, setFilters, loadProducts, clearFilters } = useCatalogStore()
  const [q, setQ] = useState(filters.q ?? '')

  const handleCategory = async (categoryId?: string) => {
    setFilters({ categoryId, page: 0 })
    await loadProducts({ categoryId, page: 0 })
  }
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await loadProducts({ q, page: 0 })
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
      <div className="flex flex-wrap gap-2">
        {/* ALL */}
        <button
          onClick={() => handleCategory()}
          aria-pressed={!filters.categoryId}
          className={`px-3 py-1 rounded-full border transition duration-150 ease-out transform-gpu
                      ${!filters.categoryId ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'btn-interactive hover:animate-shake bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          All
        </button>

        {categories.map(c => {
          const isSelected = filters.categoryId === c.id
          const base = "px-3 py-1 rounded-full border transition duration-150 ease-out transform-gpu"
          if (isSelected) {
            return (
              <button
                key={c.id}
                aria-pressed="true"
                className={base}
                style={{ backgroundColor: c.colorHex, color: '#fff', borderColor: c.colorHex, willChange: 'transform' }}
                onClick={() => handleCategory(c.id)}
              >
                {c.name}
              </button>
            )
          }
          return (
            <button
              key={c.id}
              aria-pressed="false"
              className={`${base} btn-interactive hover:animate-shake bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700`}
              style={{ borderColor: c.colorHex, color: c.colorHex, willChange: 'transform' }}
              onClick={() => handleCategory(c.id)}
            >
              {c.name}
            </button>
          )
        })}
      </div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input className="border rounded-lg px-3 py-1 w-64 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" 
               placeholder="Search books..."
               value={q} onChange={(e:ChangeEvent<HTMLInputElement>)=>setQ(e.target.value)} />
        <button className="btn btn-interactive hover:animate-shake bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700" type="submit">Search</button>
        <button type="button" className="btn btn-interactive hover:animate-shake bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                onClick={()=>{ clearFilters(); setQ(''); loadProducts({ q: undefined, categoryId: undefined, page: 0 }) }}>
          Reset
        </button>
      </form>
    </div>
  )
}
