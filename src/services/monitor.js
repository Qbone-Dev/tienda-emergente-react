// T-04 Monitoreo de errores: guarda los últimos errores no controlados para revisarlos desde el panel.
// Al conectar el backend (T-05) estos registros se enviarán a un servicio de monitoreo.
import { load, save } from './storage'

const KEY = 'te.errors'
const MAX = 20

export const getErrors = () => load(KEY, [])

export function logError(message, source = '') {
  const entry = { message: String(message).slice(0, 300), source: String(source).slice(0, 200), date: new Date().toISOString() }
  save(KEY, [entry, ...getErrors()].slice(0, MAX))
  return entry
}

export const clearErrors = () => save(KEY, [])

export function startMonitoring() {
  window.addEventListener('error', (e) => logError(e.message, `${e.filename ?? ''}:${e.lineno ?? ''}`))
  window.addEventListener('unhandledrejection', (e) => logError(e.reason?.message ?? e.reason, 'promesa'))
}

// T-04 Registra el service worker solo en la versión publicada (no en desarrollo).
export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => logError(err.message, 'service worker'))
  })
}
