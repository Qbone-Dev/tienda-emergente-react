// US-05 Número de pedido y confirmación por correo.
import { Link, useParams } from 'react-router-dom'
import { getOrder } from '../services/orders'
import { money } from '../services/cart'

export default function OrderConfirmation() {
  const { number } = useParams()
  const order = getOrder(number)
  if (!order) return <p className="container">No encontramos ese pedido. <Link to="/">Volver</Link></p>

  return (
    <section className="container narrow">
      <h1>¡Gracias por tu compra!</h1>
      <p>Tu número de pedido es <strong className="order-number">{order.number}</strong>.</p>
      <p>Enviamos la confirmación a <strong>{order.email}</strong> (correo simulado en esta versión).</p>
      <ul className="plain">
        {order.items.map((i) => (
          <li key={i.id}>{i.qty} × {i.name} — {money(i.price * i.qty)}</li>
        ))}
      </ul>
      <p>Total pagado: <strong>{money(order.total)}</strong> con tarjeta terminación {order.cardLast4}.</p>
      <Link to="/" className="btn">Seguir comprando</Link>
    </section>
  )
}
