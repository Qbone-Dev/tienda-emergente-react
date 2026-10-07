// US-07 Historial de pedidos del comprador.
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getOrdersByUser, orderStatus, STATUSES } from '../services/orders'
import { money } from '../services/cart'

const label = (key) => STATUSES.find((s) => s.key === key).label

export default function Orders() {
  const { user } = useAuth()
  const orders = getOrdersByUser(user.id)

  return (
    <section className="container">
      <h1>Mis pedidos</h1>
      {orders.length === 0 ? (
        <p>Aún no tienes pedidos. <Link to="/">Ir al catálogo</Link></p>
      ) : (
        <table className="table">
          <thead>
            <tr><th>Pedido</th><th>Fecha</th><th>Artículos</th><th>Total</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const status = orderStatus(o)
              return (
                <tr key={o.number}>
                  <td><Link to={`/pedido/${o.number}`}>{o.number}</Link></td>
                  <td>{new Date(o.createdAt).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td>{o.items.reduce((s, i) => s + i.qty, 0)}</td>
                  <td>{money(o.total)}</td>
                  <td><span className={`status ${status}`}>{label(status)}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </section>
  )
}
