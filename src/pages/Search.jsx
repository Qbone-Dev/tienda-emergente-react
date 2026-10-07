// US-06 Búsqueda y filtros por palabra, precio, marca y categoría.
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BRANDS, CATEGORIES, PRODUCTS } from '../data/products'
import { filterProducts } from '../services/search'
import ProductCard from '../components/ProductCard'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const filters = {
    q: params.get('q') ?? '',
    category: params.get('categoria') ?? '',
    brand: params.get('marca') ?? '',
    min: params.get('min') ?? '',
    max: params.get('max') ?? '',
  }

  const { results, ms } = useMemo(() => {
    const start = performance.now()
    const results = filterProducts(PRODUCTS, filters)
    return { results, ms: performance.now() - start }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    value ? next.set(key, value) : next.delete(key)
    setParams(next, { replace: true })
  }

  return (
    <section className="container">
      <h1>{filters.q ? `Resultados para “${filters.q}”` : 'Buscar productos'}</h1>
      <div className="search-layout">
        <aside className="filters" aria-label="Filtros">
          <label>Palabra clave
            <input type="search" value={filters.q} onChange={(e) => update('q', e.target.value)} />
          </label>
          <label>Categoría
            <select value={filters.category} onChange={(e) => update('categoria', e.target.value)}>
              <option value="">Todas</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Marca
            <select value={filters.brand} onChange={(e) => update('marca', e.target.value)}>
              <option value="">Todas</option>
              {BRANDS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>
          <div className="row">
            <label>Precio mín.
              <input type="number" min="0" inputMode="numeric" value={filters.min} onChange={(e) => update('min', e.target.value)} />
            </label>
            <label>Precio máx.
              <input type="number" min="0" inputMode="numeric" value={filters.max} onChange={(e) => update('max', e.target.value)} />
            </label>
          </div>
          <button className="btn ghost" onClick={() => setParams({}, { replace: true })}>Limpiar filtros</button>
        </aside>
        <div>
          <p className="muted small" aria-live="polite">
            {results.length} {results.length === 1 ? 'resultado' : 'resultados'} en {ms < 1 ? 'menos de 1' : Math.round(ms)} ms
          </p>
          {results.length === 0 ? (
            <p>No encontramos productos con esos filtros. Prueba con otra palabra o quita algún filtro.</p>
          ) : (
            <div className="grid">{results.map((p) => <ProductCard key={p.id} product={p} />)}</div>
          )}
        </div>
      </div>
    </section>
  )
}
