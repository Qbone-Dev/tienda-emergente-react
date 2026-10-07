// US-04 Carrito de compras.
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { money, FREE_SHIPPING_FROM } from '../services/cart'
import LazyImage from '../components/LazyImage'

export default function Cart() {
  const { lines, totals, setQty, remove } = useCart()

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
        <Summary totals={totals}>
          <Link to="/checkout" className="btn block">Continuar al pago</Link>
        </Summary>
      </div>
    </section>
  )
}

export function Summary({ totals, children }) {
  return (
    <aside className="summary">
      <h2>Resumen</h2>
      <dl>
        <dt>Subtotal ({totals.items} artículos)</dt><dd>{money(totals.subtotal)}</dd>
        <dt>IVA 16 %</dt><dd>{money(totals.iva)}</dd>
        <dt>Envío</dt><dd>{totals.shipping === 0 ? 'Gratis' : money(totals.shipping)}</dd>
        <dt className="total">Total</dt><dd className="total">{money(totals.total)}</dd>
      </dl>
      {totals.shipping > 0 && <p className="muted small">Envío gratis a partir de {money(FREE_SHIPPING_FROM)}.</p>}
      {children}
    </aside>
  )
}
