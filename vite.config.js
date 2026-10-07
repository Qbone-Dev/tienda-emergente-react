import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' permite publicar el build en GitHub Pages dentro de /tienda-emergente-react/
export default defineConfig({
  plugins: [react()],
  base: './',
  test: { environment: 'node' },
})
