// US-11 Pantalla «Mis favoritos»: quitar o mover al carrito.
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { getProductSync } from '../services/api'
import { money } from '../services/cart'
import LazyImage from '../components/LazyImage'

export default function Wishlist() {
  const { ids, remove } = useWishlist()
  const { add } = useCart()
  const products = ids.map(getProductSync).filter(Boolean)

  const moveToCart = (id) => {
    add(id, 1)
    remove(id)
  }

  return (
    <section className="container">
      <h1>Mis favoritos</h1>
      {products.length === 0 ? (
        <p>Aún no tienes favoritos. Toca el corazón de un producto para guardarlo. <Link to="/">Ir al catálogo</Link></p>
      ) : (
        <ul className="cart-lines">
          {products.map((p) => (
            <li key={p.id}>
              <LazyImage seed={p.images[0]} alt="" sizes="80px" className="thumb" />
              <div className="grow">
                <Link to={`/producto/${p.id}`}>{p.name}</Link>
                <div className="muted small">{money(p.price)} · {p.stock > 0 ? `${p.stock} disponibles` : 'Agotado'}</div>
              </div>
              <button className="btn" disabled={p.stock === 0} onClick={() => moveToCart(p.id)}>Mover al carrito</button>
              <button className="link danger" onClick={() => remove(p.id)}>Quitar</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
