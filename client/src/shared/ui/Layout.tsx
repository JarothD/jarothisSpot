import { Outlet, Link } from 'react-router-dom'
import { CartButton } from '@features/cart/ui/CartButton'
import { useAuthStore } from '@features/auth/model/auth.store'
import { useCartStore } from '@features/cart/model/cart.store'
import { ToastContainer } from './ToastContainer'

export function Layout() {
  const { accessToken, logout } = useAuthStore()
  const { resetCart } = useCartStore()

  const handleLogout = () => {
    logout()
    resetCart()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Header/Navbar */}
      <header className="border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link to="/" className="text-xl font-bold text-black dark:text-white hover:opacity-80 transition-opacity">
              Jarothi's Spot
            </Link>
            
            {/* Navigation Actions */}
            <div className="flex items-center gap-4">
              <CartButton />
              
              {/* Orders link for authenticated users */}
              {accessToken && (
                <Link 
                  to="/orders" 
                  className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors text-sm"
                >
                  My Orders
                </Link>
              )}
              
              {/* Auth Links */}
              <div className="flex items-center gap-2 text-sm">
                {accessToken ? (
                  <button
                    onClick={handleLogout}
                    className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
                  >
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
                    >
                      Sign In
                    </Link>
                    <span className="text-neutral-300 dark:text-neutral-600">|</span>
                    <Link 
                      to="/register" 
                      className="text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main>
        <Outlet />
      </main>
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  )
}
