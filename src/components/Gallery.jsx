// US-03 Galería con zoom: al pasar el cursor la imagen se amplía 2x siguiendo la posición del puntero.
// T-02: la imagen principal se pide con prioridad alta y las miniaturas en tamaño pequeño.
import { useState } from 'react'
import LazyImage from './LazyImage'

export default function Gallery({ images, alt }) {
  const [current, setCurrent] = useState(0)
  const [zoom, setZoom] = useState(null)

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoom(`${x}% ${y}%`)
  }

  return (
    <div className="gallery">
      <div className="gallery-main" onMouseMove={onMove} onMouseLeave={() => setZoom(null)}>
        <LazyImage
          key={images[current]}
          seed={images[current]}
          alt={alt}
          eager
          sizes="(max-width: 760px) 100vw, 540px"
          style={zoom ? { transform: 'scale(2)', transformOrigin: zoom } : undefined}
        />
      </div>
      <div className="thumbs">
        {images.map((seed, i) => (
          <button key={seed} className={i === current ? 'active' : ''} onClick={() => setCurrent(i)}
            aria-label={`Ver imagen ${i + 1}`}>
            <LazyImage seed={seed} alt="" sizes="72px" />
          </button>
        ))}
      </div>
    </div>
  )
}
