// US-11 Lista de deseos.
// CA: agregar y quitar desde catálogo y detalle; mover al carrito.
import { load, save } from './storage'

const key = (userId) => `te.wishlist.${userId}`

export const getWishlist = (userId) => load(key(userId), [])

export function toggleWish(userId, productId) {
  const list = getWishlist(userId)
  const next = list.includes(productId) ? list.filter((id) => id !== productId) : [productId, ...list]
  save(key(userId), next)
  return next
}

export function removeWish(userId, productId) {
  const next = getWishlist(userId).filter((id) => id !== productId)
  save(key(userId), next)
  return next
}
