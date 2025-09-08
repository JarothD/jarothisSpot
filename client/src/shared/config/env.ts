const apiBase = import.meta.env.VITE_API_BASE_URL
if (!apiBase) throw new Error('VITE_API_BASE_URL no está definido')
export const ENV = { API_BASE_URL: apiBase }
