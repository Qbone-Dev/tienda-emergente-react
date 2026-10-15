# Tienda Emergente · React

Avance de desarrollo de la app **Tienda Emergente** (Proyecto II, UDG Virtual) construido con React 19 y Vite.
Contiene lo comprometido en los **Sprints 1, 2 y 3** del Product Backlog.

- **App funcionando:** https://Qbone-Dev.github.io/tienda-emergente-react/
- **Backlog y trazabilidad:** [BACKLOG.md](BACKLOG.md)
- **Versiones por sprint:** etiquetas [`sprint-1`](../../tree/sprint-1), [`sprint-2`](../../tree/sprint-2) y [`sprint-3`](../../tree/sprint-3)

## Qué incluye

| Sprint | Elemento | Funcionalidad | Dónde probarla |
|---|---|---|---|
| 1 | US-01 | Registro con código de verificación, login con correo y login social (demo) | `#/registro`, `#/login` |
| 1 | US-02 | Catálogo paginado por categoría | `#/` |
| 1 | US-03 | Detalle con galería y zoom, existencias y reseñas | `#/producto/p12` |
| 1 | US-04 | Carrito persistente con IVA y envío recalculados | `#/carrito` |
| 1 | US-05 | Checkout con validación de tarjeta y número de pedido | `#/checkout` |
| 2 | BUG-01 | Regresar durante el pago conserva datos y no duplica cargos | `#/checkout?paso=pago` |
| 2 | T-01 | Ícono del carrito con contraste 13.9:1 y área táctil de 48 px | encabezado |
| 2 | T-02 | Imágenes con carga diferida, `srcset` y marcador de posición | catálogo |
| 2 | US-15 | Compra como invitado e invitación a crear cuenta | `#/checkout` sin sesión |
| 2 | US-06 | Búsqueda tolerante a errores con filtros de precio, marca y categoría | `#/buscar?q=audifnos` |
| 2 | US-07 | Historial de pedidos y seguimiento con número de guía | `#/mis-pedidos` |
| 2 | US-08 | Reseñas de 1 a 5 estrellas solo de compras verificadas, con filtro de lenguaje | detalle de un producto comprado |
| 3 | US-09 | Centro de notificaciones, permiso opt-in del navegador y preferencias | `#/notificaciones` |
| 3 | US-10 | Perfil editable y direcciones; la predeterminada se precarga en el pago | `#/perfil` |
| 3 | US-11 | Favoritos desde catálogo y detalle; mover al carrito | `#/favoritos` |
| 3 | US-12 | Cupones con vigencia y monto mínimo (`BIENVENIDA10`, `OTONO150`, `ENVIOGRATIS`) | `#/carrito` |
| 3 | US-13 | Chat de soporte en horario laboral, una conversación por pedido | `#/soporte` |

Tarjeta de prueba: `4242 4242 4242 4242`, cualquier fecha futura y CVV `123`.
La tarjeta `4000 0000 0000 0002` simula un pago rechazado.

> Esta versión no tiene backend: los datos se guardan en el navegador (`localStorage`) y la API, el
> inicio de sesión social, la pasarela, el correo, el envío push desde servidor y los asesores del chat están simulados en `src/services/`. Su integración
> real es el elemento **T-05** del Sprint 4. Las fotos son imágenes de muestra de Lorem Picsum.

## Ejecutar en local

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 31 pruebas (Vitest)
npm run build    # genera dist/
```

## Estructura

```
src/
  data/        catálogo de ejemplo
  services/    lógica sin interfaz: api, auth, cart, payment, orders, search, reviews
  context/     estado global (sesión y carrito)
  components/  piezas reutilizables (encabezado, tarjeta, galería, imagen diferida…)
  pages/       una pantalla por ruta
tests/         pruebas de cada sprint
```

## Publicación

Cada `push` a `main` ejecuta las pruebas, genera el build y lo publica en GitHub Pages
(`.github/workflows/deploy.yml`). En el repositorio: *Settings → Pages → Source: GitHub Actions*.
