import axios, { AxiosError } from 'axios'
import { ENV } from '@shared/config/env'
import { useAuthStore } from '@features/auth/model/auth.store'

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
  timeout: 10000
})

let isRefreshing = false
let queue: Array<() => void> = []

http.interceptors.request.use((config) => {
  // Try to get token from store first
  let token = useAuthStore.getState().accessToken
  
  // If not in store, try localStorage as fallback
  if (!token) {
    try {
      const stored = localStorage.getItem('auth-store')
      if (stored) {
        const parsed = JSON.parse(stored)
        token = parsed.state?.accessToken || null
      }
    } catch {
      // Ignore localStorage errors
    }
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
}, (error: AxiosError) => {
  console.log('❌ Request interceptor error:', error)
  return Promise.reject(error)
})

http.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    // Only log non-health check errors
    if (!error.config?.url?.includes('actuator/health')) {
      console.log('❌ HTTP Error:', error.response?.status, error.config?.url)
    }
    
    const original = error.config
    if (!original) return Promise.reject(error)

    // Handle 401 (Unauthorized) - try to refresh token
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Wait for the refresh to complete
        await new Promise<void>((resolve) => queue.push(resolve))
        return http(original)
      }

      original._retry = true
      isRefreshing = true

      try {
        console.log('🔄 Attempting token refresh...')
        const { refresh } = await import('@features/auth/api/auth.api')
        const newToken = await refresh()
        useAuthStore.getState().setAccessToken(newToken)
        console.log('✅ Token refreshed successfully')
        
        // Resolve all queued requests
        queue.forEach((resolve) => resolve())
        queue = []
        
        // Retry the original request with new token
        return http(original)
      } catch {
        console.log('❌ Token refresh failed, logging out')
        // If refresh fails, logout and redirect to login
        useAuthStore.getState().logout()
        queue.forEach((resolve) => resolve())
        queue = []
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    // Handle 403 (Forbidden) - usually means invalid token
    if (error.response?.status === 403) {
      console.log('❌ 403 Forbidden - Token may be invalid')
      // Clear the token and force re-login
      useAuthStore.getState().logout()
    }

    return Promise.reject(error)
  }
)
// Note: We add a Type Mark to AxiosRequestConfig
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean
  }
}
