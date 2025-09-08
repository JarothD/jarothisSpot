import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '@shared/ui/Layout'
import { HomePage } from '@pages/HomePage'
import { LoginPage } from '@pages/LoginPage'
import { ShoppingCartPage } from '@pages/ShoppingCartPage'
import { OrdersPage } from '@pages/OrdersPage'
import { RegisterForm } from '@features/auth/ui/RegisterForm'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shopping_cart', element: <ShoppingCartPage /> },
      { path: 'orders', element: <OrdersPage /> },
    ]
  },
  { path: '/login', element: <LoginPage/> },
  { path: '/register', element: <RegisterForm/> }
])