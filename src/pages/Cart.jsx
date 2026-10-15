// US-04 Carrito de compras.
// US-12 Captura de cupón y descuento visible en el resumen.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { money, FREE_SHIPPING_FROM } from '../services/cart'
import LazyImage from '../components/LazyImage'

export default function Cart() {
  const { lines, totals, coupon, setQty, remove } = useCart()

  if (lines.length === 0) {
    return (
      <section className="container">
        <h1>Tu carrito</h1>
        <p>Tu carrito está vacío. <Link to="/">Ir al catálogo</Link></p>
      </section>
    )
  }

  return (
    <section className="container">
      <h1>Tu carrito</h1>
      <div className="cart-layout">
        <ul className="cart-lines">
          {lines.map((l) => (
            <li key={l.id}>
              <LazyImage seed={l.images[0]} alt="" sizes="80px" className="thumb" />
              <div className="grow">
                <Link to={`/producto/${l.id}`}>{l.name}</Link>
                <div className="muted small">{money(l.price)} c/u</div>
              </div>
              <div className="qty">
                <button aria-label="Quitar uno" onClick={() => setQty(l.id, l.qty - 1)}>−</button>
                <span aria-live="polite">{l.qty}</span>
                <button aria-label="Agregar uno" disabled={l.qty >= l.stock} onClick={() => setQty(l.id, l.qty + 1)}>+</button>
              </div>
              <strong>{money(l.price * l.qty)}</strong>
              <button className="link danger" onClick={() => remove(l.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
        <Summary totals={totals} coupon={coupon}>
          <CouponForm />
          <Link to="/checkout" className="btn block">Continuar al pago</Link>
        </Summary>
      </div>
    </section>
  )
}

function CouponForm() {
  const { coupon, couponNotice, applyCoupon, removeCoupon } = useCart()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  if (coupon) {
    return (
      <p className="coupon-applied">
        Cupón <strong>{coupon.code}</strong>: {coupon.label}.{' '}
        <button className="link" onClick={removeCoupon}>Quitar</button>
      </p>
    )
  }

  const submit = (e) => {
    e.preventDefault()
    try {
      applyCoupon(code)
      setCode('')
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="coupon-form" onSubmit={submit}>
      <label htmlFor="coupon">¿Tienes un cupón?</label>
      <div className="row">
        <input id="coupon" value={code} autoComplete="off" placeholder="Ej. BIENVENIDA10"
          onChange={(e) => setCode(e.target.value.toUpperCase())} />
        <button className="btn ghost" disabled={!code.trim()}>Aplicar</button>
      </div>
      {(error || couponNotice) && <p className="error" role="alert">{error || couponNotice}</p>}
    </form>
  )
}

export function Summary({ totals, coupon, children }) {
  return (
    <aside className="summary">
      <h2>Resumen</h2>
      <dl>
        {totals.discount > 0 && (
          <>
            <dt>Productos ({totals.items} artículos)</dt><dd>{money(totals.gross)}</dd>
            <dt className="discount">Descuento {coupon?.code}</dt><dd className="discount">−{money(totals.discount)}</dd>
          </>
        )}
        <dt>Subtotal{totals.discount > 0 ? ' sin IVA' : ` (${totals.items} artículos)`}</dt><dd>{money(totals.subtotal)}</dd>
        <dt>IVA 16 %</dt><dd>{money(totals.iva)}</dd>
        <dt>Envío</dt><dd>{totals.shipping === 0 ? (coupon?.type === 'shipping' ? `Gratis (${coupon.code})` : 'Gratis') : money(totals.shipping)}</dd>
        <dt className="total">Total</dt><dd className="total">{money(totals.total)}</dd>
      </dl>
      {totals.shipping > 0 && <p className="muted small">Envío gratis a partir de {money(FREE_SHIPPING_FROM)}.</p>}
      {children}
    </aside>
  )
}
