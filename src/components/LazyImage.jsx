// T-02 Optimizar carga de imágenes: carga diferida, tamaños adaptativos y marcador de posición.
// CA: imagen principal en menos de 1.5 s en red 3G.
import { useState } from 'react'
import { imageSrcSet, imageUrl } from '../services/images'

export default function LazyImage({ seed, alt, sizes = '(max-width: 760px) 50vw, 260px', eager = false, className = '', style }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <span className={`lazy-img ${loaded ? 'is-loaded' : ''} ${className}`}>
      <img
        src={imageUrl(seed, 640)}
        srcSet={imageSrcSet(seed)}
        sizes={sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        width="640"
        height="640"
        style={style}
        onLoad={() => setLoaded(true)}
      />
    </span>
  )
}
