// US-11 Botón de favorito para catálogo y detalle. Sin sesión, lleva a iniciar sesión.
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'

export default function WishButton({ productId, name, variant = 'icon' }) {
  const { user } = useAuth()
  const { has, toggle } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  const active = has(productId)

  const onClick = (e) => {
    e.preventDefault() // la tarjeta del catálogo es un enlace
    e.stopPropagation()
    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search } })
      return
    }
    toggle(productId)
  }

  return (
    <button
      type="button"
      className={`wish ${variant} ${active ? 'on' : ''}`}
      aria-pressed={active}
      aria-label={active ? `Quitar ${name} de favoritos` : `Agregar ${name} a favoritos`}
      onClick={onClick}>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
        <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.8 4.5c2.1 0 3.6 1.1 5.2 3 1.6-1.9 3.1-3 5.2-3 3.8 0 5.9 3.9 4.4 7.3C19.5 16.4 12 21 12 21Z"
          fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      {variant === 'text' && <span>{active ? 'En favoritos' : 'Agregar a favoritos'}</span>}
    </button>
  )
}
