// T-03 Pruebas de rendimiento y T-04 verificación de la app instalable (PWA).
// Mide, con caché vacía, cuánto tarda en verse la imagen principal del detalle de producto
// en red 3G simulada (perfil «Fast 3G» de Chrome DevTools) y sin limitar la red.
//
//   npm run build && npm run preview      (en otra terminal)
//   node e2e/rendimiento.mjs
import { chromium } from 'playwright-core'

const BASE = process.env.BASE ?? 'http://localhost:4173/'
const RUNS = 5
const FAST_3G = { offline: false, latency: 562.5, downloadThroughput: (1.6 * 1024 * 1024 / 8) * 0.9, uploadThroughput: (750 * 1024 / 8) * 0.9 }
const browser = await chromium.launch({ channel: process.env.BROWSER ?? 'msedge' })

async function measure(network) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true })
  const page = await ctx.newPage()
  if (network) {
    const cdp = await ctx.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.emulateNetworkConditions', network)
  }
  await page.goto(BASE + '#/producto/p12', { waitUntil: 'commit' })
  const img = page.locator('.gallery-main img')
  await img.waitFor()
  await page.waitForFunction(() => {
    const i = document.querySelector('.gallery-main img')
    return i && i.complete && i.naturalWidth > 0
  }, null, { timeout: 60000 })
  const r = await page.evaluate(() => {
    const i = document.querySelector('.gallery-main img')
    const entry = performance.getEntriesByType('resource').find((e) => e.name === i.currentSrc)
    const nav = performance.getEntriesByType('navigation')[0]
    return {
      appReady: Math.round(nav.loadEventEnd), // HTML + JS + CSS de la app
      imageRequest: entry ? Math.round(entry.startTime) : null, // cuándo se pidió la imagen
      imageDuration: entry ? Math.round(entry.duration) : null, // descarga de la imagen
      imageDone: entry ? Math.round(entry.responseEnd) : null,
      width: i.naturalWidth,
    }
  })
  await ctx.close()
  return r
}

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)]
const summary = {}
for (const [name, network] of [['sin_limite', null], ['fast_3g', FAST_3G]]) {
  const runs = []
  for (let i = 0; i < RUNS; i++) runs.push(await measure(network))
  summary[name] = {
    runs,
    mediana: Object.fromEntries(['appReady', 'imageRequest', 'imageDuration', 'imageDone'].map((k) => [k, median(runs.map((r) => r[k]))])),
  }
}

// T-04: instalable y sin conexión
const ctx = await browser.newContext()
const page = await ctx.newPage()
await page.goto(BASE)
const manifest = await page.evaluate(async () => {
  const href = document.querySelector('link[rel=manifest]').href
  const m = await (await fetch(href)).json()
  return { name: m.name, display: m.display, icons: m.icons.length }
})
await page.evaluate(() => navigator.serviceWorker.ready)
await page.reload()
await ctx.setOffline(true)
await page.reload()
const offlineOk = await page.getByText('Catálogo').first().isVisible()
await ctx.setOffline(false)
await browser.close()

console.log(JSON.stringify({ base: BASE, date: new Date().toISOString(), fast3g: FAST_3G, summary, pwa: { manifest, serviceWorker: true, offlineOk } }, null, 2))
