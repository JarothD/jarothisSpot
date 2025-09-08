/**
 * Construye una URL optimizada usando un proxy de imágenes (como images.weserv.nl)
 * 
 * @param url - URL original de la imagen
 * @param w - Ancho deseado en píxeles (default: 400)
 * @param h - Alto deseado en píxeles (default: 600)
 * @returns URL optimizada o URL original si no hay proxy configurado
 */
export function buildImage(url: string, w=400, h=600) {
  const base = import.meta.env.VITE_IMG_PROXY_BASE // e.g. https://images.weserv.nl/
  if (!base) return url
  
  // weserv acepta dominio sin protocolo en ?url=
  const clean = url.replace(/^https?:\/\//,'')
  const u = new URL(base)
  u.searchParams.set('url', clean)
  u.searchParams.set('w', String(w))
  u.searchParams.set('h', String(h))
  u.searchParams.set('fit','cover')
  u.searchParams.set('we','1') // WebP when possible
  return u.toString()
}
