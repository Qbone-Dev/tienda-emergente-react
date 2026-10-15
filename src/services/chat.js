// US-13 Chat de soporte.
// CA: chat en horario laboral; historial de conversación ligado al pedido.
// Las respuestas las da un asistente con respuestas frecuentes; la conexión con un asesor real
// (servicio de chat externo) se hace en T-05.
import { load, save } from './storage'
import { orderStatus, trackingNumber } from './orders'

export const HOURS = { days: [1, 2, 3, 4, 5], open: 9, close: 18 } // lunes a viernes, 9:00 a 18:00
export const GENERAL = 'general'

export function isOpen(date = new Date()) {
  const h = date.getHours() + date.getMinutes() / 60
  return HOURS.days.includes(date.getDay()) && h >= HOURS.open && h < HOURS.close
}

export const hoursText = 'lunes a viernes de 9:00 a 18:00'

const key = (uid) => `te.chat.${uid}`

export const getConversation = (uid, topic) => load(key(uid), {})[topic] ?? []

export function topicsWithMessages(uid) {
  return Object.keys(load(key(uid), {}))
}

function append(uid, topic, message) {
  const all = load(key(uid), {})
  all[topic] = [...(all[topic] ?? []), message]
  save(key(uid), all)
  return all[topic]
}

export function sendMessage(uid, topic, text, now = new Date()) {
  const clean = text.trim()
  if (!clean) throw new Error('Escribe tu mensaje.')
  return append(uid, topic, { from: 'cliente', text: clean, date: now.toISOString() })
}

const has = (text, words) => words.some((w) => text.includes(w))
const normalize = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

// Respuesta automática según el horario y el tema del mensaje.
export function replyFor(text, { now = new Date(), order = null } = {}) {
  if (!isOpen(now)) {
    return `Gracias por escribirnos. Nuestro horario de atención es ${hoursText}; un asesor te responderá en cuanto abramos y tu mensaje queda guardado aquí.`
  }
  const t = normalize(text)
  if (order && has(t, ['envio', 'guia', 'llega', 'donde', 'rastreo', 'estado'])) {
    const status = orderStatus(order, now)
    return status === 'pagado'
      ? `Tu pedido ${order.number} está pagado y lo estamos preparando; el número de guía aparecerá cuando salga.`
      : `Tu pedido ${order.number} está ${status === 'enviado' ? 'en camino' : 'entregado'}. Número de guía: ${trackingNumber(order)}.`
  }
  if (has(t, ['devol', 'cambio', 'reembolso'])) {
    return 'Tienes 30 días naturales para devolver un producto sin usar. Indícanos el pedido y el motivo, y te enviamos la guía de devolución.'
  }
  if (has(t, ['factura', 'rfc', 'cfdi'])) {
    return 'Para facturar, envíanos tu RFC, razón social, código postal fiscal y uso de CFDI. La factura llega a tu correo en 24 h hábiles.'
  }
  if (has(t, ['pago', 'cobro', 'tarjeta', 'cargo'])) {
    return 'Los pagos se procesan al momento. Si ves un cargo que no reconoces, dinos los últimos 4 dígitos de la tarjeta y la fecha.'
  }
  return 'Gracias, recibimos tu mensaje. Un asesor lo revisará y te responderá en este mismo chat.'
}

export function addReply(uid, topic, text, now = new Date()) {
  return append(uid, topic, { from: 'soporte', text, date: now.toISOString() })
}
