// US-08 Calificar y reseñar productos.
// CA: solo compras verificadas; calificación de 1 a 5 estrellas; filtro de lenguaje ofensivo.
import { load, save } from './storage'
import { getOrders } from './orders'
import { normalize } from './search'

const REVIEWS_KEY = 'te.reviews'

// Lista base de palabras bloqueadas (se compara sin acentos y sin mayúsculas).
const BLOCKED = ['idiota', 'estupido', 'pendejo', 'imbecil', 'basura', 'mierda', 'chingada', 'cabron', 'puto', 'pinche']

export function containsProfanity(text) {
  const words = normalize(text).split(/[^a-z0-9ñ]+/)
  return words.some((w) => BLOCKED.includes(w))
}

const stored = () => load(REVIEWS_KEY, [])

export const getReviews = (product) => [
  ...stored().filter((r) => r.productId === product.id),
  ...product.reviews,
]

export const averageRating = (reviews) =>
  reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

export function reviewStatus(user, productId, orders = getOrders(), reviews = stored()) {
  if (!user) return 'login'
  const bought = orders.some((o) => o.userId === user.id && o.items.some((i) => i.id === productId))
  if (!bought) return 'not-purchased'
  if (reviews.some((r) => r.userId === user.id && r.productId === productId)) return 'already-reviewed'
  return 'allowed'
}

export function validateReview({ rating, comment }) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return 'Elige de 1 a 5 estrellas.'
  if (comment.trim().length < 10) return 'Escribe al menos 10 caracteres.'
  if (containsProfanity(comment)) return 'Tu reseña contiene lenguaje ofensivo. Por favor, modifícala.'
  return null
}

export function addReview(user, productId, { rating, comment }) {
  if (reviewStatus(user, productId) !== 'allowed') throw new Error('Solo puedes reseñar productos que compraste.')
  const error = validateReview({ rating, comment })
  if (error) throw new Error(error)
  const review = {
    productId,
    userId: user.id,
    author: user.name,
    rating,
    comment: comment.trim(),
    date: new Date().toLocaleDateString('en-CA'), // AAAA-MM-DD en hora local
    verified: true,
  }
  save(REVIEWS_KEY, [review, ...stored()])
  return review
}
