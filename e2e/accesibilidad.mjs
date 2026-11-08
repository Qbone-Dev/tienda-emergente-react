// M-11 Revisión automática de accesibilidad (axe-core, reglas WCAG 2.2 A y AA) en todas las pantallas.
//
//   npm run build && npm run preview      (en otra terminal)
//   npm run a11y
import { createRequire } from 'node:module'
import { chromium } from 'playwright-core'

const require = createRequire(import.meta.url)
const AXE = require('axe-core').source
const BASE = process.env.BASE ?? 'http://localhost:4173/'

const cliente = { id: 'u-a11y', name: 'Cliente Prueba', email: 'prueba@ejemplo.test', provider: 'correo', role: 'cliente' }
const admin = { id: 'u-admin', name: 'Administración', email: 'admin@tiendaemergente.mx', provider: 'correo', role: 'admin' }
const order = { number: 'TE-20261108-00001', createdAt: new Date().toISOString(), userId: cliente.id, guest: false, email: cliente.email,
  items: [{ id: 'p12', name: 'Tenis urbanos Classic', price: 1299, qty: 1 }], address: { street: 'Av. Prueba 123', city: 'Guadalajara', zip: '44100' }, total: 1299, cardLast4: '4242' }

const SCREENS = [
  ['Catálogo', '#/', null],
  ['Detalle de producto', '#/producto/p12', cliente],
  ['Búsqueda', '#/buscar?q=tenis', null],
  ['Carrito', '#/carrito', null],
  ['Pago', '#/checkout', null],
  ['Pedido y seguimiento', `#/pedido/${order.number}`, cliente],
  ['Mis pedidos', '#/mis-pedidos', cliente],
  ['Inicio de sesión', '#/login', null],
  ['Registro', '#/registro', null],
  ['Perfil', '#/perfil', cliente],
  ['Favoritos', '#/favoritos', cliente],
  ['Notificaciones', '#/notificaciones', cliente],
  ['Soporte', '#/soporte', cliente],
  ['Inventario', '#/admin', admin],
  ['Aviso de privacidad', '#/privacidad', null],
  ['Términos de uso', '#/terminos', null],
]

const browser = await chromium.launch({ channel: process.env.BROWSER ?? 'msedge' })
const report = []
for (const [name, hash, session] of SCREENS) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'es-MX' })
  await ctx.addInitScript(([s, o]) => {
    if (sessionStorage.getItem('seeded')) return
    sessionStorage.setItem('seeded', '1')
    localStorage.clear()
    if (s) localStorage.setItem('te.session', JSON.stringify(s))
    localStorage.setItem('te.orders', JSON.stringify([o]))
    localStorage.setItem('te.cart', JSON.stringify([{ id: 'p01', qty: 1 }]))
    localStorage.setItem(`te.wishlist.${o.userId}`, JSON.stringify(['p02']))
  }, [session, order])
  const page = await ctx.newPage()
  await page.goto(BASE + hash)
  await page.waitForTimeout(1200)
  await page.addScriptTag({ content: AXE })
  const result = await page.evaluate(async () => {
    const r = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } })
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, target: v.nodes[0]?.target?.join(' ') }))
  })
  report.push({ name, hash, violations: result })
  await ctx.close()
}
await browser.close()

const severe = report.flatMap((s) => s.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => ({ screen: s.name, ...v })))
console.log(JSON.stringify({ date: new Date().toISOString(), screens: report.length, severe: severe.length, report }, null, 2))
process.exit(severe.length ? 1 : 0)
