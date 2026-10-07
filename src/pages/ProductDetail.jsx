// US-03 Detalle de producto: galería con zoom, existencias visibles y reseñas visibles.
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../services/api'
import { money } from '../services/cart'
import { useCart } from '../context/CartContext'
import Gallery from '../components/Gallery'
import Stars from '../components/Stars'

export default function ProductDetail() {
  const { id } = useParams()
  const { add } = useCart()
  const [product, setProduct] = useState(undefined)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    getProduct(id).then(setProduct)
  }, [id])

  if (product === undefined) return <p className="container muted">Cargando…</p>
  if (product === null) return <p className="container">Producto no encontrado. <Link to="/">Volver al catálogo</Link></p>

  const reviews = product.reviews
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <section className="container detail">
      <Gallery images={product.images} alt={product.name} />
      <div>
        <Link to={`/?categoria=${product.category}`} className="muted small">{product.category}</Link>
        <h1>{product.name}</h1>
        <Stars value={avg} count={reviews.length} />
        <p className="price big">{money(product.price)}</p>
        <p>{product.description}</p>
        <p className={product.stock > 0 ? 'stock ok' : 'stock out'}>
          {product.stock > 0 ? `${product.stock} piezas disponibles` : 'Agotado'}
        </p>
        {product.stock > 0 && (
          <div className="buy">
            <label>
              Cantidad{' '}
              <input type="number" min="1" max={product.stock} value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value))))} />
            </label>
            <button className="btn" onClick={() => { add(product.id, qty); setAdded(true) }}>Agregar al carrito</button>
          </div>
        )}
        {added && <p className="notice">Agregado. <Link to="/carrito">Ver carrito</Link></p>}

        <h2>Reseñas</h2>
        {reviews.length === 0 && <p className="muted">Este producto aún no tiene reseñas.</p>}
        <ul className="reviews">
          {reviews.map((r, i) => (
            <li key={i}>
              <Stars value={r.rating} /> <strong>{r.author}</strong>
              {r.verified && <span className="badge">Compra verificada</span>}
              <p>{r.comment}</p>
              <span className="muted small">{r.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
