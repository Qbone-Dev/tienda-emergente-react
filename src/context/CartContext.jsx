// US-04 Carrito de compras: agregar, eliminar y cambiar cantidades.
// CA: el carrito persiste entre sesiones (localStorage) y los totales se recalculan en tiempo real.
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getProductSync } from '../services/api'
import { computeTotals } from '../services/cart'
import { load, save } from '../services/storage'

const CART_KEY = 'te.cart'
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [entries, setEntries] = useState(() => load(CART_KEY, []))

  useEffect(() => save(CART_KEY, entries), [entries])

  const lines = useMemo(
    () =>
      entries
        .map((e) => ({ ...getProductSync(e.id), qty: e.qty }))
        .filter((l) => l.id),
    [entries],
  )
  const totals = useMemo(() => computeTotals(lines), [lines])

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
  const clear = () => setEntries([])

  return (
    <CartContext.Provider value={{ lines, totals, add, setQty, remove, clear }}>{children}</CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
