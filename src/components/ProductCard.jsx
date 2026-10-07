import { Link } from 'react-router-dom'
import { imageUrl } from '../services/images'
import { money } from '../services/cart'
import Stars from './Stars'

export default function ProductCard({ product }) {
  const avg = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0
  return (
    <Link to={`/producto/${product.id}`} className="card">
      <img src={imageUrl(product.images[0])} alt={product.name} />
      <div className="card-body">
        <span className="muted small">{product.brand}</span>
        <h3>{product.name}</h3>
        <Stars value={avg} count={product.reviews.length} />
        <strong className="price">{money(product.price)}</strong>
        {product.stock === 0 && <span className="badge out">Agotado</span>}
      </div>
    </Link>
  )
}
