// T-03 Prueba de regresión de extremo a extremo.
// Recorre en un navegador real los flujos de los cuatro sprints sobre la versión compilada.
//
//   npm run build && npm run preview      (en otra terminal)
//   npm run e2e                           (usa Edge; BROWSER=chrome para Google Chrome)
//
// Variables: BASE (por defecto http://localhost:4173/), BROWSER (msedge | chrome).
import { chromium } from 'playwright-core'

const BASE = process.env.BASE ?? 'http://localhost:4173/'
const browser = await chromium.launch({ channel: process.env.BROWSER ?? 'msedge' })
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'es-MX' })
const page = await ctx.newPage()
const consoleErrors = []
page.on('pageerror', (e) => consoleErrors.push(e.message))
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()))

const results = []
async function check(id, name, fn) {
  const start = Date.now()
  try {
    const detail = await fn()
    results.push({ id, name, ok: true, detail: detail ?? '', ms: Date.now() - start })
  } catch (err) {
    results.push({ id, name, ok: false, detail: err.message.split('\n')[0], ms: Date.now() - start })
  }
}
const go = (hash) => page.goto(BASE + hash)
const assert = (cond, msg) => { if (!cond) throw new Error(msg) }
const text = (sel) => page.locator(sel).first().innerText()

await go('')
await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() })

// ---------- Sprint 1 ----------
await check('US-02', 'Catálogo paginado por categoría', async () => {
  await go('#/')
  await page.getByText('24 productos').waitFor()
  await page.getByRole('tab', { name: 'Hogar' }).click()
  await page.getByText('5 productos').waitFor()
  return '24 productos; filtro Hogar = 5'
})
await check('US-03', 'Detalle con existencias y reseñas', async () => {
  await go('#/producto/p01')
  await page.getByText('25 piezas disponibles').waitFor()
  assert(await page.getByText('Compra verificada').count() > 0, 'sin reseñas visibles')
  return 'existencias y reseñas visibles'
})
await check('US-04', 'Carrito con totales', async () => {
  await page.getByLabel('Cantidad').fill('2')
  await page.getByRole('button', { name: 'Agregar al carrito' }).click()
  await go('#/carrito')
  await page.getByText('$1,798.00').first().waitFor()
  return '2 × $899 = $1,798.00, envío gratis'
})

// ---------- Sprint 3 (cupón antes de pagar) ----------
await check('US-12', 'Cupón con monto mínimo', async () => {
  await page.getByLabel('¿Tienes un cupón?').fill('OTONO150')
  await page.getByRole('button', { name: 'Aplicar' }).click()
  await page.getByText('−$150.00').waitFor()
  assert((await text('.summary')).includes('$1,648.00'), 'total con descuento incorrecto')
  return 'OTONO150: −$150, total $1,648.00'
})

// ---------- Sprint 2 ----------
let orderNumber
await check('US-15', 'Compra como invitado (paso de envío)', async () => {
  await go('#/checkout')
  await page.getByLabel('Nombre de quien recibe').fill('Cliente Regresión')
  await page.getByLabel('Correo para la confirmación').fill('regresion@ejemplo.test')
  await page.getByLabel('Calle y número').fill('Av. Prueba 123')
  await page.getByLabel('Ciudad').fill('Guadalajara')
  await page.getByLabel('Código postal').fill('44100')
  await page.getByRole('button', { name: 'Continuar al pago' }).click()
  await page.getByText('2. Pago').waitFor()
  return 'sin cuenta, solo correo y dirección'
})
await check('BUG-01', '«Atrás» conserva los datos', async () => {
  await page.goBack()
  await page.getByLabel('Calle y número').waitFor()
  assert(await page.getByLabel('Calle y número').inputValue() === 'Av. Prueba 123', 'se perdió la dirección')
  await page.goForward()
  await page.getByLabel('Número').waitFor()
  return 'dirección intacta al regresar'
})
await check('US-05', 'Pago con tarjeta de prueba y doble clic', async () => {
  await page.getByLabel('Nombre en la tarjeta').fill('Cliente Regresión')
  await page.getByLabel('Número').fill('4242 4242 4242 4242')
  await page.getByLabel('Vence (MM/AA)').fill('12/30')
  await page.getByLabel('CVV').fill('123')
  await page.getByRole('button', { name: 'Pagar' }).dblclick()
  await page.getByText('¡Gracias por tu compra!').waitFor()
  orderNumber = (await text('.order-number')).trim()
  const count = await page.evaluate(() => JSON.parse(localStorage.getItem('te.orders')).length)
  assert(count === 1, `se crearon ${count} pedidos`)
  return `pedido ${orderNumber}; 1 solo pedido con doble clic`
})
await check('US-07', 'Seguimiento del pedido', async () => {
  const steps = await page.locator('.timeline li').allInnerTexts()
  assert(steps.join() === 'Pagado,Enviado,Entregado', 'línea de tiempo incompleta')
  assert(await page.locator('.timeline li.reached').count() === 1, 'estado inicial incorrecto')
  return 'línea de tiempo Pagado → Enviado → Entregado; estado actual «Pagado»'
})
await check('US-01', 'Registro con código y pedidos de invitado', async () => {
  await page.getByRole('link', { name: 'Crear cuenta' }).click()
  await page.getByLabel('Nombre').fill('Cliente Regresión')
  await page.getByLabel('Contraseña').fill('regresion2026')
  await page.getByRole('button', { name: 'Crear cuenta' }).click()
  const code = (await text('.notice strong')).trim()
  await page.getByLabel('Código').fill(code)
  await page.getByRole('button', { name: 'Confirmar' }).click()
  await go('#/mis-pedidos')
  await page.getByText(orderNumber).waitFor()
  return 'cuenta confirmada; el pedido de invitado aparece en «Mis pedidos»'
})
await check('US-06', 'Búsqueda con errores de escritura', async () => {
  await go('#/buscar?q=audifnos')
  await page.getByText('1 resultado').waitFor()
  return '«audifnos» → Audífonos inalámbricos Pulse'
})
await check('US-08', 'Reseña verificada con filtro de lenguaje', async () => {
  await go('#/producto/p01')
  await page.getByLabel('4 estrellas').click()
  await page.getByLabel('Tu reseña').fill('Es una basura de producto')
  await page.getByRole('button', { name: 'Publicar reseña' }).click()
  await page.getByText('lenguaje ofensivo').waitFor()
  await page.getByLabel('Tu reseña').fill('Buen sonido y llegaron rápido')
  await page.getByRole('button', { name: 'Publicar reseña' }).click()
  await page.getByText('Ya reseñaste este producto').waitFor()
  return 'ofensiva rechazada; válida publicada'
})

// ---------- Sprint 3 ----------
await check('US-11', 'Favoritos y mover al carrito', async () => {
  await go('#/')
  await page.getByRole('button', { name: 'Agregar Bocina portátil Wave a favoritos' }).click()
  await go('#/favoritos')
  await page.getByText('Bocina portátil Wave').waitFor()
  await page.getByRole('button', { name: 'Mover al carrito' }).click()
  await page.getByText('Aún no tienes favoritos').waitFor()
  return 'corazón → favoritos → carrito'
})
await check('US-10', 'Dirección predeterminada en el pago', async () => {
  await go('#/perfil')
  await page.getByRole('button', { name: 'Agregar dirección' }).click()
  await page.getByLabel('Nombre de la dirección').fill('Oficina')
  await page.getByLabel('Calle y número').fill('Calle Hidalgo 45')
  await page.getByLabel('Ciudad').fill('Zapopan')
  await page.getByLabel('Código postal').fill('45010')
  await page.getByRole('button', { name: 'Guardar', exact: true }).click()
  await page.getByText('Predeterminada').waitFor()
  await page.evaluate(() => sessionStorage.clear())
  await go('#/checkout')
  assert(await page.getByLabel('Calle y número').inputValue() === 'Calle Hidalgo 45', 'no se precargó')
  return 'el pago se precarga con «Oficina»'
})
await check('US-09', 'Aviso por cambio de estado', async () => {
  await go('#/notificaciones')
  await page.getByText(`Recibimos tu pedido ${orderNumber}`).waitFor({ timeout: 20000 })
  return 'aviso «Pedido pagado» en el centro de notificaciones'
})
await check('US-13', 'Chat ligado al pedido', async () => {
  await go(`#/soporte?pedido=${orderNumber}`)
  await page.getByLabel('Mensaje').fill('¿Dónde va mi envío?')
  await page.getByRole('button', { name: 'Enviar' }).click()
  await page.locator('.bubble.soporte').first().waitFor()
  return `conversación del pedido ${orderNumber} con respuesta`
})

// ---------- Sprint 4 ----------
await check('US-14', 'Inventario: acceso restringido', async () => {
  await go('#/admin')
  await page.getByText('Acceso restringido').waitFor()
  return 'un cliente no entra al panel'
})
await check('US-14', 'Inventario: existencias en vivo', async () => {
  await page.evaluate(() => localStorage.removeItem('te.session'))
  await go('#/login')
  await page.getByLabel('Correo').fill('admin@tiendaemergente.mx')
  await page.getByLabel('Contraseña').fill('Admin2026')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await go('#/admin')
  await page.getByLabel('Existencias de Tenis urbanos Classic').fill('0')
  await page.getByRole('button', { name: 'Guardar' }).first().click()
  const start = Date.now()
  await go('#/producto/p12')
  await page.getByText('Agotado').waitFor()
  return `stock 0 visible en la tienda en ${Date.now() - start} ms`
})
await check('T-01', 'Vista móvil sin desplazamiento horizontal', async () => {
  await page.setViewportSize({ width: 375, height: 812 })
  const bad = []
  for (const h of ['#/', '#/carrito', '#/buscar?q=tenis', '#/admin', '#/perfil', '#/soporte']) {
    await go(h)
    await page.waitForTimeout(300)
    const [sw, w] = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth])
    if (sw > w + 2) bad.push(`${h} (${sw}px)`)
  }
  assert(bad.length === 0, 'desborde en ' + bad.join(', '))
  return '6 pantallas a 375 px sin desborde'
})
await check('T-03', 'Sin errores en la consola', async () => {
  assert(consoleErrors.length === 0, consoleErrors.join(' | '))
  return '0 errores durante todo el recorrido'
})

await browser.close()

const passed = results.filter((r) => r.ok).length
console.log(JSON.stringify({ base: BASE, date: new Date().toISOString(), passed, total: results.length, results }, null, 2))
process.exit(passed === results.length ? 0 : 1)
