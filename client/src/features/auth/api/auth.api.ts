import { http } from '@shared/api/http'

export type RegisterRequest = { email: string; phone: string; password: string; confirmPassword: string }
export type RegisterResponse = { id: string; email: string; phone: string; message: string }

export const register = (data: RegisterRequest) => http.post<RegisterResponse>('/auth/register', data)

export async function login(email: string, password: string) {
  const { data } = await http.post<{ accessToken: string }>('/auth/login', { email, password })
  return data.accessToken
}
export async function me() {
  const { data } = await http.get('/auth/me')
  return data
}
export async function refresh() {
  const { data } = await http.post<{ accessToken: string }>('/auth/refresh') // usa cookie HttpOnly
  return data.accessToken
}
export async function logout() {
  await http.post('/auth/logout') // invalida refresh en server
}
