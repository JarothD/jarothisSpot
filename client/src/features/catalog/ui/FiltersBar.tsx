import { useCatalogStore } from '@shared/store/catalog.store'
import { ChangeEvent, useState } from 'react'

export function FiltersBar() {
  const { categories, filters, setFilters, loadProducts, clearFilters } = useCatalogStore()
  const [q, setQ] = useState(filters.q ?? '')
  const [showPriceRange, setShowPriceRange] = useState(false)
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() ?? '')
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() ?? '')

  const handleCategory = async (categoryId?: string) => {
    setFilters({ categoryId, page: 0 })
    await loadProducts({ categoryId, page: 0 })
  }
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    await loadProducts({ q, page: 0 })
  }

  const handlePriceRangeSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const min = minPrice ? parseFloat(minPrice) : undefined
    const max = maxPrice ? parseFloat(maxPrice) : undefined
    
    // Validate price range
    if (min !== undefined && max !== undefined && min > max) {
      alert('Minimum price cannot be greater than maximum price')
      return
    }
    
    setFilters({ minPrice: min, maxPrice: max, page: 0 })
    await loadProducts({ minPrice: min, maxPrice: max, page: 0 })
  }

  const clearAllFilters = async () => {
    setQ('')
    setMinPrice('')
    setMaxPrice('')
    setShowPriceRange(false)
    clearFilters()
    await loadProducts({ q: undefined, categoryId: undefined, minPrice: undefined, maxPrice: undefined, page: 0 })
  }

  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* Categories and Range Toggle */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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

          {/* Price Range Toggle */}
          <button
            onClick={() => setShowPriceRange(!showPriceRange)}
            className={`px-3 py-1 rounded-full border transition duration-150 ease-out transform-gpu btn-interactive hover:animate-shake
                        ${showPriceRange ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            Range
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            className="border rounded-lg px-3 py-1 w-64 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400" 
            placeholder="Search books..."
            value={q} 
            onChange={(e:ChangeEvent<HTMLInputElement>)=>setQ(e.target.value)} 
          />
          <button className="btn btn-interactive hover:animate-shake bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700" type="submit">
            Search
          </button>
          <button 
            type="button" 
            className="btn btn-interactive hover:animate-shake bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={clearAllFilters}
          >
            Reset
          </button>
        </form>
      </div>

      {/* Price Range Inputs */}
      {showPriceRange && (
        <div className="border-t pt-4">
          <form onSubmit={handlePriceRangeSearch} className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-white dark:text-white">Price Range:</span>
            
            <div className="flex items-center gap-2">
              <label htmlFor="minPrice" className="text-sm text-white dark:text-white">Min:</label>
              <input 
                id="minPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border rounded px-2 py-1 w-20 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="maxPrice" className="text-sm text-white dark:text-white">Max:</label>
              <input 
                id="maxPrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="999.00"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border rounded px-2 py-1 w-20 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            <button 
              type="submit"
              className="btn btn-interactive hover:animate-shake bg-blue-600 text-white border-blue-600 hover:bg-blue-700 px-4 py-1"
            >
              Apply Range
            </button>

            <button 
              type="button"
              onClick={() => {
                setMinPrice('')
                setMaxPrice('')
                setFilters({ minPrice: undefined, maxPrice: undefined, page: 0 })
                loadProducts({ minPrice: undefined, maxPrice: undefined, page: 0 })
              }}
              className="btn btn-interactive hover:animate-shake bg-gray-500 text-white border-gray-500 hover:bg-gray-600 px-3 py-1"
            >
              Clear Range
            </button>
          </form>

          {/* Current Range Display */}
          {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
            <div className="mt-2 text-sm text-blue-400">
              Active range: {filters.minPrice !== undefined ? `$${filters.minPrice}` : 'Any'} - {filters.maxPrice !== undefined ? `$${filters.maxPrice}` : 'Any'}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
