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
