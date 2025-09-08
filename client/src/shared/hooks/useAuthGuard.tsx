import { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@features/auth/model/auth.store'

type FromState = { from?: { pathname?: string } }
const isFromState = (v: unknown): v is FromState =>
  typeof v === 'object' && v !== null && 'from' in (v as Record<string, unknown>)

export function Protected({ children }: Readonly<PropsWithChildren>) {
  const token = useAuthStore((s) => s.accessToken)
  const loc = useLocation()
  const fromPath = isFromState(loc.state) && loc.state.from?.pathname ? loc.state.from.pathname : '/'

  if (!token) {
    return <Navigate to="/login" replace state={{ from: { pathname: fromPath } }} />
  }
  return <>{children}</>
}
