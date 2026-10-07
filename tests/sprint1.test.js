// Pruebas del Sprint 1 (tareas de QA de US-01, US-04 y US-05).
import { describe, expect, it } from 'vitest'
import { computeTotals } from '../src/services/cart'
import { luhnValid, validateCard } from '../src/services/payment'
import { isValidEmail, validatePassword } from '../src/services/auth'

describe('US-01 Registro y login', () => {
  it('valida el formato del correo', () => {
    expect(isValidEmail('ana@correo.mx')).toBe(true)
    expect(isValidEmail('ana@correo')).toBe(false)
  })
  it('exige contraseñas de 8+ caracteres con letras y números', () => {
    expect(validatePassword('corta1')).not.toBeNull()
    expect(validatePassword('sololetras')).not.toBeNull()
    expect(validatePassword('segura123')).toBeNull()
  })
})

describe('US-04 Carrito: totales', () => {
  it('desglosa el IVA incluido y cobra envío debajo de $999', () => {
    const t = computeTotals([{ price: 116, qty: 2 }])
    expect(t.items).toBe(2)
    expect(t.subtotal).toBe(200)
    expect(t.iva).toBe(32)
    expect(t.shipping).toBe(99)
    expect(t.total).toBe(331)
  })
  it('el envío es gratis a partir de $999', () => {
    expect(computeTotals([{ price: 999, qty: 1 }]).shipping).toBe(0)
  })
  it('un carrito vacío no cobra envío', () => {
    expect(computeTotals([]).total).toBe(0)
  })
})

describe('US-05 Pago: validación de tarjeta', () => {
  it('aplica el algoritmo de Luhn', () => {
    expect(luhnValid('4242 4242 4242 4242')).toBe(true)
    expect(luhnValid('4242 4242 4242 4241')).toBe(false)
  })
  it('detecta tarjetas vencidas y CVV incorrecto', () => {
    const errors = validateCard(
      { name: 'Ana', number: '4242424242424242', expiry: '01/25', cvv: '12' },
      new Date('2026-10-05'),
    )
    expect(errors.expiry).toBeDefined()
    expect(errors.cvv).toBeDefined()
    expect(errors.number).toBeUndefined()
  })
})
