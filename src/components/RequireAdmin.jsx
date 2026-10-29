// US-14 Solo el rol administrador entra al panel.
import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAdmin({ children }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (user.role !== 'admin') {
    return (
      <section className="container narrow">
        <h1>Acceso restringido</h1>
        <p>Esta sección es solo para administradores de la tienda. <Link to="/">Volver al catálogo</Link></p>
      </section>
    )
  }
  return children
}
