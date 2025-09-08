import { useCartStore } from '../model/cart.store'
import { useAuthStore } from '@features/auth/model/auth.store'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const CartIcon = () => (
  <svg
    className="h-6 w-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a1 1 0 001 1h8a1 1 0 001-1v-6m-9 0h9"
    />
  </svg>
)

export function CartButton() {
  const navigate = useNavigate()
  const { accessToken } = useAuthStore()
  const cart = useCartStore(state => state.cart)
  const loadCart = useCartStore(state => state.loadCart)

  // Calculate count from cart items
  const count = cart?.items.reduce((sum, item) => sum + item.qty, 0) || 0

  // Load cart when authenticated
  useEffect(() => {
    if (accessToken) {
      loadCart()
    }
  }, [accessToken, loadCart])

  const handleClick = () => {
    navigate('/shopping_cart')
  }

  return (
    <button
      onClick={handleClick}
      className="relative p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
      aria-label={`Shopping cart with ${count} items`}
    >
      <CartIcon />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
