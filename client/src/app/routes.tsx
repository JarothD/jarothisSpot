import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@pages/HomePage'
import { LoginPage } from '@pages/LoginPage'
import { Protected } from '@shared/hooks/useAuthGuard'

export const router = createBrowserRouter([
  { path: '/', element: <Protected><HomePage/></Protected> },
  { path: '/login', element: <LoginPage/> }
])