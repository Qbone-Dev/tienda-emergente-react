// US-10 Perfil y direcciones.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../services/auth'
import { deleteAddress, getAddresses, saveAddress, setDefaultAddress } from '../services/addresses'

const empty = { id: null, alias: '', street: '', city: '', zip: '' }

export default function Profile() {
  const { user, signIn } = useAuth()
  const [name, setName] = useState(user.name)
  const [nameMsg, setNameMsg] = useState('')
  const [addresses, setAddresses] = useState(() => getAddresses(user.id))
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})

  const saveName = (e) => {
    e.preventDefault()
    try {
      signIn({ ...user, name: updateProfile(user.id, { name }) })
      setNameMsg('Guardado.')
    } catch (err) {
      setNameMsg(err.message)
    }
  }

  const submitAddress = (e) => {
    e.preventDefault()
    try {
      setAddresses(saveAddress(user.id, form))
      setForm(null)
      setErrors({})
    } catch (err) {
      setErrors(err.fields ?? {})
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
    <section className="container narrow-wide">
      <h1>Mi perfil</h1>
      <form className="form panel" onSubmit={saveName}>
        <label>Nombre<input value={name} autoComplete="name" onChange={(e) => { setName(e.target.value); setNameMsg('') }} /></label>
        <p className="muted small">Correo: {user.email} · Acceso con {user.provider}</p>
        <div className="row-inline">
          <button className="btn">Guardar nombre</button>
          {nameMsg && <span className="muted small" role="status">{nameMsg}</span>}
        </div>
      </form>

      <div className="section-head">
        <h2>Mis direcciones</h2>
        {!form && <button className="btn ghost" onClick={() => { setForm(empty); setErrors({}) }}>Agregar dirección</button>}
      </div>

      {form && (
        <form className="form panel" onSubmit={submitAddress}>
          <h3>{form.id ? 'Editar dirección' : 'Nueva dirección'}</h3>
          {field('alias', 'Nombre de la dirección', { placeholder: 'Casa, Oficina…' })}
          {field('street', 'Calle y número', { autoComplete: 'street-address' })}
          <div className="row">
            {field('city', 'Ciudad', { autoComplete: 'address-level2' })}
            {field('zip', 'Código postal', { inputMode: 'numeric', autoComplete: 'postal-code' })}
          </div>
          <div className="row-inline">
            <button className="btn">Guardar</button>
            <button type="button" className="btn ghost" onClick={() => setForm(null)}>Cancelar</button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !form && (
        <p className="muted">Aún no tienes direcciones. La primera que agregues será la predeterminada en el pago.</p>
      )}
      <ul className="address-list">
        {addresses.map((a) => (
          <li key={a.id} className={a.isDefault ? 'is-default' : ''}>
            <div className="grow">
              <strong>{a.alias}</strong>
              {a.isDefault && <span className="badge">Predeterminada</span>}
              <div className="muted small">{a.street}, {a.city}, C.P. {a.zip}</div>
            </div>
            {!a.isDefault && (
              <button className="link" onClick={() => setAddresses(setDefaultAddress(user.id, a.id))}>Usar como predeterminada</button>
            )}
            <button className="link" onClick={() => { setForm(a); setErrors({}) }}>Editar</button>
            <button className="link danger" onClick={() => setAddresses(deleteAddress(user.id, a.id))}>Eliminar</button>
          </li>
        ))}
      </ul>

      <p className="muted small">
        <Link to="/mis-pedidos">Mis pedidos</Link> · <Link to="/favoritos">Mis favoritos</Link> ·{' '}
        <Link to="/notificaciones">Notificaciones</Link> · <Link to="/soporte">Soporte</Link>
      </p>
    </section>
  )
}
