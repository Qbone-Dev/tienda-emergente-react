import { Link } from 'react-router-dom'
import { money } from '../services/cart'
import { averageRating, getReviews } from '../services/reviews'
import LazyImage from './LazyImage'
import Stars from './Stars'

export default function ProductCard({ product }) {
  const reviews = getReviews(product)
  return (
    <Link to={`/producto/${product.id}`} className="card">
      <LazyImage seed={product.images[0]} alt={product.name} />
      <div className="card-body">
        <span className="muted small">{product.brand}</span>
        <h3>{product.name}</h3>
        <Stars value={averageRating(reviews)} count={reviews.length} />
        <strong className="price">{money(product.price)}</strong>
        {product.stock === 0 && <span className="badge out">Agotado</span>}
      </div>
    </Link>
  )
}
