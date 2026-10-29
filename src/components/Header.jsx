import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useNotifications } from '../context/NotificationsContext'

export default function Header() {
  const { user, signOut } = useAuth()
  const { totals } = useCart()
  const { unread } = useNotifications()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const search = (e) => {
    e.preventDefault()
    navigate(`/buscar?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <header className="header">
      <div className="container header-row">
        <Link to="/" className="logo">Tienda<span>Emergente</span></Link>
        {/* US-06 búsqueda disponible en todas las pantallas */}
        <form className="search" role="search" onSubmit={search}>
          <input type="search" placeholder="Buscar productos, marcas…" aria-label="Buscar productos"
            value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
        <nav className="nav">
          <NavLink to="/" end>Catálogo</NavLink>
          {user ? (
            <>
              {user.role === 'admin' && <NavLink to="/admin">Inventario</NavLink>}
              <NavLink to="/favoritos">Favoritos</NavLink>
              <NavLink to="/mis-pedidos">Mis pedidos</NavLink>
              <NavLink to="/perfil" className="hello">Hola, {user.name.split(' ')[0]}</NavLink>
              <button className="link" onClick={signOut}>Salir</button>
            </>
          ) : (
            <NavLink to="/login">Iniciar sesión</NavLink>
          )}
          {/* US-09: campana con avisos sin leer */}
          {user && (
            <Link to="/notificaciones" className="cart-icon" aria-label={`Notificaciones, ${unread} sin leer`}>
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                <path fill="currentColor" d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 0 0-5.5-6.84V3a1.5 1.5 0 0 0-3 0v1.16A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2Zm-2 1H7v-6a5 5 0 0 1 10 0v6Z" />
              </svg>
              {unread > 0 && <span className="cart-count">{unread}</span>}
            </Link>
          )}
          {/* T-01: ícono con contraste ≥ 4.5:1 y área táctil de 48 px (CA: ≥ 44 px) */}
          <Link to="/carrito" className="cart-icon" aria-label={`Carrito, ${totals.items} artículos`}>
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path fill="currentColor" d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 2h2.2l.8 2H21a1 1 0 0 1 .96 1.27l-2.5 9A1 1 0 0 1 18.5 15H8.1l-.9 2H19v2H5.6a1 1 0 0 1-.9-1.45L6.3 14 3.6 4H3V2Zm4.1 4 1.6 7h9.05l1.94-7H7.1Z" />
            </svg>
            {totals.items > 0 && <span className="cart-count">{totals.items}</span>}
          </Link>
        </nav>
      </div>
    </header>
  )
}
