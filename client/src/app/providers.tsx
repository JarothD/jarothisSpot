import { PropsWithChildren } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@shared/api/queryClient'

export function Providers({ children }: Readonly<PropsWithChildren>) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
