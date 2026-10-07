// Pedidos guardados en el navegador (sustituyen a la base de datos en esta etapa).
import { load, save } from './storage'

const ORDERS_KEY = 'te.orders'

export const getOrders = () => load(ORDERS_KEY, [])

function newOrderNumber() {
  const d = new Date()
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  return `TE-${ymd}-${String(Math.floor(Math.random() * 1e5)).padStart(5, '0')}`
}

export function createOrder(order) {
  const saved = { ...order, number: newOrderNumber(), createdAt: new Date().toISOString() }
  save(ORDERS_KEY, [saved, ...getOrders()])
  return saved
}

export const getOrder = (number) => getOrders().find((o) => o.number === number) ?? null

export const getOrdersByUser = (userId) => getOrders().filter((o) => o.userId === userId)

// US-07 Historial y seguimiento de pedidos.
// CA: estados pagado / enviado / entregado; número de guía visible.
// Mientras no exista la paquetería real, el estado avanza con el tiempo transcurrido.
export const STATUSES = [
  { key: 'pagado', label: 'Pagado' },
  { key: 'enviado', label: 'Enviado' },
  { key: 'entregado', label: 'Entregado' },
]
export const MINUTES_TO_SHIP = 2
export const MINUTES_TO_DELIVER = 5

export function orderStatus(order, now = new Date()) {
  const minutes = (now - new Date(order.createdAt)) / 60000
  if (minutes >= MINUTES_TO_DELIVER) return 'entregado'
  if (minutes >= MINUTES_TO_SHIP) return 'enviado'
  return 'pagado'
}

export function trackingNumber(order) {
  const digits = order.number.replace(/\D/g, '')
  return `MX${digits.slice(-10).padStart(10, '0')}`
}

// US-15: al crear cuenta con el correo de una compra como invitado, esos pedidos pasan a la cuenta.
export function claimGuestOrders(email, userId) {
  const normalized = email.trim().toLowerCase()
  save(
    ORDERS_KEY,
    getOrders().map((o) => (o.guest && o.email.toLowerCase() === normalized ? { ...o, userId, guest: false } : o)),
  )
}
