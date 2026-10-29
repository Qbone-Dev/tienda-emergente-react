// Imágenes de ejemplo servidas por Lorem Picsum (https://picsum.photos).
// T-03: se piden en WebP (≈ 30-45 % menos peso que JPEG), resultado de la prueba de rendimiento en 3G.
export const imageUrl = (seed, size = 1200) => `https://picsum.photos/seed/${seed}/${size}/${size}.webp`

// T-02: tamaños adaptativos; el navegador descarga solo el ancho que necesita la pantalla.
export const IMAGE_WIDTHS = [320, 640, 960, 1200]
export const imageSrcSet = (seed) => IMAGE_WIDTHS.map((w) => `${imageUrl(seed, w)} ${w}w`).join(', ')
