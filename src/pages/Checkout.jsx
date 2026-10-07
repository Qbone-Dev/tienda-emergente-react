// US-05 Checkout / Pago.
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { processPayment, validateCard } from '../services/payment'
import { Summary } from './Cart'

export default function Checkout() {
  const { user } = useAuth()
  const { lines, totals, clear } = useCart()
  const navigate = useNavigate()
  const [address, setAddress] = useState({ street: '', city: '', zip: '' })
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' })
  const [errors, setErrors] = useState({})

  if (lines.length === 0) return <Navigate to="/carrito" replace />

  const submit = async (e) => {
    e.preventDefault()
    const found = validateCard(card)
    setErrors(found)
    if (Object.keys(found).length) return
    const items = lines.map(({ id, name, price, qty }) => ({ id, name, price, qty }))
    clear()
    try {
      const order = await processPayment({
        amount: totals.total,
        card,
        order: { userId: user.id, email: user.email, items, address },
      })
      navigate(`/pedido/${order.number}`)
    } catch (err) {
      setErrors({ payment: err.message })
    }
  }

  return (
    <section className="container">
      <h1>Pago</h1>
      <div className="cart-layout">
        <form className="form" onSubmit={submit}>
          <h2>Dirección de envío</h2>
          <label>Calle y número<input required value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })} /></label>
          <label>Ciudad<input required value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })} /></label>
          <label>Código postal<input required pattern="\d{5}" value={address.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })} /></label>

          <h2>Tarjeta</h2>
          <label>Nombre en la tarjeta<input value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} /></label>
          {errors.name && <span className="error">{errors.name}</span>}
          <label>Número<input inputMode="numeric" autoComplete="cc-number" value={card.number}
            onChange={(e) => setCard({ ...card, number: e.target.value })} /></label>
          {errors.number && <span className="error">{errors.number}</span>}
          <div className="row">
            <label>Vence (MM/AA)<input value={card.expiry} onChange={(e) => setCard({ ...card, expiry: e.target.value })} /></label>
            <label>CVV<input inputMode="numeric" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value })} /></label>
          </div>
          {(errors.expiry || errors.cvv) && <span className="error">{errors.expiry ?? errors.cvv}</span>}
          {errors.payment && <p className="error" role="alert">{errors.payment}</p>}
          <button className="btn">Pagar</button>
        </form>
        <Summary totals={totals} />
      </div>
    </section>
  )
}
