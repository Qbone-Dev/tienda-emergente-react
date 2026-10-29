// US-14 Panel de administración de inventario.
// CA: alta, edición y baja de productos; el stock se refleja en la app en menos de 1 min;
// acceso solo con rol administrador.
// El inventario parte del catálogo de ejemplo y los cambios del administrador se guardan aparte.
import { CATEGORIES, PRODUCTS } from '../data/products'
import { load, save } from './storage'

const KEY = 'te.inventory'
export const CHANGE_EVENT = 'te:inventory'

export function getAllProducts() {
  return load(KEY, null) ?? PRODUCTS.map((p) => ({ ...p, active: true }))
}

export const getActiveProducts = () => getAllProducts().filter((p) => p.active !== false)
export const findProduct = (id) => getAllProducts().find((p) => p.id === id) ?? null
export const brandsOf = (list) => [...new Set(list.map((p) => p.brand))].sort()

function persist(list) {
  save(KEY, list)
  // Avisa a las pantallas abiertas en esta pestaña; las otras pestañas reciben el evento «storage».
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(CHANGE_EVENT))
  return list
}

export function validateProduct({ name, brand, category, price, stock }) {
  const errors = {}
  if (!String(name).trim()) errors.name = 'Escribe el nombre del producto.'
  if (!String(brand).trim()) errors.brand = 'Escribe la marca.'
  if (!CATEGORIES.includes(category)) errors.category = 'Elige una categoría.'
  if (!(Number(price) > 0)) errors.price = 'El precio debe ser mayor a 0.'
  if (!Number.isInteger(Number(stock)) || Number(stock) < 0 || String(stock).trim() === '') {
    errors.stock = 'Las existencias son un número entero desde 0.'
  }
  return errors
}

function nextId(list) {
  const max = list.reduce((m, p) => Math.max(m, Number(p.id.replace(/\D/g, '')) || 0), 0)
  return `p${String(max + 1).padStart(2, '0')}`
}

export function saveProduct(input) {
  const errors = validateProduct(input)
  if (Object.keys(errors).length) {
    const err = new Error('Revisa los datos del producto.')
    err.fields = errors
    throw err
  }
  const clean = {
    name: input.name.trim(),
    brand: input.brand.trim(),
    category: input.category,
    price: Math.round(Number(input.price) * 100) / 100,
    stock: Number(input.stock),
    description: (input.description ?? '').trim(),
    updatedAt: new Date().toISOString(),
  }
  const list = getAllProducts()
  if (input.id) {
    return persist(list.map((p) => (p.id === input.id ? { ...p, ...clean } : p)))
  }
  const id = nextId(list)
  return persist([...list, { id, ...clean, images: [`${id}-a`, `${id}-b`, `${id}-c`], reviews: [], active: true }])
}

export function setStock(id, stock) {
  const n = Number(stock)
  if (!Number.isInteger(n) || n < 0) throw new Error('Las existencias son un número entero desde 0.')
  return persist(getAllProducts().map((p) => (p.id === id ? { ...p, stock: n, updatedAt: new Date().toISOString() } : p)))
}

// Baja lógica: el producto deja de verse en la tienda pero los pedidos anteriores lo conservan.
export function setActive(id, active) {
  return persist(getAllProducts().map((p) => (p.id === id ? { ...p, active, updatedAt: new Date().toISOString() } : p)))
}

export function subscribe(listener) {
  if (typeof window === 'undefined') return () => {}
  const onStorage = (e) => (e.key === null || e.key === KEY) && listener()
  window.addEventListener(CHANGE_EVENT, listener)
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(CHANGE_EVENT, listener)
    window.removeEventListener('storage', onStorage)
  }
}
