// US-14 Panel de administración de inventario.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/products'
import { getAllProducts, saveProduct, setActive, setStock } from '../services/inventory'
import { money } from '../services/cart'
import useInventoryVersion from '../hooks/useInventory'

const LOW_STOCK = 5
const empty = { id: null, name: '', brand: '', category: CATEGORIES[0], price: '', stock: '', description: '' }

export default function Admin() {
  const inventory = useInventoryVersion()
  const products = useMemo(() => getAllProducts(), [inventory]) // eslint-disable-line react-hooks/exhaustive-deps
  const [filter, setFilter] = useState('')
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [stockDraft, setStockDraft] = useState({})
  const [notice, setNotice] = useState('')

  const shown = products.filter((p) =>
    `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(filter.trim().toLowerCase()))
  const active = products.filter((p) => p.active !== false)
  const low = active.filter((p) => p.stock < LOW_STOCK)

  const submit = (e) => {
    e.preventDefault()
    try {
      saveProduct(form)
      setNotice(form.id ? `Se actualizó «${form.name.trim()}».` : `Se dio de alta «${form.name.trim()}».`)
      setForm(null)
      setErrors({})
    } catch (err) {
      setErrors(err.fields ?? {})
    }
  }

  const saveStock = (p) => {
    try {
      setStock(p.id, stockDraft[p.id])
      setStockDraft(({ [p.id]: _, ...rest }) => rest)
      setNotice(`Existencias de «${p.name}» actualizadas; la tienda ya muestra el cambio.`)
    } catch (err) {
      setNotice(err.message)
    }
  }

  const field = (key, label, props = {}) => (
    <label>
      {label}
      <input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} {...props} />
      {errors[key] && <span className="error">{errors[key]}</span>}
    </label>
  )

  return (
    <section className="container">
      <div className="section-head">
        <h1>Inventario</h1>
        {!form && <button className="btn" onClick={() => { setForm(empty); setErrors({}) }}>Agregar producto</button>}
      </div>

      <div className="kpis">
        <div><strong>{active.length}</strong><span>productos activos</span></div>
        <div><strong>{active.reduce((s, p) => s + p.stock, 0)}</strong><span>piezas en existencia</span></div>
        <div className={low.length ? 'warn' : ''}><strong>{low.length}</strong><span>con menos de {LOW_STOCK} piezas</span></div>
        <div><strong>{products.length - active.length}</strong><span>dados de baja</span></div>
      </div>

      {notice && <p className="notice" role="status">{notice}</p>}

      {form && (
        <form className="form panel" onSubmit={submit}>
          <h2 className="panel-title">{form.id ? `Editar ${form.id}` : 'Nuevo producto'}</h2>
          {field('name', 'Nombre')}
          <div className="row">
            {field('brand', 'Marca')}
            <label>Categoría
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.category && <span className="error">{errors.category}</span>}
            </label>
          </div>
          <div className="row">
            {field('price', 'Precio (MXN, IVA incluido)', { type: 'number', min: '0', step: '0.01', inputMode: 'decimal' })}
            {field('stock', 'Existencias', { type: 'number', min: '0', step: '1', inputMode: 'numeric' })}
          </div>
          <label>Descripción
            <textarea rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="row-inline">
            <button className="btn">Guardar</button>
            <button type="button" className="btn ghost" onClick={() => setForm(null)}>Cancelar</button>
          </div>
        </form>
      )}

      <label className="admin-filter">
        Buscar en el inventario
        <input type="search" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Nombre, marca o categoría" />
      </label>

      <div className="table-wrap">
        <table className="table admin-table">
          <thead>
            <tr><th>ID</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Existencias</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {shown.map((p) => {
              const draft = stockDraft[p.id]
              return (
                <tr key={p.id} className={p.active === false ? 'inactive' : ''}>
                  <td>{p.id}</td>
                  <td>
                    {p.active === false ? p.name : <Link to={`/producto/${p.id}`}>{p.name}</Link>}
                    <div className="muted small">{p.brand}</div>
                  </td>
                  <td>{p.category}</td>
                  <td>{money(p.price)}</td>
                  <td>
                    <div className="stock-edit">
                      <input type="number" min="0" step="1" aria-label={`Existencias de ${p.name}`}
                        className={p.stock < LOW_STOCK && p.active !== false ? 'low' : ''}
                        value={draft ?? p.stock} onChange={(e) => setStockDraft({ ...stockDraft, [p.id]: e.target.value })} />
                      {draft !== undefined && String(draft) !== String(p.stock) && (
                        <button className="btn ghost small-btn" onClick={() => saveStock(p)}>Guardar</button>
                      )}
                    </div>
                  </td>
                  <td>{p.active === false ? <span className="status">Baja</span> : <span className="status entregado">Activo</span>}</td>
                  <td className="actions">
                    <button className="link" onClick={() => { setForm({ ...empty, ...p }); setErrors({}); window.scrollTo(0, 0) }}>Editar</button>
                    {p.active === false
                      ? <button className="link" onClick={() => setActive(p.id, true)}>Reactivar</button>
                      : <button className="link danger" onClick={() => setActive(p.id, false)}>Dar de baja</button>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
