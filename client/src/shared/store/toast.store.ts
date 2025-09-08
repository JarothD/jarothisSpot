import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 11)
    const newToast = { ...toast, id }
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }))
    
    // Auto remove after duration (default 5s)
    setTimeout(() => {
      get().removeToast(id)
    }, toast.duration || 5000)
  },
  
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }))
  },
  
  clearToasts: () => {
    set({ toasts: [] })
  }
}))

// Helper functions
export const toast = {
  success: (message: string, duration?: number) => 
    useToastStore.getState().addToast({ type: 'success', message, duration }),
  
  error: (message: string, duration?: number) => 
    useToastStore.getState().addToast({ type: 'error', message, duration }),
  
  info: (message: string, duration?: number) => 
    useToastStore.getState().addToast({ type: 'info', message, duration }),
  
  warning: (message: string, duration?: number) => 
    useToastStore.getState().addToast({ type: 'warning', message, duration })
}
