# Product Backlog y trazabilidad

Backlog actualizado después de la revisión de los Sprints 1 y 2: **21 elementos, 95 puntos, 562 h esperadas**.
El cambio respecto a la versión anterior (20 elementos, 90 pts, 542 h) es el elemento **T-05**, que se agregó
para terminar las integraciones que en los Sprints 1 y 2 quedaron simuladas.

Estados: ✅ terminado · 🔜 planeado.

## Sprint 1 · 05/10/2026 al 09/10/2026 · 31 pts · 222 h

| ID | Elemento | Pts | Estado | Código | Commit |
|---|---|---|---|---|---|
| US-01 | Registro y login | 5 | ✅ | [auth.js](src/services/auth.js), [Login.jsx](src/pages/Login.jsx), [Register.jsx](src/pages/Register.jsx) | `bb8c5cf` |
| US-02 | Catálogo / Navegación | 8 | ✅ | [Catalog.jsx](src/pages/Catalog.jsx), [api.js](src/services/api.js) | `93bfee2` |
| US-03 | Detalle de producto | 5 | ✅ | [ProductDetail.jsx](src/pages/ProductDetail.jsx), [Gallery.jsx](src/components/Gallery.jsx) | `e42e143` |
| US-04 | Carrito de compras | 5 | ✅ | [CartContext.jsx](src/context/CartContext.jsx), [cart.js](src/services/cart.js), [Cart.jsx](src/pages/Cart.jsx) | `6bf7f75` |
| US-05 | Checkout / Pago | 8 | ✅ | [payment.js](src/services/payment.js), [Checkout.jsx](src/pages/Checkout.jsx) | `efb0e52` |

## Sprint 2 · 12/10/2026 al 16/10/2026 · 24 pts · 122 h

| ID | Elemento | Pts | Estado | Código | Commit |
|---|---|---|---|---|---|
| BUG-01 | Error de "regresar" en el pago | 2 | ✅ | [Checkout.jsx](src/pages/Checkout.jsx), [payment.js](src/services/payment.js) | `90b0e41` |
| T-01 | Visibilidad del ícono del carrito | 1 | ✅ | [Header.jsx](src/components/Header.jsx) | `99a8345` |
| T-02 | Optimizar carga de imágenes | 3 | ✅ | [LazyImage.jsx](src/components/LazyImage.jsx), [images.js](src/services/images.js) | `99a8345` |
| US-15 | Checkout como invitado | 5 | ✅ | [Checkout.jsx](src/pages/Checkout.jsx), [orders.js](src/services/orders.js) | `90b0e41` |
| US-06 | Búsqueda y filtros | 5 | ✅ | [search.js](src/services/search.js), [Search.jsx](src/pages/Search.jsx) | `fe71d69` |
| US-07 | Historial y seguimiento de pedidos | 5 | ✅ | [Orders.jsx](src/pages/Orders.jsx), [OrderConfirmation.jsx](src/pages/OrderConfirmation.jsx) | `a8ed98e` |
| US-08 | Calificar y reseñar productos | 3 | ✅ | [reviews.js](src/services/reviews.js), [ReviewForm.jsx](src/components/ReviewForm.jsx) | `fe71d69` |

## Sprint 3 · 19/10/2026 al 23/10/2026 · 21 pts · 109 h

| ID | Elemento | Pts | Estado | Depende de |
|---|---|---|---|---|
| US-09 | Notificaciones push | 5 | 🔜 | US-07 |
| US-10 | Perfil y direcciones | 3 | 🔜 | US-01 |
| US-11 | Lista de deseos | 3 | 🔜 | US-01, US-03 |
| US-12 | Cupones y promociones | 5 | 🔜 | US-04, US-05 |
| US-13 | Chat de soporte | 5 | 🔜 | US-01 |

## Sprint 4 · 26/10/2026 al 30/10/2026 · 19 pts · 109 h

| ID | Elemento | Pts | Estado | Depende de |
|---|---|---|---|---|
| US-14 | Panel de administración de inventario | 8 | 🔜 | US-02 |
| T-05 | Integración de servicios reales (OAuth, pasarela en sandbox, correo y paquetería) | 5 | 🔜 | US-01, US-05, US-07 |
| T-03 | Pruebas de regresión y rendimiento | 3 | 🔜 | US-14, T-05 |
| T-04 | Publicación en tiendas | 3 | 🔜 | T-03 |

## Pruebas

`npm test` ejecuta [tests/sprint1.test.js](tests/sprint1.test.js) (7 pruebas) y
[tests/sprint2.test.js](tests/sprint2.test.js) (10 pruebas).
