// M-05 Aviso de privacidad y términos de uso.
// La app guarda datos personales en el navegador; estas pantallas lo informan y permiten borrarlos.
import { useState } from 'react'
import { Link } from 'react-router-dom'

const UPDATED = '8 de noviembre de 2026'

export function Privacy() {
  const [cleared, setCleared] = useState(false)

  const clearData = () => {
    try {
      Object.keys(localStorage).filter((k) => k.startsWith('te.')).forEach((k) => localStorage.removeItem(k))
      Object.keys(sessionStorage).filter((k) => k.startsWith('te.')).forEach((k) => sessionStorage.removeItem(k))
    } catch {
      /* el navegador bloquea el almacenamiento: no hay nada guardado */
    }
    setCleared(true)
    setTimeout(() => window.location.reload(), 1200)
  }

  return (
    <section className="container narrow-wide legal">
      <h1>Aviso de privacidad</h1>
      <p className="muted small">Última actualización: {UPDATED}</p>
      <h2>Qué datos usamos</h2>
      <ul>
        <li>Nombre, correo y contraseña de tu cuenta. La contraseña se guarda cifrada (SHA-256 con sal), nunca en texto.</li>
        <li>Direcciones de envío, pedidos, carrito, favoritos, reseñas, avisos y conversaciones de soporte.</li>
        <li>De la tarjeta solo se conservan los últimos 4 dígitos; el número completo y el CVV no se guardan.</li>
      </ul>
      <h2>Dónde se guardan</h2>
      <p>
        En esta versión todo se guarda únicamente en el almacenamiento de tu navegador (localStorage) y en este dispositivo.
        No se envía a ningún servidor ni se comparte con terceros. Las fotos de los productos se descargan de un servicio
        externo de imágenes de muestra, que solo recibe la solicitud de la imagen.
      </p>
      <h2>Para qué se usan</h2>
      <p>Para mantener tu sesión, procesar tus pedidos de demostración, mostrarte su seguimiento y enviarte los avisos que elijas.</p>
      <h2>Tus derechos</h2>
      <p>
        Puedes consultar y corregir tus datos en <Link to="/perfil">Mi perfil</Link>, y borrar todo lo que la tienda guardó
        en este navegador con el botón siguiente. Para cualquier duda, escríbenos desde <Link to="/soporte">Soporte</Link>.
      </p>
      <button className="btn ghost" onClick={clearData} disabled={cleared}>
        {cleared ? 'Datos borrados. Recargando…' : 'Borrar mis datos de este navegador'}
      </button>
    </section>
  )
}

export function Terms() {
  return (
    <section className="container narrow-wide legal">
      <h1>Términos de uso</h1>
      <p className="muted small">Última actualización: {UPDATED}</p>
      <h2>Versión de demostración</h2>
      <p>
        Tienda Emergente 1.0 es una versión de demostración: los pagos, el inicio de sesión con Google y Facebook, los correos,
        la paquetería y los asesores del chat están simulados. Ningún pedido genera cargos ni envíos reales.
      </p>
      <h2>Cuenta</h2>
      <p>Eres responsable de la contraseña de tu cuenta. Una cuenta por persona; no se permite usar el correo de otra persona.</p>
      <h2>Precios, existencias y cupones</h2>
      <ul>
        <li>Los precios están en pesos mexicanos e incluyen IVA. El envío es gratis desde $999 después de descuentos.</li>
        <li>Las existencias pueden cambiar; un producto agotado o dado de baja se retira del carrito.</li>
        <li>Cada cupón aplica dentro de su vigencia y desde su monto mínimo, y se retira si el carrito deja de cumplirlos. Los cupones no se combinan.</li>
      </ul>
      <h2>Reseñas</h2>
      <p>Solo pueden reseñar quienes compraron el producto. Las reseñas con lenguaje ofensivo no se publican.</p>
      <p>
        Consulta también el <Link to="/privacidad">Aviso de privacidad</Link>.
      </p>
    </section>
  )
}
