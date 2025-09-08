import { useAuthStore } from '@features/auth/model/auth.store'
import { useEffect, useState } from 'react'

export function AuthDebugPanel() {
  const { accessToken } = useAuthStore()
  const [debugInfo, setDebugInfo] = useState<any>({})
  
  useEffect(() => {
    const updateDebugInfo = () => {
      const rawStorage = localStorage.getItem('auth-store')
      let parsedStorage = null
      try {
        parsedStorage = rawStorage ? JSON.parse(rawStorage) : null
      } catch (e) {
        // ignore
      }
      
      setDebugInfo({
        storeToken: accessToken,
        rawStorage,
        parsedStorage,
        timestamp: new Date().toISOString()
      })
    }
    
    updateDebugInfo()
    const interval = setInterval(updateDebugInfo, 1000)
    return () => clearInterval(interval)
  }, [accessToken])
  
  const testCartEndpoint = async () => {
    try {
      const { http } = await import('@shared/api/http')
      
      console.log('=== TESTING MULTIPLE CART ENDPOINTS ===')
      
      // Test GET /cart (we know this works)
      try {
        const cartResponse = await http.get('/cart')
        console.log('✅ GET /cart success:', cartResponse.data)
      } catch (error) {
        console.log('❌ GET /cart failed:', error)
      }
      
      // Test POST /cart/items (this is failing)
      try {
        const addResponse = await http.post('/cart/items', {
          productId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', // Valid UUID format
          qty: 1
        })
        console.log('✅ POST /cart/items success:', addResponse.data)
      } catch (error) {
        console.log('❌ POST /cart/items failed:', error)
      }
      
      // Test another authenticated endpoint (if we can find one)
      try {
        const authMeResponse = await http.get('/auth/me')
        console.log('✅ GET /auth/me success:', authMeResponse.data)
      } catch (error) {
        console.log('❌ GET /auth/me failed:', error)
      }
      
      alert('Cart tests completed! Check console for results.')
    } catch (error) {
      console.log('❌ Cart test setup failed:', error)
      alert(`Cart test failed: ${error}`)
    }
  }
  
  return (
    <div className="fixed top-0 right-0 bg-black text-white p-4 z-50 max-w-md text-xs">
      <h3 className="font-bold mb-2">Auth Debug Panel</h3>
      <div className="space-y-2">
        <div>
          <strong>Store Token:</strong> 
          <div className="break-all">{debugInfo.storeToken || 'null'}</div>
        </div>
        <div>
          <strong>Raw Storage:</strong>
          <div className="break-all">{debugInfo.rawStorage || 'null'}</div>
        </div>
        <div>
          <strong>Parsed Storage:</strong>
          <pre className="text-xs">{JSON.stringify(debugInfo.parsedStorage, null, 1)}</pre>
        </div>
        <button 
          onClick={testCartEndpoint}
          className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
        >
          Test Cart Endpoint
        </button>
        <div className="text-xs opacity-50">
          Last update: {debugInfo.timestamp}
        </div>
      </div>
    </div>
  )
}
