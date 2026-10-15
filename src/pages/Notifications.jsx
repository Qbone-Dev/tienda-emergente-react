// US-09 Centro de notificaciones, permiso opt-in y preferencias.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../context/NotificationsContext'
import { browserPermission, getPrefs, requestBrowserPermission, savePrefs } from '../services/notifications'

const PERMISSION_TEXT = {
  granted: 'Activados en este navegador.',
  denied: 'Bloqueados en este navegador. Puedes cambiarlo en la configuración del sitio; mientras tanto verás los avisos aquí.',
  default: 'Aún no los activas. Solo te pediremos permiso cuando presiones el botón.',
  unsupported: 'Tu navegador no admite avisos; los verás en esta pantalla.',
}

export default function Notifications() {
  const { user } = useAuth()
  const { items, readAll, refresh } = useNotifications()
  const [prefs, setPrefs] = useState(() => getPrefs(user.id))
  const [permission, setPermission] = useState(browserPermission)

  const update = (key) => {
    const next = { ...prefs, [key]: !prefs[key] }
    setPrefs(next)
    savePrefs(user.id, next)
    refresh()
  }

  const ask = async () => setPermission(await requestBrowserPermission())

  return (
    <section className="container narrow-wide">
      <h1>Notificaciones</h1>

      <div className="panel">
        <h2 className="panel-title">Avisos en este dispositivo</h2>
        <p className="muted small">{PERMISSION_TEXT[permission]}</p>
        {permission === 'default' && <button className="btn" onClick={ask}>Activar avisos</button>}
      </div>

      <div className="panel">
        <h2 className="panel-title">¿De qué quieres enterarte?</h2>
        <label className="toggle">
          <input type="checkbox" checked={prefs.orders} onChange={() => update('orders')} />
          Cambios de estado de mis pedidos
        </label>
        <label className="toggle">
          <input type="checkbox" checked={prefs.promos} onChange={() => update('promos')} />
          Promociones y cupones
        </label>
      </div>

      <div className="section-head">
        <h2>Recientes</h2>
        {items.some((n) => !n.read) && <button className="link" onClick={readAll}>Marcar todo como leído</button>}
      </div>
      {items.length === 0 ? (
        <p className="muted">No tienes avisos todavía.</p>
      ) : (
        <ul className="notif-list">
          {items.map((n) => (
            <li key={n.id} className={n.read ? '' : 'unread'}>
              <Link to={n.link}>
                <strong>{n.title}</strong>
                <span>{n.body}</span>
                <span className="muted small">
                  {new Date(n.date).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
