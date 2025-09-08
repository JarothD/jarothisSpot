import { ProductDTO } from '@shared/types/catalog'
import { buildImage } from '@shared/utils/image'
import { useCartStore } from '@features/cart/model/cart.store'
import { useAuthStore } from '@features/auth/model/auth.store'
import { toast } from '@shared/store/toast.store'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

export function ProductCard({ p }: { readonly p: ProductDTO }) {
  const navigate = useNavigate()
  const imgUrl = buildImage(p.imageUrl, 400, 600)
  const { addToCart, loading } = useCartStore()
  const { accessToken } = useAuthStore()
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [authReady, setAuthReady] = useState(false)
  
  const isOutOfStock = p.stock !== undefined && p.stock === 0

  // Wait for auth to be ready
  useEffect(() => {
    const timer = setTimeout(() => setAuthReady(true), 200)
    return () => clearTimeout(timer)
  }, [])

  const getStoredToken = () => {
    try {
      const stored = localStorage.getItem('auth-store')
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.state?.accessToken || null
      }
    } catch {
      // Ignore errors
    }
    return null
  }

  const isAuthenticated = accessToken || getStoredToken()

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding || !authReady) return
    
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart')
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    setIsAdding(true)
    try {
      await addToCart({ productId: p.id, qty: 1 })
      
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 1000)
    } catch (error) {
      handleError(error)
    } finally {
      setIsAdding(false)
    }
  }

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
        case 403:
          toast.error('Session expired. Please log in again.')
          useAuthStore.getState().logout()
          navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
          break
        case 409:
          toast.error('Insufficient stock available')
          break
        case 422:
          toast.error('Product out of stock')
          break
        case 404:
          toast.error('Product not found')
          break
        default:
          toast.error('Failed to add to cart. Please try again.')
      }
    } else {
      toast.error('Failed to add to cart. Please try again.')
    }
  }

  const getButtonContent = () => {
    if (!authReady) return 'Loading...'
    if (isOutOfStock) return 'Out of Stock'
    if (showSuccess) {
      return (
        <span className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Added!
        </span>
      )
    }
    if (isAdding) return 'Adding...'
    return (
      <span className="flex items-center justify-center gap-2">
        <svg className="w-4 h-4 hover:animate-shake" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add to Cart
      </span>
    )
  }

  const getButtonStyles = () => {
    if (!authReady) return 'bg-neutral-400 text-white cursor-not-allowed'
    if (isOutOfStock) return 'bg-neutral-200 text-neutral-500 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-400'
    if (showSuccess) return 'bg-green-600 text-white'
    return 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  }

  return (
    <div className="rounded-2xl shadow p-3 bg-white dark:bg-neutral-900">
      <div className="aspect-[2/3] w-full overflow-hidden rounded-xl mb-3 bg-neutral-100 dark:bg-neutral-800">
        <img
          src={imgUrl}
          alt={p.title}
          width={400}
          height={600}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/placeholder-book.png'}}
        />
      </div>
      <h3 className="font-semibold line-clamp-2">{p.title}</h3>
      <p className="text-sm text-neutral-500 line-clamp-2">{p.description}</p>
      <div className="flex flex-wrap gap-2 my-2">
        {p.categories?.map(c=>(
          <span key={c.id} className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: c.colorHex }}>{c.name}</span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="font-semibold">${p.price.toFixed(2)}</div>
        {p.stock !== undefined && (
          <div className="text-xs text-neutral-500">
            Stock: {p.stock}
          </div>
        )}
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || isAdding || loading || !authReady}
        className={`w-full mt-3 px-4 py-2 rounded-lg font-medium text-sm transition-all hover:animate-shake ${getButtonStyles()}`}
      >
        {getButtonContent()}
      </button>
    </div>
  )
}
