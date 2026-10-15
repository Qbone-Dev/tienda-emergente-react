// US-05 Número de pedido y confirmación por correo.
// US-07 Seguimiento: línea de tiempo pagado → enviado → entregado y número de guía.
// US-15 Al terminar una compra como invitado se invita (opcionalmente) a crear una cuenta.
import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getOrder, orderStatus, STATUSES, trackingNumber } from '../services/orders'
import { money } from '../services/cart'

export default function OrderConfirmation() {
  const { number } = useParams()
  const [params] = useSearchParams()
  const { user } = useAuth()
  const order = getOrder(number)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(t)
  }, [])

  if (!order) return <p className="container">No encontramos ese pedido. <Link to="/">Volver</Link></p>

  const isNew = params.get('nuevo') === '1'
  const status = orderStatus(order, now)
  const reached = STATUSES.findIndex((s) => s.key === status)

  return (
    <section className="container narrow">
      {isNew ? <h1>¡Gracias por tu compra!</h1> : <h1>Pedido {order.number}</h1>}
      {isNew && (
        <>
          <p>Tu número de pedido es <strong className="order-number">{order.number}</strong>.</p>
          <p>Enviamos la confirmación a <strong>{order.email}</strong> (correo simulado en esta versión).</p>
        </>
      )}

      <h2>Seguimiento</h2>
      <ol className="timeline">
        {STATUSES.map((s, i) => (
          <li key={s.key} className={i <= reached ? 'reached' : ''}>{s.label}</li>
        ))}
      </ol>
      {status !== 'pagado' ? (
        <p>Número de guía: <strong className="order-number">{trackingNumber(order)}</strong></p>
      ) : (
        <p className="muted small">El número de guía aparece cuando el pedido se envía.</p>
      )}

      <h2>Artículos</h2>
      <ul className="plain">
        {order.items.map((i) => (
          <li key={i.id}><Link to={`/producto/${i.id}`}>{i.qty} × {i.name}</Link> — {money(i.price * i.qty)}</li>
        ))}
      </ul>
      <p>Total pagado: <strong>{money(order.total)}</strong> con tarjeta terminación {order.cardLast4}.</p>
      {order.coupon && (
        <p className="muted small">Incluye un descuento de {money(order.coupon.discount)} con el cupón {order.coupon.code}.</p>
      )}
      <p className="muted small">
        Envío a {order.address.street}, {order.address.city}, C.P. {order.address.zip}
      </p>

      {order.guest && !user && isNew && (
        <div className="notice">
          <strong>¿Quieres guardar tus datos para la próxima vez?</strong>
          <p>Crea una cuenta con {order.email} y consulta tus pedidos cuando quieras.</p>
          <Link to="/registro" state={{ email: order.email }} className="btn">Crear cuenta</Link>
        </div>
      )}
      {user && order.userId === user.id && (
        <p><Link to={`/soporte?pedido=${order.number}`}>¿Necesitas ayuda con este pedido? Escríbenos</Link></p>
      )}
      <p><Link to={user ? '/mis-pedidos' : '/'}>{user ? 'Ver todos mis pedidos' : 'Seguir comprando'}</Link></p>
    </section>
  )
}
