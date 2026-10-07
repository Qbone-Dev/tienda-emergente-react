// US-01 Registro con validación de correo.
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { register, verifyEmail } from '../services/auth'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from ?? '/'
  const [form, setForm] = useState({ name: '', email: location.state?.email ?? '', password: '' })
  const [pending, setPending] = useState(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setPending(await register(form))
    } catch (err) {
      setError(err.message)
    }
  }

  const confirm = (e) => {
    e.preventDefault()
    setError('')
    try {
      signIn(verifyEmail(pending.email, code))
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  if (pending) {
    return (
      <section className="container narrow">
        <h1>Confirma tu correo</h1>
        <p>Enviamos un código de 6 dígitos a <strong>{pending.email}</strong>.</p>
        <p className="notice">Modo demostración: tu código es <strong>{pending.code}</strong></p>
        <form onSubmit={confirm} className="form">
          <label>Código<input inputMode="numeric" maxLength="6" required value={code}
            onChange={(e) => setCode(e.target.value)} /></label>
          {error && <p className="error" role="alert">{error}</p>}
          <button className="btn">Confirmar</button>
        </form>
      </section>
    )
  }

  return (
    <section className="container narrow">
      <h1>Crear cuenta</h1>
      <form onSubmit={submit} className="form">
        <label>Nombre<input autoComplete="name" required value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Correo<input type="email" autoComplete="email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Contraseña<input type="password" autoComplete="new-password" required value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <span className="muted small">Mínimo 8 caracteres, con letras y números.</span></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn">Crear cuenta</button>
      </form>
    </section>
  )
}
