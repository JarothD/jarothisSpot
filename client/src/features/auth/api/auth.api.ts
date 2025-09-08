import { http } from '@shared/api/http'

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
