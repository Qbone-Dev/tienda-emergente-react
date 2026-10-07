import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { user, signOut } = useAuth()
  const { totals } = useCart()

  return (
    <header className="header">
      <div className="container header-row">
        <Link to="/" className="logo">Tienda<span>Emergente</span></Link>
        <nav className="nav">
          <NavLink to="/">Catálogo</NavLink>
          {user ? (
            <>
              <span className="hello">Hola, {user.name.split(' ')[0]}</span>
              <button className="link" onClick={signOut}>Salir</button>
            </>
          ) : (
            <NavLink to="/login">Iniciar sesión</NavLink>
          )}
          <Link to="/carrito" className="cart-icon-s1" title="Carrito">
            🛒<small>{totals.items}</small>
          </Link>
        </nav>
      </div>
    </header>
  )
}
