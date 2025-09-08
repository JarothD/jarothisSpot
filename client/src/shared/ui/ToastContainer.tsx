import { useToastStore, ToastType } from '@shared/store/toast.store'

interface ToastProps {
  readonly id: string
  readonly type: ToastType
  readonly message: string
  readonly onClose: (id: string) => void
}

function Toast({ id, type, message, onClose }: Readonly<ToastProps>) {
  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  return (
    <div className={`rounded-md border p-3 text-sm transition-all ${getToastStyles()}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button
          onClick={() => onClose(id)}
          className="ml-2 text-lg font-bold opacity-70 hover:opacity-100"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}
