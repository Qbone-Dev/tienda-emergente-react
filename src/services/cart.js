// US-04 Cálculo de totales del carrito (precios en MXN con IVA incluido).
// US-12 El cupón se descuenta del importe de productos; el envío gratis se evalúa ya con el descuento.
import { discountFor } from './coupons'

export const IVA = 0.16
export const FREE_SHIPPING_FROM = 999
export const SHIPPING_COST = 99

const round = (n) => Math.round(n * 100) / 100

export function computeTotals(lines, coupon = null) {
  const gross = round(lines.reduce((sum, l) => sum + l.price * l.qty, 0))
  const items = lines.reduce((sum, l) => sum + l.qty, 0)
  const discount = round(discountFor(coupon, gross))
  const products = round(gross - discount)
  const freeShipping = items === 0 || products >= FREE_SHIPPING_FROM || coupon?.type === 'shipping'
  const shipping = freeShipping ? 0 : SHIPPING_COST
  const subtotal = round(products / (1 + IVA))
  return {
    items,
    gross,
    discount,
    subtotal,
    iva: round(products - subtotal),
    shipping,
    total: round(products + shipping),
  }
}

export const money = (n) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 })
