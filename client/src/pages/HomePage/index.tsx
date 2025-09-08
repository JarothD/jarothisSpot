import { useQuery } from '@tanstack/react-query'
import { me } from '@features/auth/api/auth.api'
export function HomePage(){
  const { data } = useQuery({ queryKey: ['me'], queryFn: me })
  return <div className="p-6">Hola {data?.name ?? 'user'}</div>
}
