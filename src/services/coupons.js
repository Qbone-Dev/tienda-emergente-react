// US-12 Cupones y promociones.
// CA: valida vigencia y monto mínimo; el descuento se ve en el total.

export const COUPONS = [
  { code: 'BIENVENIDA10', type: 'percent', value: 10, min: 500, from: '2026-10-01', to: '2026-12-31',
    label: '10 % de descuento en compras desde $500' },
  { code: 'OTONO150', type: 'fixed', value: 150, min: 1500, from: '2026-10-15', to: '2026-11-15',
    label: '$150 de descuento en compras desde $1,500' },
  { code: 'ENVIOGRATIS', type: 'shipping', value: 0, min: 300, from: '2026-10-01', to: '2026-10-31',
    label: 'Envío gratis en compras desde $300' },
  { code: 'VERANO20', type: 'percent', value: 20, min: 0, from: '2026-06-01', to: '2026-08-31',
    label: '20 % de descuento de verano' },
]

const day = (date) => date.toLocaleDateString('en-CA') // AAAA-MM-DD en hora local

export function findCoupon(code) {
  return COUPONS.find((c) => c.code === String(code).trim().toUpperCase()) ?? null
}

// Devuelve el cupón si aplica o lanza un error con el motivo.
export function validateCoupon(code, productsTotal, today = new Date()) {
  const coupon = findCoupon(code)
  if (!coupon) throw new Error('Ese cupón no existe.')
  const d = day(today)
  if (d < coupon.from) throw new Error(`El cupón ${coupon.code} es válido a partir del ${coupon.from}.`)
  if (d > coupon.to) throw new Error(`El cupón ${coupon.code} venció el ${coupon.to}.`)
  if (productsTotal < coupon.min) {
    throw new Error(`El cupón ${coupon.code} aplica en compras desde $${coupon.min.toLocaleString('es-MX')}.`)
  }
  return coupon
}

export function discountFor(coupon, productsTotal) {
  if (!coupon) return 0
  if (coupon.type === 'percent') return Math.round(productsTotal * coupon.value) / 100
  if (coupon.type === 'fixed') return Math.min(coupon.value, productsTotal)
  return 0
}
