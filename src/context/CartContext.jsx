// US-04 Carrito de compras: agregar, eliminar y cambiar cantidades.
// CA: el carrito persiste entre sesiones (localStorage) y los totales se recalculan en tiempo real.
// US-12 El cupón aplicado se guarda con el carrito y se vuelve a validar cada vez que cambia el importe.
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProductSync } from '../services/api'
import { computeTotals } from '../services/cart'
import { validateCoupon } from '../services/coupons'
import { load, save } from '../services/storage'

const CART_KEY = 'te.cart'
const COUPON_KEY = 'te.coupon'
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [entries, setEntries] = useState(() => load(CART_KEY, []))
  const [couponCode, setCouponCode] = useState(() => load(COUPON_KEY, null))
  const [couponNotice, setCouponNotice] = useState('')

  useEffect(() => {
    save(CART_KEY, entries)
  }, [entries])
  useEffect(() => {
    save(COUPON_KEY, couponCode)
  }, [couponCode])

  const lines = useMemo(
    () =>
      entries
        .map((e) => ({ ...getProductSync(e.id), qty: e.qty }))
        .filter((l) => l.id),
    [entries],
  )

  const gross = lines.reduce((s, l) => s + l.price * l.qty, 0)
  const coupon = useMemo(() => {
    if (!couponCode) return null
    try {
      return validateCoupon(couponCode, gross)
    } catch {
      return null
    }
  }, [couponCode, gross])

  // Si el carrito baja del mínimo o el cupón vence, se quita y se avisa.
  useEffect(() => {
    if (!couponCode || coupon) return
    try {
      validateCoupon(couponCode, gross)
    } catch (err) {
      if (lines.length > 0) setCouponNotice(`Quitamos el cupón: ${err.message}`)
    }
    setCouponCode(null)
  }, [couponCode, coupon, gross, lines.length])

  const totals = useMemo(() => computeTotals(lines, coupon), [lines, coupon])

  const setQty = (id, qty) => {
    const product = getProductSync(id)
    const safe = Math.max(0, Math.min(qty, product?.stock ?? 0))
    setEntries((prev) =>
      safe === 0 ? prev.filter((e) => e.id !== id) : prev.map((e) => (e.id === id ? { ...e, qty: safe } : e)),
    )
  }

  const add = (id, qty = 1) => {
    setEntries((prev) => {
      const stock = getProductSync(id)?.stock ?? 0
      const current = prev.find((e) => e.id === id)
      if (current) return prev.map((e) => (e.id === id ? { ...e, qty: Math.min(stock, e.qty + qty) } : e))
      return stock > 0 ? [...prev, { id, qty: Math.min(stock, qty) }] : prev
    })
  }

  const remove = (id) => setEntries((prev) => prev.filter((e) => e.id !== id))
  const clear = () => {
    setEntries([])
    setCouponCode(null)
  }

  const applyCoupon = (code) => {
    const valid = validateCoupon(code, gross) // lanza error con el motivo
    setCouponCode(valid.code)
    setCouponNotice('')
    return valid
  }
  const removeCoupon = () => setCouponCode(null)

  return (
    <CartContext.Provider
      value={{ lines, totals, coupon, couponNotice, add, setQty, remove, clear, applyCoupon, removeCoupon }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
