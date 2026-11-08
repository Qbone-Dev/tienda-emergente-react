# Tienda Emergente · React

App **Tienda Emergente** (Proyecto II, UDG Virtual) construida con React 19 y Vite.
Versión **1.0.0**: los cuatro sprints del proyecto más las modificaciones de la reunión de revisión (M-01 a M-12).

- **App funcionando:** https://Qbone-Dev.github.io/tienda-emergente-react/
- **Manual de uso:** [docs/MANUAL.md](docs/MANUAL.md)
- **Backlog y trazabilidad:** [BACKLOG.md](BACKLOG.md)
- **Versiones por sprint:** etiquetas [`sprint-1`](../../tree/sprint-1), [`sprint-2`](../../tree/sprint-2), [`sprint-3`](../../tree/sprint-3) y [`sprint-4`](../../tree/sprint-4)

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
| 4 | US-14 | Panel de inventario: alta, edición, baja y existencias en vivo (solo administradores) | `#/admin` |
| 4 | T-03 | Regresión de extremo a extremo y medición de rendimiento en 3G | `npm run e2e` |
| 4 | T-04 | App instalable (manifiesto y service worker) y registro de errores | menú del navegador → Instalar |
| Rev. | M-05 | Aviso de privacidad y términos de uso; borrar los datos del navegador | `#/privacidad`, `#/terminos` |
| Rev. | M-06 | Pantallas con carga diferida (React.lazy) | — |
| Rev. | M-11 | 16 pantallas sin problemas de accesibilidad (axe-core, WCAG 2.2 AA) | `npm run a11y` |

Tarjeta de prueba: `4242 4242 4242 4242`, cualquier fecha futura y CVV `123`.
La tarjeta `4000 0000 0000 0002` simula un pago rechazado.
Cuenta de administración: `admin@tiendaemergente.mx`. La contraseña no está en el repositorio (M-03): se configura
su huella en `.env.local` (ver [.env.example](.env.example)); sin ella el panel de inventario queda cerrado.

> Esta versión no tiene backend: los datos se guardan en el navegador (`localStorage`) y la API, el
> inicio de sesión social, la pasarela, el correo, el envío push desde servidor y los asesores del chat están simulados en `src/services/`. Su integración
> real (elemento **T-05**) queda para la versión 1.1. Las fotos son imágenes de muestra de Lorem Picsum.

## Ejecutar en local

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 39 pruebas (Vitest)
npm run build    # genera dist/
npm run preview  # sirve dist/ en http://localhost:4173
npm run e2e      # 19 recorridos en navegador (con preview encendido; usa Edge, BROWSER=chrome para Chrome)
npm run a11y     # revisión de accesibilidad de las 16 pantallas (con preview encendido)
```

## Estructura

```
src/
  data/        catálogo de ejemplo
  services/    lógica sin interfaz (16 servicios: api, auth, cart, payment, orders, inventory…)
  context/     estado global (sesión, carrito, favoritos y avisos)
  components/  piezas reutilizables (encabezado, tarjeta, galería, imagen diferida…)
  pages/       una pantalla por ruta (15 pantallas)
tests/         pruebas unitarias de cada sprint
e2e/           regresión, rendimiento y accesibilidad en navegador
docs/          manual de uso
```

## Publicación

Cada `push` a `main` ejecuta las pruebas unitarias y la regresión en Chrome, genera el build y lo publica en
GitHub Pages (`.github/workflows/deploy.yml`). En el repositorio: *Settings → Pages → Source: GitHub Actions*.
Para habilitar el panel de inventario en la versión publicada, guarda la huella de la contraseña como secreto
`ADMIN_PASSWORD_SHA256` (*Settings → Secrets and variables → Actions*).

## Licencia

[MIT](LICENSE) © 2026 Jesús Ismael Baltazar Berumen
