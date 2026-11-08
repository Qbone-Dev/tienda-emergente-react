// M-06 Cada pantalla se descarga solo cuando se visita (React.lazy). El catálogo y el detalle de producto van en el
// archivo inicial: son las páginas a las que se llega desde enlaces y, cargadas aparte, retrasaban la imagen en 3G.
import { lazy, Suspense } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import RequireAuth from './components/RequireAuth'
import RequireAdmin from './components/RequireAdmin'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'

const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Search = lazy(() => import('./pages/Search'))
const Orders = lazy(() => import('./pages/Orders'))
const Profile = lazy(() => import('./pages/Profile'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Support = lazy(() => import('./pages/Support'))
const Admin = lazy(() => import('./pages/Admin'))
const Privacy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacy })))
const Terms = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terms })))

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<p className="container muted">Cargando…</p>}>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          {/* US-15: el checkout ya no exige sesión (compra como invitado) */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/buscar" element={<Search />} />
          <Route path="/mis-pedidos" element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path="/favoritos" element={<RequireAuth><Wishlist /></RequireAuth>} />
          <Route path="/notificaciones" element={<RequireAuth><Notifications /></RequireAuth>} />
          <Route path="/soporte" element={<RequireAuth><Support /></RequireAuth>} />
          <Route path="/admin" element={<RequireAdmin><Admin /></RequireAdmin>} />
          <Route path="/perfil" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/pedido/:number" element={<OrderConfirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/privacidad" element={<Privacy />} />
          <Route path="/terminos" element={<Terms />} />
          <Route path="*" element={<p className="container">Página no encontrada.</p>} />
        </Routes>
        </Suspense>
      </main>
      <footer className="footer container muted small">
        Tienda Emergente 1.0 · Proyecto II · <Link to="/soporte">Soporte</Link> · <Link to="/privacidad">Aviso de privacidad</Link> · <Link to="/terminos">Términos de uso</Link>
      </footer>
    </>
  )
}
