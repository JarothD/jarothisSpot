import { createBrowserRouter } from 'react-router-dom'
import { HomePage } from '@pages/HomePage'
import { LoginPage } from '@pages/LoginPage'
import { RegisterForm } from '@features/auth/ui/RegisterForm'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage/> },
  { path: '/login', element: <LoginPage/> },
  { path: '/register', element: <RegisterForm/> }
])