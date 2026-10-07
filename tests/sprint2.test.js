// Pruebas del Sprint 2 (tareas de QA de BUG-01, US-06, US-07 y US-08).
import { beforeEach, describe, expect, it } from 'vitest'
import { PRODUCTS } from '../src/data/products'
import { filterProducts, levenshtein } from '../src/services/search'
import { containsProfanity, reviewStatus, validateReview } from '../src/services/reviews'
import { getOrders, orderStatus, trackingNumber } from '../src/services/orders'
import { processPayment } from '../src/services/payment'

// localStorage en memoria para Node.
beforeEach(() => {
  const data = new Map()
  globalThis.localStorage = {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
  }
})

const names = (list) => list.map((p) => p.name)

describe('US-06 Búsqueda y filtros', () => {
  it('ignora acentos y mayúsculas', () => {
    expect(names(filterProducts(PRODUCTS, { q: 'AUDIFONOS' }))).toContain('Audífonos inalámbricos Pulse')
  })
  it('tolera errores de escritura', () => {
    expect(levenshtein('cafetrea', 'cafetera')).toBe(2)
    expect(names(filterProducts(PRODUCTS, { q: 'cafetrea' }))).toContain('Cafetera de goteo 12 tazas')
    expect(names(filterProducts(PRODUCTS, { q: 'mochla' }))).toContain('Mochila antirrobo')
  })
  it('combina palabra, marca, categoría y rango de precio', () => {
    const r = filterProducts(PRODUCTS, { category: 'Electrónica', brand: 'Sonix', min: '700', max: '1000' })
    expect(names(r)).toEqual(['Audífonos inalámbricos Pulse'])
  })
  it('responde en menos de 1 segundo', () => {
    const start = performance.now()
    for (let i = 0; i < 100; i++) filterProducts(PRODUCTS, { q: 'tenis urbano' })
    expect(performance.now() - start).toBeLessThan(1000)
  })
})

describe('BUG-01 Regresar en el pago no duplica cargos', () => {
  const card = { name: 'Ana', number: '4242424242424242', expiry: '12/30', cvv: '123' }
  const order = { userId: 'u1', email: 'ana@correo.mx', items: [{ id: 'p01', name: 'x', price: 899, qty: 1 }], address: {} }

  it('el mismo checkout enviado dos veces crea un solo pedido', async () => {
    const [a, b] = await Promise.all([
      processPayment({ amount: 899, card, order, idempotencyKey: 'k1' }),
      processPayment({ amount: 899, card, order, idempotencyKey: 'k1' }),
    ])
    expect(a.number).toBe(b.number)
    expect(getOrders()).toHaveLength(1)
  })
})

describe('US-07 Seguimiento de pedidos', () => {
  const order = { number: 'TE-20261012-00042', createdAt: '2026-10-12T10:00:00Z' }
  it('avanza de pagado a enviado a entregado', () => {
    expect(orderStatus(order, new Date('2026-10-12T10:01:00Z'))).toBe('pagado')
    expect(orderStatus(order, new Date('2026-10-12T10:03:00Z'))).toBe('enviado')
    expect(orderStatus(order, new Date('2026-10-12T10:06:00Z'))).toBe('entregado')
  })
  it('genera un número de guía visible', () => {
    expect(trackingNumber(order)).toMatch(/^MX\d{10}$/)
  })
})

describe('US-08 Reseñas', () => {
  const user = { id: 'u1', name: 'Ana' }
  const orders = [{ userId: 'u1', items: [{ id: 'p01' }] }]
  it('solo permite reseñar compras verificadas', () => {
    expect(reviewStatus(null, 'p01', orders, [])).toBe('login')
    expect(reviewStatus(user, 'p02', orders, [])).toBe('not-purchased')
    expect(reviewStatus(user, 'p01', orders, [])).toBe('allowed')
    expect(reviewStatus(user, 'p01', orders, [{ userId: 'u1', productId: 'p01' }])).toBe('already-reviewed')
  })
  it('acepta de 1 a 5 estrellas', () => {
    expect(validateReview({ rating: 0, comment: 'Muy buen producto' })).not.toBeNull()
    expect(validateReview({ rating: 5, comment: 'Muy buen producto' })).toBeNull()
  })
  it('filtra lenguaje ofensivo aunque tenga acentos o mayúsculas', () => {
    expect(containsProfanity('Es una BASURA total')).toBe(true)
    expect(containsProfanity('Qué estúpido diseño')).toBe(true)
    expect(containsProfanity('Llegó rápido y en buen estado')).toBe(false)
  })
})
