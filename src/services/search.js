// US-06 Búsqueda y filtros.
// CA: resultados en menos de 1 s; tolera errores de escritura (distancia de Levenshtein).

export const normalize = (text) =>
  String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()

export function levenshtein(a, b) {
  if (a === b) return 0
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = cur
  }
  return prev[b.length]
}

// Errores permitidos según el largo de la palabra: 0 (≤3 letras), 1 (4-6) o 2 (7+).
const tolerance = (word) => (word.length <= 3 ? 0 : word.length <= 6 ? 1 : 2)

// Coincide si la palabra empieza con el texto, si se parece completa o si se parece su inicio
// (así "audifo" o "audofonos" encuentran "audífonos").
function tokenMatches(token, words) {
  const tol = tolerance(token)
  return words.some(
    (w) =>
      w.startsWith(token) ||
      levenshtein(token, w) <= tol ||
      (w.length > token.length && levenshtein(token, w.slice(0, token.length)) <= Math.min(1, tol)),
  )
}

export function matchesQuery(product, query) {
  const tokens = normalize(query).split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return true
  const words = normalize(`${product.name} ${product.brand} ${product.category}`).split(/[^a-z0-9ñ]+/).filter(Boolean)
  return tokens.every((t) => tokenMatches(t, words))
}

export function filterProducts(products, { q = '', category = '', brand = '', min = '', max = '' } = {}) {
  return products.filter(
    (p) =>
      (!category || p.category === category) &&
      (!brand || p.brand === brand) &&
      (min === '' || p.price >= Number(min)) &&
      (max === '' || p.price <= Number(max)) &&
      matchesQuery(p, q),
  )
}
