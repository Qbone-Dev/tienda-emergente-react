import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import RequireAuth from './components/RequireAuth'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="/pedido/:number" element={<OrderConfirmation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="*" element={<p className="container">Página no encontrada.</p>} />
        </Routes>
      </main>
      <footer className="footer container muted small">
        Tienda Emergente · Proyecto II · Avance de desarrollo con React
      </footer>
    </>
  )
}
