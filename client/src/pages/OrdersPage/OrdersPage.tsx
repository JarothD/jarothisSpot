import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@features/auth/model/auth.store'
import { getMyOrders } from '@shared/api/orders.api'
import { OrderDTO } from '@shared/types/order'
import { buildImage } from '@shared/utils/image'

// Helper function for formatting money
const money = (n: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(n)

// Helper function for formatting date
const formatDate = (dateString: string) => new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}).format(new Date(dateString))

// Helper function for status pill styles
const getStatusStyles = (status: OrderDTO['status']) => {
  switch (status) {
    case 'PAID':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'PENDING':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Loading skeleton component
function OrderSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
          <div className="w-32 h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
        </div>
        <div className="text-right">
          <div className="w-16 h-5 bg-neutral-200 dark:bg-neutral-700 rounded mb-2"></div>
          <div className="w-20 h-6 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
        </div>
      </div>
      <div className="w-24 h-9 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
    </div>
  )
}

export function OrdersPage() {
  const navigate = useNavigate()
  const { accessToken } = useAuthStore()
  
  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (id: string) => setExpanded(s => {
    const n = new Set(s)
    if (n.has(id)) {
      n.delete(id)
    } else {
      n.add(id)
    }
    return n
  })

  useEffect(() => {
    // Redirect if not authenticated
    if (!accessToken) {
      navigate('/login?redirect=/orders')
      return
    }

    const ctrl = new AbortController()
    const run = async () => {
      try {
        setLoading(true)
        setError(undefined)
        const { data } = await getMyOrders(page, size)
        setOrders(data.content)
        setTotalPages(data.totalPages)
      } catch (e: unknown) {
        const error = e as { name?: string; message?: string }
        if (error.name !== 'CanceledError') {
          setError(error?.message || 'Failed to load orders')
        }
      } finally {
        setLoading(false)
      }
    }
    run()
    return () => ctrl.abort()
  }, [page, size, accessToken, navigate])

  // Don't render anything while checking auth
  if (!accessToken) {
    return null
  }

  if (loading && orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6 text-white dark:text-white">My Orders</h1>
        <div className="grid gap-4 md:gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6 text-white dark:text-white">My Orders</h1>
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => setPage(0)}
            className="btn btn-interactive hover:animate-shake bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6 text-white dark:text-white">My Orders</h1>
        <div className="text-center py-12">
          <p className="text-neutral-300 mb-4">No orders found</p>
          <button
            onClick={() => navigate('/')}
            className="btn btn-interactive hover:animate-shake bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6 text-white dark:text-white">My Orders</h1>
      
      {/* Orders List */}
      <div className="grid gap-4 md:gap-6 mb-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 md:p-6"
          >
            {/* Order Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
              <div className="mb-4 md:mb-0">
                <h3 className="font-semibold text-lg text-white dark:text-white">
                  #{order.id.slice(0, 8)}
                </h3>
                <p className="text-neutral-300 dark:text-neutral-300">
                  {formatDate(order.createdAt)}
                </p>
              </div>
              
              <div className="flex flex-col md:items-end gap-2">
                <span className={`
                  inline-flex px-3 py-1 rounded-full text-xs font-medium border
                  ${getStatusStyles(order.status)}
                `}>
                  {order.status}
                </span>
                <p className="font-semibold text-xl text-white dark:text-white">
                  {money(order.total)}
                </p>
              </div>
            </div>

            {/* Details Button */}
            <button
              onClick={() => toggle(order.id)}
              aria-expanded={expanded.has(order.id)}
              className="btn btn-interactive hover:animate-shake border border-neutral-300 dark:border-neutral-600 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              {expanded.has(order.id) ? 'Hide Details' : 'Show Details'}
            </button>

            {/* Order Items (Expandable) */}
            {expanded.has(order.id) && (
              <div className="mt-6 border-t border-neutral-200 dark:border-neutral-700 pt-6">
                <h4 className="font-medium mb-4 text-white dark:text-white">Order Items</h4>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={`${item.productId}-${index}`}
                      className="flex items-center gap-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                    >
                      {/* Product Image */}
                      <img
                        src={item.imageUrl ? buildImage(item.imageUrl, 64, 96) : '/placeholder-book.svg'}
                        alt={item.title}
                        width={64}
                        height={96}
                        loading="lazy"
                        decoding="async"
                        className="w-16 h-24 object-cover rounded bg-neutral-200 dark:bg-neutral-700"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/placeholder-book.svg'
                        }}
                      />
                      
                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium line-clamp-2 mb-1 text-white dark:text-white">
                          {item.title}
                        </h5>
                        <p className="text-sm text-neutral-300 dark:text-neutral-300">
                          {item.qty} × {money(item.unitPrice)} = {money(item.lineTotal)}
                        </p>
                      </div>
                      
                      {/* Line Total */}
                      <div className="text-right">
                        <p className="font-semibold text-white dark:text-white">
                          {money(item.lineTotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            disabled={page <= 0 || loading}
            onClick={() => setPage(page - 1)}
            className="btn btn-interactive hover:animate-shake disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Prev
          </button>
          
          <span className="text-sm text-neutral-300 dark:text-neutral-300">
            Page {page + 1} of {totalPages}
          </span>
          
          <button
            disabled={page + 1 >= totalPages || loading}
            onClick={() => setPage(page + 1)}
            className="btn btn-interactive hover:animate-shake disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
