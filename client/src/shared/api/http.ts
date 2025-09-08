import axios, { AxiosError } from 'axios'
import { ENV } from '@shared/config/env'
import { useAuthStore } from '@features/auth/model/auth.store'

export const http = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true 
})

let isRefreshing = false
let queue: Array<() => void> = []

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config
    if (!original) throw error

    // If expires (401) and is not refresing, try to refresh
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        await new Promise<void>((res) => queue.push(res))
        return http(original)
      }
      original._retry = true
      try {
        isRefreshing = true
        const { refresh } = await import('@features/auth/api/auth.api')
        const newToken = await refresh()
        useAuthStore.getState().setAccessToken(newToken)
        queue.forEach((fn) => fn())
        queue = []
        return http(original)
      } catch (e) {
        useAuthStore.getState().logout()
        throw e
      } finally {
        isRefreshing = false
      }
    }
    throw error
  }
)
// Note: We add a Type Mark to AxiosRequestConfig
declare module 'axios' {
  export interface AxiosRequestConfig {
    _retry?: boolean
  }
}
