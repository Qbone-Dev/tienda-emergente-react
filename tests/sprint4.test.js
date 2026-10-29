// Pruebas del Sprint 4 (tareas de QA de US-14).
import { beforeEach, describe, expect, it } from 'vitest'
import { findProduct, getActiveProducts, getAllProducts, saveProduct, setActive, setStock, validateProduct } from '../src/services/inventory'
import { getProduct, getProducts } from '../src/services/api'
import { ADMIN_DEMO_PASSWORD, ADMIN_EMAIL, login, register, verifyEmail } from '../src/services/auth'

beforeEach(() => {
  const data = new Map()
  globalThis.localStorage = {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
  }
})

const nuevo = { name: 'Termo de café', brand: 'Ruta', category: 'Hogar', price: '349.5', stock: '12', description: 'Termo de 500 ml.' }

describe('US-14 Panel de administración de inventario', () => {
  it('da de alta un producto con un ID nuevo y lo muestra en la tienda', async () => {
    saveProduct(nuevo)
    const added = getAllProducts().at(-1)
    expect(added.id).toBe('p25')
    expect(added.price).toBe(349.5)
    expect((await getProducts({ category: 'Hogar' })).items.map((p) => p.id)).toContain('p25')
  })
  it('edita un producto existente', () => {
    saveProduct({ ...findProduct('p01'), price: '799', stock: '30' })
    expect(findProduct('p01')).toMatchObject({ price: 799, stock: 30, name: 'Audífonos inalámbricos Pulse' })
  })
  it('valida los datos del producto', () => {
    const errors = validateProduct({ name: '', brand: '', category: 'Autos', price: '0', stock: '1.5' })
    expect(Object.keys(errors).sort()).toEqual(['brand', 'category', 'name', 'price', 'stock'])
  })
  it('la baja oculta el producto de la tienda sin borrarlo', async () => {
    setActive('p02', false)
    expect(getActiveProducts().some((p) => p.id === 'p02')).toBe(false)
    expect(await getProduct('p02')).toBeNull()
    expect(findProduct('p02')).not.toBeNull()
    setActive('p02', true)
    expect(await getProduct('p02')).not.toBeNull()
  })
  it('el cambio de existencias se refleja de inmediato', async () => {
    setStock('p03', 0)
    expect((await getProduct('p03')).stock).toBe(0)
    expect(() => setStock('p03', -2)).toThrow()
  })
  it('solo la cuenta de administración tiene el rol admin', async () => {
    const admin = await login({ email: ADMIN_EMAIL, password: ADMIN_DEMO_PASSWORD })
    expect(admin.role).toBe('admin')
    const { code } = await register({ name: 'Ana', email: 'ana@correo.mx', password: 'segura123' })
    expect(verifyEmail('ana@correo.mx', code).role).toBe('cliente')
  })
})
