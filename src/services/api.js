// API simulada. Reproduce la latencia de red para que la interfaz maneje estados de carga;
// se sustituye por las llamadas al backend real en T-05.
// US-14: los productos salen del inventario que administra el panel, no de una lista fija.
import { findProduct, getActiveProducts } from './inventory'

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

export const PAGE_SIZE = 8

export async function getProducts({ category = 'Todas', page = 1 } = {}) {
  await wait()
  const all = getActiveProducts()
  const filtered = category === 'Todas' ? all : all.filter((x) => x.category === category)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  return { items: filtered.slice(start, start + PAGE_SIZE), page, totalPages, total: filtered.length }
}

export async function getProduct(id) {
  await wait(150)
  const p = findProduct(id)
  return p && p.active !== false ? p : null
}

// Incluye productos dados de baja para que carrito y favoritos puedan mostrarlos como no disponibles.
export const getProductSync = (id) => findProduct(id)
