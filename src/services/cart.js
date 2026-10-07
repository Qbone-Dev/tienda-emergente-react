// US-04 Cálculo de totales del carrito (precios en MXN con IVA incluido).
export const IVA = 0.16
export const FREE_SHIPPING_FROM = 999
export const SHIPPING_COST = 99

const round = (n) => Math.round(n * 100) / 100

export function computeTotals(lines) {
  const products = round(lines.reduce((sum, l) => sum + l.price * l.qty, 0))
  const items = lines.reduce((sum, l) => sum + l.qty, 0)
  const shipping = items === 0 || products >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST
  const subtotal = round(products / (1 + IVA))
  return {
    items,
    subtotal,
    iva: round(products - subtotal),
    shipping,
    total: round(products + shipping),
  }
}

export const money = (n) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 })
