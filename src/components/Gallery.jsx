// US-03 Galería con zoom: al pasar el cursor la imagen se amplía 2x siguiendo la posición del puntero.
import { useState } from 'react'
import { imageUrl } from '../services/images'

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
        <img
          src={imageUrl(images[current])}
          alt={alt}
          style={zoom ? { transform: 'scale(2)', transformOrigin: zoom } : undefined}
        />
      </div>
      <div className="thumbs">
        {images.map((seed, i) => (
          <button key={seed} className={i === current ? 'active' : ''} onClick={() => setCurrent(i)}>
            <img src={imageUrl(seed)} alt={`${alt}, vista ${i + 1}`} />
          </button>
        ))}
      </div>
    </div>
  )
}
