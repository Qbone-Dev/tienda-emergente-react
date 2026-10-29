# Product Backlog y trazabilidad

Backlog final al 29/10/2026 (día 4 del Sprint 4): **21 elementos, 98 puntos, 568 h esperadas**.
Terminados: **18 elementos, 84 puntos (86 %)**. Parciales: T-03 y T-04. No iniciado: T-05.

- Revisión de los Sprints 1 y 2: se agregó **T-05** (integración de servicios reales) para terminar lo que quedó simulado.
- Revisión del Sprint 3: T-05 crece de 5 a 8 pts (20 h → 26 h) porque también incluye el envío push con FCM
  (US-09) y la conexión del chat con un servicio de asesores (US-13).
- Sprint 4: T-05 no se pudo iniciar (no se obtuvieron las credenciales de los proveedores) y la publicación en
  tiendas se sustituyó por una app web instalable. Lo pendiente pasa a la versión 1.1 (ver al final).

Estados: ✅ terminado · 🟡 parcial · ⛔ no iniciado · 🔜 planeado.

## Sprint 1 · 05/10/2026 al 09/10/2026 · 31 pts · 222 h

| ID | Elemento | Pts | Estado | Código | Commit |
|---|---|---|---|---|---|
| US-01 | Registro y login | 5 | ✅ | [auth.js](src/services/auth.js), [Login.jsx](src/pages/Login.jsx), [Register.jsx](src/pages/Register.jsx) | `34b107d` |
| US-02 | Catálogo / Navegación | 8 | ✅ | [Catalog.jsx](src/pages/Catalog.jsx), [api.js](src/services/api.js) | `e3ea756` |
| US-03 | Detalle de producto | 5 | ✅ | [ProductDetail.jsx](src/pages/ProductDetail.jsx), [Gallery.jsx](src/components/Gallery.jsx) | `43d111d` |
| US-04 | Carrito de compras | 5 | ✅ | [CartContext.jsx](src/context/CartContext.jsx), [cart.js](src/services/cart.js), [Cart.jsx](src/pages/Cart.jsx) | `089c4a3` |
| US-05 | Checkout / Pago | 8 | ✅ | [payment.js](src/services/payment.js), [Checkout.jsx](src/pages/Checkout.jsx) | `4d38e0d` |

## Sprint 2 · 12/10/2026 al 16/10/2026 · 24 pts · 122 h

| ID | Elemento | Pts | Estado | Código | Commit |
|---|---|---|---|---|---|
| BUG-01 | Error de "regresar" en el pago | 2 | ✅ | [Checkout.jsx](src/pages/Checkout.jsx), [payment.js](src/services/payment.js) | `1497a0e` |
| T-01 | Visibilidad del ícono del carrito | 1 | ✅ | [Header.jsx](src/components/Header.jsx) | `77658c5` |
| T-02 | Optimizar carga de imágenes | 3 | ✅ | [LazyImage.jsx](src/components/LazyImage.jsx), [images.js](src/services/images.js) | `77658c5` |
| US-15 | Checkout como invitado | 5 | ✅ | [Checkout.jsx](src/pages/Checkout.jsx), [orders.js](src/services/orders.js) | `1497a0e` |
| US-06 | Búsqueda y filtros | 5 | ✅ | [search.js](src/services/search.js), [Search.jsx](src/pages/Search.jsx) | `99ee6b2` |
| US-07 | Historial y seguimiento de pedidos | 5 | ✅ | [Orders.jsx](src/pages/Orders.jsx), [OrderConfirmation.jsx](src/pages/OrderConfirmation.jsx) | `c0856ea` |
| US-08 | Calificar y reseñar productos | 3 | ✅ | [reviews.js](src/services/reviews.js), [ReviewForm.jsx](src/components/ReviewForm.jsx) | `99ee6b2` |

## Sprint 3 · 19/10/2026 al 23/10/2026 · 21 pts · 109 h

| ID | Elemento | Pts | Estado | Código | Commit |
|---|---|---|---|---|---|
| US-09 | Notificaciones push | 5 | ✅ | [notifications.js](src/services/notifications.js), [Notifications.jsx](src/pages/Notifications.jsx) | `c111444` |
| US-10 | Perfil y direcciones | 3 | ✅ | [addresses.js](src/services/addresses.js), [Profile.jsx](src/pages/Profile.jsx) | `06526b5` |
| US-11 | Lista de deseos | 3 | ✅ | [WishButton.jsx](src/components/WishButton.jsx), [Wishlist.jsx](src/pages/Wishlist.jsx) | `2794957` |
| US-12 | Cupones y promociones | 5 | ✅ | [coupons.js](src/services/coupons.js), [Cart.jsx](src/pages/Cart.jsx) | `82076f3` |
| US-13 | Chat de soporte | 5 | ✅ | [chat.js](src/services/chat.js), [Support.jsx](src/pages/Support.jsx) | `b47157e` |

## Sprint 4 · 26/10/2026 al 30/10/2026 · 22 pts · 115 h

| ID | Elemento | Pts | Estado | Código | Commit |
|---|---|---|---|---|---|
| US-14 | Panel de administración de inventario | 8 | ✅ | [inventory.js](src/services/inventory.js), [Admin.jsx](src/pages/Admin.jsx) | `dc9c7b9` |
| T-05 | Integración de servicios reales | 8 | ⛔ | Sin credenciales de pasarela, OAuth, FCM, correo ni paquetería | — |
| T-03 | Pruebas de regresión y rendimiento | 3 | 🟡 | [regresion.mjs](e2e/regresion.mjs) 19/19 · [rendimiento.mjs](e2e/rendimiento.mjs): imagen en 3G 4.1 s (meta 1.5 s) | `2830041` |
| T-04 | Publicación | 3 | 🟡 | App web instalable y sin conexión ([sw.js](public/sw.js)); tiendas pendientes | `098143b` |

## Pendiente para la versión 1.1

| ID | Elemento | Motivo |
|---|---|---|
| T-05 | Integración de servicios reales | Requiere contratos y credenciales de los proveedores. |
| T-04 | Publicación en App Store y Google Play | Requiere cuentas de desarrollador y el SDK de Android/Xcode. |
| T-03 | Imagen principal < 1.5 s en 3G | Requiere servir las imágenes desde un CDN propio y dividir el código de la app. |

## Pruebas

`npm test` ejecuta [tests/sprint1.test.js](tests/sprint1.test.js) (7 pruebas),
[tests/sprint2.test.js](tests/sprint2.test.js) (10 pruebas), [tests/sprint3.test.js](tests/sprint3.test.js) (14 pruebas)
y [tests/sprint4.test.js](tests/sprint4.test.js) (6 pruebas). `npm run e2e` ejecuta la regresión de extremo a extremo (19 recorridos).
