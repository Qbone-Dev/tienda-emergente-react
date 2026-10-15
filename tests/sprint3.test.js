// Pruebas del Sprint 3 (tareas de QA de US-09 a US-13).
import { beforeEach, describe, expect, it } from 'vitest'
import { computeTotals } from '../src/services/cart'
import { validateCoupon } from '../src/services/coupons'
import { deleteAddress, getDefaultAddress, saveAddress, setDefaultAddress } from '../src/services/addresses'
import { getWishlist, toggleWish } from '../src/services/wishlist'
import { diffStatuses } from '../src/services/notifications'
import { getConversation, isOpen, replyFor, sendMessage } from '../src/services/chat'

beforeEach(() => {
  const data = new Map()
  globalThis.localStorage = {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
  }
})

const at = (iso) => new Date(iso)

describe('US-12 Cupones y promociones', () => {
  it('valida la vigencia', () => {
    expect(() => validateCoupon('VERANO20', 1000, at('2026-10-20T12:00'))).toThrow(/venció/)
    expect(() => validateCoupon('OTONO150', 2000, at('2026-10-10T12:00'))).toThrow(/a partir/)
    expect(validateCoupon('otono150', 2000, at('2026-10-20T12:00')).code).toBe('OTONO150')
  })
  it('valida el monto mínimo', () => {
    expect(() => validateCoupon('BIENVENIDA10', 499, at('2026-10-20T12:00'))).toThrow(/desde \$500/)
  })
  it('rechaza cupones que no existen', () => {
    expect(() => validateCoupon('NOEXISTE', 1000)).toThrow(/no existe/)
  })
  it('muestra el descuento en el total', () => {
    const coupon = validateCoupon('BIENVENIDA10', 1000, at('2026-10-20T12:00'))
    const t = computeTotals([{ price: 1000, qty: 1 }], coupon)
    expect(t.discount).toBe(100)
    expect(t.total).toBe(900 + 99) // con descuento ya no alcanza el envío gratis
  })
  it('el cupón de envío gratis quita el costo de envío', () => {
    const coupon = validateCoupon('ENVIOGRATIS', 300, at('2026-10-20T12:00'))
    expect(computeTotals([{ price: 300, qty: 1 }], coupon).shipping).toBe(0)
  })
})

describe('US-10 Perfil y direcciones', () => {
  const casa = { alias: 'Casa', street: 'Av. Prueba 123', city: 'Guadalajara', zip: '44100' }
  const oficina = { alias: 'Oficina', street: 'Calle 2 #45', city: 'Zapopan', zip: '45010' }
  it('la primera dirección queda como predeterminada', () => {
    saveAddress('u1', casa)
    saveAddress('u1', oficina)
    expect(getDefaultAddress('u1').alias).toBe('Casa')
  })
  it('permite editar, cambiar la predeterminada y borrar', () => {
    let list = saveAddress('u1', casa)
    list = saveAddress('u1', oficina)
    const ofi = list.find((a) => a.alias === 'Oficina')
    setDefaultAddress('u1', ofi.id)
    expect(getDefaultAddress('u1').alias).toBe('Oficina')
    saveAddress('u1', { ...ofi, alias: 'Trabajo' })
    expect(getDefaultAddress('u1').alias).toBe('Trabajo')
    deleteAddress('u1', ofi.id)
    expect(getDefaultAddress('u1').alias).toBe('Casa') // otra pasa a ser predeterminada
  })
  it('rechaza un código postal inválido', () => {
    expect(() => saveAddress('u1', { ...casa, zip: '441' })).toThrow()
  })
})

describe('US-11 Lista de deseos', () => {
  it('agrega y quita con el mismo botón, por usuario', () => {
    toggleWish('u1', 'p01')
    toggleWish('u1', 'p02')
    toggleWish('u1', 'p01')
    expect(getWishlist('u1')).toEqual(['p02'])
    expect(getWishlist('u2')).toEqual([])
  })
})

describe('US-09 Notificaciones', () => {
  const order = { number: 'TE-1', createdAt: '2026-10-19T10:00:00Z' }
  it('avisa en cada cambio de estado y no repite avisos', () => {
    const t1 = at('2026-10-19T10:01:00Z')
    expect(diffStatuses([order], {}, t1).map((c) => c.status)).toEqual(['pagado'])
    expect(diffStatuses([order], { 'TE-1': 'pagado' }, t1)).toEqual([])
    expect(diffStatuses([order], { 'TE-1': 'pagado' }, at('2026-10-19T10:03:00Z'))[0].status).toBe('enviado')
  })
  it('no avisa de pedidos viejos que nunca se habían visto', () => {
    expect(diffStatuses([order], {}, at('2026-10-25T10:00:00Z'))).toEqual([])
  })
})

describe('US-13 Chat de soporte', () => {
  it('respeta el horario laboral (lunes a viernes de 9:00 a 18:00)', () => {
    expect(isOpen(new Date(2026, 9, 21, 10, 0))).toBe(true) // miércoles 10:00
    expect(isOpen(new Date(2026, 9, 21, 18, 0))).toBe(false) // miércoles 18:00
    expect(isOpen(new Date(2026, 9, 24, 11, 0))).toBe(false) // sábado
    expect(replyFor('hola', { now: new Date(2026, 9, 24, 11, 0) })).toMatch(/horario/)
  })
  it('guarda el historial ligado a cada pedido', () => {
    sendMessage('u1', 'TE-1', '¿Dónde está mi pedido?')
    sendMessage('u1', 'general', 'Quiero factura')
    expect(getConversation('u1', 'TE-1')).toHaveLength(1)
    expect(getConversation('u1', 'general')[0].text).toBe('Quiero factura')
  })
  it('responde con el número de guía si el pedido ya salió', () => {
    const order = { number: 'TE-20261021-00042', createdAt: new Date(2026, 9, 21, 9, 0).toISOString() }
    expect(replyFor('¿dónde va mi envío?', { now: new Date(2026, 9, 21, 9, 10), order })).toMatch(/MX\d{10}/)
  })
})
