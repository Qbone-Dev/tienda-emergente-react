// Imágenes de ejemplo servidas por Lorem Picsum (https://picsum.photos).
export const imageUrl = (seed, size = 1200) => `https://picsum.photos/seed/${seed}/${size}/${size}`

// T-02: tamaños adaptativos; el navegador descarga solo el ancho que necesita la pantalla.
export const IMAGE_WIDTHS = [320, 640, 1200]
export const imageSrcSet = (seed) => IMAGE_WIDTHS.map((w) => `${imageUrl(seed, w)} ${w}w`).join(', ')
