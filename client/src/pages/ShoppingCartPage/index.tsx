import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '@features/cart/model/cart.store'
import { useAuthStore } from '@features/auth/model/auth.store'
import { toast } from '@shared/store/toast.store'
import { CartSkeleton } from '@shared/ui/CartSkeleton'

export function ShoppingCartPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuthStore()
  const cart = useCartStore(state => state.cart)
  const loading = useCartStore(state => state.loading)
  const selectedItemIds = useCartStore(state => state.selectedItemIds)
  const loadCart = useCartStore(state => state.loadCart)
  const updateQuantity = useCartStore(state => state.updateQuantity)
  const removeItem = useCartStore(state => state.removeItem)
  const toggleItemSelection = useCartStore(state => state.toggleItemSelection)
  const selectAllItems = useCartStore(state => state.selectAllItems)
  const clearSelection = useCartStore(state => state.clearSelection)
  const checkout = useCartStore(state => state.checkout)
  
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Calculate values from current state
  const selectedCount = selectedItemIds.size
  const totalSelected = cart?.items
    .filter(item => selectedItemIds.has(item.id))
    .reduce((sum, item) => sum + (item.price * item.qty), 0) || 0

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!accessToken) {
      navigate(`/login?redirect=${encodeURIComponent('/shopping_cart')}`)
      return
    }
    
    loadCart()
  }, [loadCart, accessToken, navigate])

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await updateQuantity(itemId, newQuantity)
    } catch (error) {
      console.error('Failed to update quantity:', error)
      
      // Handle stock conflict specifically
      if (error instanceof Error && error.message === 'INSUFFICIENT_STOCK') {
        toast.error('Insufficient stock - quantity restored to previous value')
      } else {
        toast.error('Failed to update quantity')
      }
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem(itemId)
      toast.success('Item removed from cart')
    } catch (error) {
      console.error('Failed to remove item:', error)
      toast.error('Failed to remove item')
    }
  }

  const handleCheckout = async () => {
    if (selectedCount === 0) {
      toast.warning('Please select items to checkout')
      return
    }

    setIsCheckingOut(true)
    try {
      await checkout()
      // Only clear selection and navigate on success (already handled in store)
      navigate('/')
      toast.success('Order created successfully!')
    } catch (error) {
      console.error('Checkout failed:', error)
      
      // Handle stock conflict specifically - don't clear selection
      if (error instanceof Error && error.message === 'INSUFFICIENT_STOCK') {
        toast.error('Insufficient stock for selected items')
      } else {
        toast.error('Failed to create order. Please try again.')
      }
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (loading) {
    return <CartSkeleton />
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
        <div className="text-center py-12">
          <p className="text-neutral-500 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-interactive hover:animate-shake bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
      
      {/* Selection Controls */}
      <div className="flex items-center justify-between mb-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCount === cart.items.length && cart.items.length > 0}
              onChange={(e) => e.target.checked ? selectAllItems() : clearSelection()}
              className="rounded"
            />
            <span className="text-sm font-medium">
              Select All ({selectedCount}/{cart.items.length})
            </span>
          </label>
        </div>
        
        {selectedCount > 0 && (
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Selected total: <span className="font-semibold">${totalSelected.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-6">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className={`
              border rounded-lg p-4 transition-all
              ${selectedItemIds.has(item.id) 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'
              }
            `}
          >
            <div className="flex items-start gap-4">
              {/* Selection Checkbox */}
              <input
                type="checkbox"
                checked={selectedItemIds.has(item.id)}
                onChange={() => toggleItemSelection(item.id)}
                className="mt-1 rounded"
              />
              
              {/* Item Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400">${item.price?.toFixed(2) || '0.00'} each</p>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-sm">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                      disabled={item.qty <= 1}
                      className="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed hover:animate-shake"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{item.qty}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                      className="w-8 h-8 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:animate-shake"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Subtotal and Remove */}
              <div className="text-right">
                <div className="font-semibold text-lg mb-2">${((item.price || 0) * (item.qty || 0)).toFixed(2)}</div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg">
            <span className="text-neutral-600 dark:text-neutral-400">Cart Total: </span>
            <span className="font-semibold">${cart.subtotal?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="text-sm text-neutral-500">
            {cart.items.reduce((sum, item) => sum + item.qty, 0)} {cart.items.reduce((sum, item) => sum + item.qty, 0) === 1 ? 'item' : 'items'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => navigate('/')}
            className="btn btn-interactive hover:animate-shake px-6 py-3 border border-neutral-300 dark:border-neutral-600"
          >
            Continue Shopping
          </button>
          
          <button
            onClick={handleCheckout}
            disabled={selectedCount === 0 || isCheckingOut}
            className={`
              px-8 py-3 rounded-lg font-semibold transition-all
              ${selectedCount > 0 && !isCheckingOut
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-neutral-200 text-neutral-500 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-400'
              }
            `}
          >
            {isCheckingOut ? 'Processing...' : `Checkout (${selectedCount} items)`}
          </button>
        </div>
      </div>
    </div>
  )
}
