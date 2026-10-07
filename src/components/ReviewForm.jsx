// US-08 Formulario de calificación (solo para compras verificadas).
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { addReview, reviewStatus } from '../services/reviews'

const MESSAGES = {
  login: <>Para reseñar, <Link to="/login">inicia sesión</Link> con la cuenta con la que compraste.</>,
  'not-purchased': 'Solo pueden reseñar quienes compraron este producto.',
  'already-reviewed': 'Ya reseñaste este producto. ¡Gracias!',
}

export default function ReviewForm({ user, productId, onAdded }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const status = reviewStatus(user, productId)

  if (status !== 'allowed') return <p className="muted small">{MESSAGES[status]}</p>

  const submit = (e) => {
    e.preventDefault()
    try {
      onAdded(addReview(user, productId, { rating, comment }))
      setRating(0)
      setComment('')
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="form review-form" onSubmit={submit}>
      <fieldset className="star-input">
        <legend>Tu calificación</legend>
        {[1, 2, 3, 4, 5].map((n) => (
          <button type="button" key={n} className={n <= rating ? 'on' : ''} aria-pressed={n <= rating}
            aria-label={`${n} estrella${n > 1 ? 's' : ''}`} onClick={() => setRating(n)}>★</button>
        ))}
      </fieldset>
      <label>Tu reseña
        <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="btn">Publicar reseña</button>
    </form>
  )
}
