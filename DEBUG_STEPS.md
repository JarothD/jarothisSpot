# DEBUGGING CART ISSUE - PASO A PASO

## 🔧 DIAGNÓSTICO ACTUALIZADO

Con los logs y panel de debug añadidos, ahora puedes hacer lo siguiente:

### 1. **Abre la aplicación en el navegador**
- Ve a `http://localhost` (puerto 80)
- Verás un panel negro en la esquina superior derecha con información de debug

### 2. **Haz login si no estás logueado**
- Ve a la página de login
- Inicia sesión con un usuario válido
- Regresa a la página de productos

### 3. **Revisa el panel de debug**
El panel debería mostrar:
- **Store Token**: El token desde el store de Zustand
- **Raw Storage**: El contenido crudo del localStorage
- **Parsed Storage**: El objeto parseado del localStorage

### 4. **Prueba el endpoint de cart directamente**
- Haz clic en el botón "Test Cart Endpoint" en el panel de debug
- Esto probará directamente la conectividad con `/api/cart`

### 5. **Revisa la consola del navegador**
Cuando hagas clic en "Add to Cart", deberías ver logs detallados:
- `=== ADD TO CART DEBUG ===` con información de autenticación
- `=== HTTP REQUEST DEBUG ===` con información de la request HTTP
- Respuesta HTTP o errores

### 6. **Información clave a buscar:**

#### ✅ **Si todo está bien:**
- Store Token: `eyJ...` (token válido)
- HTTP Request muestra "✅ Authorization header set"
- Cart test endpoint funciona

#### ❌ **Si hay problemas:**
- Store Token: `null` o vacío
- HTTP Request muestra "❌ No token available"
- Cart test endpoint falla con 403

### 7. **Posibles problemas y soluciones:**

#### **Problema 1: Token no se guarda**
- El login no está guardando el token correctamente
- **Solución**: Revisar el flujo de login

#### **Problema 2: Token inválido**
- El token existe pero el servidor lo rechaza
- **Solución**: Verificar formato del token y configuración del servidor

#### **Problema 3: CORS o configuración del servidor**
- El servidor rechaza requests del cliente
- **Solución**: Revisar configuración de CORS y Spring Security

## 🚀 **SIGUIENTE PASO**

1. Haz estas pruebas y reporta qué ves en:
   - El panel de debug
   - La consola del navegador
   - El resultado del "Test Cart Endpoint"

2. Con esa información podremos identificar exactamente dónde está el problema.

## 🔍 **COMANDOS DE DEBUG ADICIONALES**

También puedes usar estas funciones desde la consola del navegador:
- `debugAuth()` - Información detallada de autenticación
- `testCartRequest()` - Prueba directa del endpoint de cart
