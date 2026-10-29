// US-02 Catálogo / Navegación: listado paginado por categoría.
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES } from '../data/products'
import { getProducts } from '../services/api'
import ProductCard from '../components/ProductCard'
import useInventoryVersion from '../hooks/useInventory'
import Pagination from '../components/Pagination'

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const category = params.get('categoria') ?? 'Todas'
  const page = Number(params.get('pagina') ?? 1)
  const [data, setData] = useState(null)
  const inventory = useInventoryVersion()

  useEffect(() => {
    let alive = true
    getProducts({ category, page }).then((res) => alive && setData(res))
    return () => {
      alive = false
    }
  }, [category, page, inventory])

  const go = (next) => setParams({ categoria: next.category ?? category, pagina: String(next.page ?? 1) })

  return (
    <section className="container">
      <h1>Catálogo</h1>
      <div className="chips" role="tablist">
        {['Todas', ...CATEGORIES].map((c) => (
          <button key={c} role="tab" aria-selected={c === category} className={c === category ? 'chip active' : 'chip'}
            onClick={() => go({ category: c, page: 1 })}>
            {c}
          </button>
        ))}
      </div>
      {!data ? (
        <p className="muted">Cargando productos…</p>
      ) : (
        <>
          <p className="muted small">{data.total} productos</p>
          <div className="grid">
            {data.items.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={(n) => go({ page: n })} />
        </>
      )}
    </section>
  )
}
