export default function Stars({ value, count }) {
  const rounded = Math.round(value)
  return (
    <span className="stars" aria-label={`${value.toFixed(1)} de 5 estrellas`}>
      {'★'.repeat(rounded)}
      <span className="off">{'★'.repeat(5 - rounded)}</span>
      {count !== undefined && <span className="muted small"> ({count})</span>}
    </span>
  )
}
