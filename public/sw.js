// T-04 Service worker: permite instalar la app y abrirla sin conexión.
// Las páginas usan «red primero» (siempre la versión más reciente si hay conexión) y los archivos
// de la app «caché primero». Las imágenes de muestra de otro dominio no se guardan.
const CACHE = 'tienda-v1'
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((cache) => cache.put('./index.html', copy))
          return res
        })
        .catch(() => caches.match('./index.html')),
    )
    return
  }

  event.respondWith(
    caches.match(request).then((hit) => hit || fetch(request).then((res) => {
      if (res.ok) {
        const copy = res.clone()
        caches.open(CACHE).then((cache) => cache.put(request, copy))
      }
      return res
    })),
  )
})
