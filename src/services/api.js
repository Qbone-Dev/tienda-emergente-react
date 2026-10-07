// API simulada. Reproduce la latencia de red para que la interfaz maneje estados de carga;
// se sustituye por las llamadas al backend real en el Sprint 4 (T-05).
import { PRODUCTS } from '../data/products'

const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms))

export const PAGE_SIZE = 8

export async function getProducts({ category = 'Todas', page = 1 } = {}) {
  await wait()
  const filtered = category === 'Todas' ? PRODUCTS : PRODUCTS.filter((x) => x.category === category)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  return { items: filtered.slice(start, start + PAGE_SIZE), page, totalPages, total: filtered.length }
}

export async function getProduct(id) {
  await wait(150)
  return PRODUCTS.find((x) => x.id === id) ?? null
}

export const getProductSync = (id) => PRODUCTS.find((x) => x.id === id) ?? null
