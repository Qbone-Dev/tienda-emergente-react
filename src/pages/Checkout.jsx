// US-05 Checkout / Pago, en dos pasos: envío → pago.
// BUG-01: el paso actual vive en la URL (?paso=pago), así que "Regresar" (botón o navegador) solo cambia
//   de paso; los datos de envío se conservan en sessionStorage, el carrito se vacía únicamente cuando el
//   pago se confirma y la llave de idempotencia evita cargos duplicados.
// US-15: si no hay sesión, se puede comprar como invitado solo con correo y dirección.
import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { isValidEmail } from '../services/auth'
import { processPayment, validateCard } from '../services/payment'
import { Summary } from './Cart'

const SESSION_KEY = 'te.checkout'
const emptyShipping = { name: '', email: '', street: '', city: '', zip: '' }

function loadSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY)) ?? {}
  } catch {
    return {}
  }
}
function saveSession(value) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(value))
  } catch {
    /* sin persistencia */
  }
}

export default function Checkout() {
  const { user } = useAuth()
  const { lines, totals, clear } = useCart()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const step = params.get('paso') === 'pago' ? 'pago' : 'envio'

  const [session] = useState(loadSession)
  const [shipping, setShipping] = useState({ ...emptyShipping, ...session.shipping })
  const [idempotencyKey] = useState(() => session.idempotencyKey ?? crypto.randomUUID())
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const [errors, setErrors] = useState({})
  const [paying, setPaying] = useState(false)
  const completed = useRef(false)

  useEffect(() => saveSession({ shipping, idempotencyKey }), [shipping, idempotencyKey])

  if (lines.length === 0 && !completed.current) return <Navigate to="/carrito" replace />
  if (step === 'pago' && !shipping.street) return <Navigate to="/checkout" replace />

  const email = user ? user.email : shipping.email

  const toPayment = (e) => {
    e.preventDefault()
    if (!user && !isValidEmail(shipping.email)) {
      setErrors({ email: 'Escribe un correo válido para enviarte la confirmación.' })
      return
    }
    setErrors({})
    setParams({ paso: 'pago' })
  }

  const pay = async (e) => {
    e.preventDefault()
    if (paying) return
    const found = validateCard(card)
    setErrors(found)
    if (Object.keys(found).length) return
    setPaying(true)
    try {
      const order = await processPayment({
        amount: totals.total,
        card,
        idempotencyKey,
        order: {
          userId: user?.id ?? null,
          guest: !user,
          email,
          customer: user?.name ?? shipping.name,
          items: lines.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
          address: { street: shipping.street, city: shipping.city, zip: shipping.zip },
        },
      })
      completed.current = true
      sessionStorage.removeItem(SESSION_KEY)
      navigate(`/pedido/${order.number}?nuevo=1`, { replace: true })
      clear()
    } catch (err) {
      setErrors({ payment: err.message })
      setPaying(false)
    }
  }

  const field = (key, label, props = {}) => (
    <label>
      {label}
      <input required value={shipping[key]} onChange={(e) => setShipping({ ...shipping, [key]: e.target.value })} {...props} />
    </label>
  )

  return (
    <section className="container">
      <h1>Pago</h1>
      <ol className="steps" aria-label="Pasos del pago">
        <li className={step === 'envio' ? 'current' : 'done'}>1. Envío</li>
        <li className={step === 'pago' ? 'current' : ''}>2. Pago</li>
      </ol>
      <div className="cart-layout">
        {step === 'envio' ? (
          <form className="form" onSubmit={toPayment}>
            {user ? (
              <p className="notice">Comprando como <strong>{user.name}</strong> ({user.email}).</p>
            ) : (
              <>
                <p className="notice">
                  Compra como invitado: solo necesitamos tu correo y tu dirección.{' '}
                  <Link to="/login" state={{ from: '/checkout' }}>¿Ya tienes cuenta? Inicia sesión</Link>
                </p>
                {field('name', 'Nombre de quien recibe', { autoComplete: 'name' })}
                {field('email', 'Correo para la confirmación', { type: 'email', autoComplete: 'email' })}
                {errors.email && <span className="error">{errors.email}</span>}
              </>
            )}
            <h2>Dirección de envío</h2>
            {field('street', 'Calle y número', { autoComplete: 'street-address' })}
            {field('city', 'Ciudad', { autoComplete: 'address-level2' })}
            {field('zip', 'Código postal', { pattern: '\\d{5}', inputMode: 'numeric', autoComplete: 'postal-code', title: '5 dígitos' })}
            <button className="btn">Continuar al pago</button>
          </form>
        ) : (
          <form className="form" onSubmit={pay}>
            <p className="muted small">
              Envío a {shipping.street}, {shipping.city}, C.P. {shipping.zip} · confirmación a {email}
            </p>
            <h2>Tarjeta</h2>
            <label>Nombre en la tarjeta<input autoComplete="cc-name" value={card.name}
              onChange={(e) => setCard({ ...card, name: e.target.value })} /></label>
            {errors.name && <span className="error">{errors.name}</span>}
            <label>Número<input inputMode="numeric" autoComplete="cc-number" value={card.number}
              onChange={(e) => setCard({ ...card, number: e.target.value })} /></label>
            {errors.number && <span className="error">{errors.number}</span>}
            <div className="row">
              <label>Vence (MM/AA)<input autoComplete="cc-exp" value={card.expiry}
                onChange={(e) => setCard({ ...card, expiry: e.target.value })} /></label>
              <label>CVV<input inputMode="numeric" autoComplete="cc-csc" value={card.cvv}
                onChange={(e) => setCard({ ...card, cvv: e.target.value })} /></label>
            </div>
            {(errors.expiry || errors.cvv) && <span className="error">{errors.expiry ?? errors.cvv}</span>}
            {errors.payment && <p className="error" role="alert">{errors.payment}</p>}
            <p className="muted small">Prueba con 4242 4242 4242 4242, cualquier fecha futura y CVV 123.</p>
            <div className="row">
              <button type="button" className="btn ghost" onClick={() => setParams({})} disabled={paying}>Regresar</button>
              <button className="btn" disabled={paying}>{paying ? 'Procesando…' : 'Pagar'}</button>
            </div>
          </form>
        )}
        <Summary totals={totals} />
      </div>
    </section>
  )
}
