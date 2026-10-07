// US-05 Checkout / Pago con pasarela simulada.
// La tarjeta se valida en el navegador y su número nunca se guarda (solo los últimos 4 dígitos).
import { createOrder } from './orders'

export function luhnValid(number) {
  const digits = String(number).replace(/\D/g, '')
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i])
    if (i % 2 === 1) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  return sum % 10 === 0
}

export function validateCard({ name, number, expiry, cvv }, today = new Date()) {
  const errors = {}
  if (!name.trim()) errors.name = 'Escribe el nombre como aparece en la tarjeta.'
  if (!luhnValid(number)) errors.number = 'El número de tarjeta no es válido.'
  const m = /^(\d{2})\/(\d{2})$/.exec(expiry.trim())
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) {
    errors.expiry = 'Usa el formato MM/AA.'
  } else {
    const end = new Date(2000 + Number(m[2]), Number(m[1]), 0, 23, 59)
    if (end < today) errors.expiry = 'La tarjeta está vencida.'
  }
  if (!/^\d{3,4}$/.test(cvv)) errors.cvv = 'El CVV tiene 3 o 4 dígitos.'
  return errors
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function processPayment({ amount, card, order }) {
  await wait(800)
  const digits = card.number.replace(/\D/g, '')
  // Tarjeta de prueba que siempre se rechaza, para probar el manejo de errores.
  if (digits === '4000000000000002') throw new Error('El banco rechazó el pago. Intenta con otra tarjeta.')
  return createOrder({ ...order, total: amount, cardLast4: digits.slice(-4) })
}
