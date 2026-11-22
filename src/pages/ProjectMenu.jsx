// M-13 Menú del proyecto (entrega final del curso): actividades, sistema, código fuente y reporte de modificaciones.
import { Link, useSearchParams } from 'react-router-dom'
import { ACTIVIDADES } from '../data/actividades'
import { MODIFICACIONES } from '../data/modificaciones'

const REPO = 'https://github.com/Qbone-Dev/tienda-emergente-react'
const VERSION = 'v1.0.0'
const SECCIONES = [
  { id: 'actividades', titulo: 'Actividades realizadas en el curso', icono: '📄', texto: `${ACTIVIDADES.length} documentos en PDF` },
  { id: 'sistema', titulo: 'Sistema implementado', icono: '🛒', texto: 'La tienda funcionando y sus pantallas' },
  { id: 'codigo', titulo: 'Código fuente (comprimido)', icono: '🗜️', texto: `Descarga ${VERSION} en .zip` },
  { id: 'reporte', titulo: 'Reporte de las modificaciones', icono: '📝', texto: `${MODIFICACIONES.length} modificaciones con su commit` },
]
const ETAPAS = [...new Set(ACTIVIDADES.map((a) => a.etapa))]
const fecha = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
const pdf = (id) => `./proyecto/actividades/${id}.pdf`

export default function ProjectMenu() {
  const [params, setParams] = useSearchParams()
  const actual = SECCIONES.some((s) => s.id === params.get('seccion')) ? params.get('seccion') : 'actividades'

  return (
    <section className="container menu-page">
      <h1>Menú del proyecto</h1>
      <p className="muted">Tienda Emergente · Proyecto II · UDG Virtual · Jesús Ismael Baltazar Berumen</p>

      <nav className="menu-grid" aria-label="Secciones del menú">
        {SECCIONES.map((s) => (
          <button key={s.id} className={`menu-card ${actual === s.id ? 'active' : ''}`} aria-pressed={actual === s.id}
            onClick={() => setParams({ seccion: s.id }, { replace: true })}>
            <span className="menu-icon" aria-hidden="true">{s.icono}</span>
            <strong>{s.titulo}</strong>
            <span className="muted small">{s.texto}</span>
          </button>
        ))}
      </nav>

      {actual === 'actividades' && (
        <div className="menu-panel">
          <h2>Actividades realizadas en el curso</h2>
          {ETAPAS.map((etapa) => (
            <div key={etapa}>
              <h3>{etapa}</h3>
              <ol className="act-list">
                {ACTIVIDADES.filter((a) => a.etapa === etapa).map((a) => (
                  <li key={a.id}>
                    <div className="grow">
                      <a href={pdf(a.id)} target="_blank" rel="noopener">{a.titulo}</a>
                      <div className="muted small">{fecha(a.fecha)} · {a.descripcion}</div>
                    </div>
                    <a className="btn ghost small-btn" href={pdf(a.id)} download>PDF</a>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}

      {actual === 'sistema' && (
        <div className="menu-panel">
          <h2>Sistema implementado</h2>
          <p>App web de comercio electrónico desarrollada con React 19 y Vite en cuatro sprints de Scrum, más la revisión previa a la liberación.</p>
          <div className="menu-links">
            <Link className="btn" to="/">Abrir la tienda</Link>
            <Link className="btn ghost" to="/buscar?q=audifnos">Probar la búsqueda</Link>
            <Link className="btn ghost" to="/carrito">Carrito y cupones</Link>
            <a className="btn ghost" href={`${REPO}/blob/main/docs/MANUAL.md`} target="_blank" rel="noopener">Manual de uso</a>
          </div>
          <ul className="plain menu-facts">
            <li><strong>15 pantallas:</strong> catálogo, búsqueda, detalle, carrito, pago, pedidos, perfil, favoritos, avisos, soporte, inventario, privacidad, términos e inicio de sesión.</li>
            <li><strong>Calidad:</strong> 39 pruebas unitarias, 19 recorridos de regresión en Chrome y 0 problemas graves de accesibilidad.</li>
            <li><strong>Para probar:</strong> tarjeta 4242 4242 4242 4242, cualquier fecha futura y CVV 123; cupón BIENVENIDA10.</li>
          </ul>
        </div>
      )}

      {actual === 'codigo' && (
        <div className="menu-panel">
          <h2>Código fuente (comprimido)</h2>
          <p>El código completo está en GitHub. Cada sprint tiene su etiqueta y la versión final es {VERSION}.</p>
          <div className="menu-links">
            <a className="btn" href={`${REPO}/archive/refs/tags/${VERSION}.zip`}>Descargar {VERSION} (.zip)</a>
            <a className="btn ghost" href={REPO} target="_blank" rel="noopener">Ver el repositorio</a>
            <a className="btn ghost" href={`${REPO}/tags`} target="_blank" rel="noopener">Versiones por sprint</a>
          </div>
          <p className="muted small">Para ejecutarlo: <code>npm install</code> y <code>npm run dev</code> (Node.js 20 o superior).</p>
        </div>
      )}

      {actual === 'reporte' && (
        <div className="menu-panel">
          <h2>Reporte de las modificaciones realizadas</h2>
          <p>Propuestas de la reunión de revisión (04/11/2026) y su resultado. Cada una tiene su commit en GitHub.</p>
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>ID</th><th>Modificación</th><th>Estado</th><th>Resultado</th><th>Commit</th></tr></thead>
              <tbody>
                {MODIFICACIONES.map((m) => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td>{m.titulo}</td>
                    <td><span className={`status ${m.estado === 'Hecha' ? 'entregado' : m.estado === 'Parcial' ? 'pagado' : ''}`}>{m.estado}</span></td>
                    <td className="small">{m.resultado}</td>
                    <td>
                      {m.commits.length === 0 ? '—' : m.commits.map((c) => (
                        <a key={c} className="commit" href={`${REPO}/commit/${c}`} target="_blank" rel="noopener">{c}</a>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="menu-links">
            <a className="btn ghost" href="./proyecto/reporte-modificaciones.pdf" target="_blank" rel="noopener">Reporte en PDF</a>
            <a className="btn ghost" href={`${REPO}/blob/main/BACKLOG.md`} target="_blank" rel="noopener">Backlog actualizado</a>
          </div>
        </div>
      )}
    </section>
  )
}
