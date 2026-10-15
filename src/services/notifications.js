// US-09 Notificaciones.
// CA: permiso opt-in; aviso en cada cambio de estado del pedido; preferencias configurables.
// En esta versión los avisos se generan en el navegador (Notification API + centro de avisos en la app);
// el envío desde servidor con FCM/APNs se conecta en T-05.
import { load, save } from './storage'
import { getOrdersByUser, orderStatus, STATUSES } from './orders'

const prefsKey = (uid) => `te.notif.prefs.${uid}`
const listKey = (uid) => `te.notif.list.${uid}`
const seenKey = (uid) => `te.notif.seen.${uid}`

export const DEFAULT_PREFS = { orders: true, promos: false }
export const PROMO = { id: 'promo-OTONO150', title: 'Promoción de otoño', body: 'Usa el cupón OTONO150 y ahorra $150 en compras desde $1,500.', link: '/carrito' }

export const getPrefs = (uid) => ({ ...DEFAULT_PREFS, ...load(prefsKey(uid), {}) })
export const savePrefs = (uid, prefs) => save(prefsKey(uid), prefs)
export const getNotifications = (uid) => load(listKey(uid), [])

const label = (key) => STATUSES.find((s) => s.key === key).label.toLowerCase()
const MESSAGES = {
  pagado: (o) => `Recibimos tu pedido ${o.number} y el pago fue aprobado.`,
  enviado: (o) => `Tu pedido ${o.number} va en camino.`,
  entregado: (o) => `Tu pedido ${o.number} fue entregado. ¿Nos dejas una reseña?`,
}

// Compara el estado actual de cada pedido con el último que se avisó. Función pura para poder probarla.
// Un pedido que aún no se había visto solo genera aviso si se creó en las últimas 24 h (evita avisos viejos).
export function diffStatuses(orders, seen, now = new Date()) {
  const changes = []
  for (const o of orders) {
    const status = orderStatus(o, now)
    const before = seen[o.number]
    const isRecent = now - new Date(o.createdAt) < 24 * 3600 * 1000
    if (before !== status && (before !== undefined || isRecent)) changes.push({ order: o, status })
  }
  return changes
}

function push(uid, items) {
  if (!items.length) return getNotifications(uid)
  const list = [...items, ...getNotifications(uid)].slice(0, 50)
  save(listKey(uid), list)
  return list
}

function showInBrowser(n) {
  try {
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(n.title, { body: n.body, tag: n.id })
    }
  } catch {
    /* el navegador no permite avisos */
  }
}

// Revisa pedidos y promociones; devuelve la lista actualizada de avisos.
export function checkForUpdates(user, now = new Date()) {
  const uid = user.id
  const prefs = getPrefs(uid)
  const seen = load(seenKey(uid), {})
  const fresh = []

  for (const { order, status } of diffStatuses(getOrdersByUser(uid), seen, now)) {
    seen[order.number] = status
    if (prefs.orders) {
      fresh.push({
        id: `${order.number}-${status}`,
        title: `Pedido ${label(status)}`,
        body: MESSAGES[status](order),
        link: `/pedido/${order.number}`,
        date: now.toISOString(),
        read: false,
      })
    }
  }
  save(seenKey(uid), seen)

  const list = getNotifications(uid)
  if (prefs.promos && !list.some((n) => n.id === PROMO.id)) {
    fresh.push({ ...PROMO, date: now.toISOString(), read: false })
  }

  fresh.forEach(showInBrowser)
  return push(uid, fresh)
}

export function markAllRead(uid) {
  const list = getNotifications(uid).map((n) => ({ ...n, read: true }))
  save(listKey(uid), list)
  return list
}

export const browserPermission = () => (typeof Notification === 'undefined' ? 'unsupported' : Notification.permission)

export async function requestBrowserPermission() {
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.requestPermission()
}
