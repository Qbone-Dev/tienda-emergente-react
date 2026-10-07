// US-01 Inicio de sesión con correo o red social.
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login, loginWithProvider } from '../services/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const from = useLocation().state?.from ?? '/'
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      signIn(await login(form))
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const social = (provider) => {
    signIn(loginWithProvider(provider))
    navigate(from, { replace: true })
  }

  return (
    <section className="container narrow">
      <h1>Iniciar sesión</h1>
      <form onSubmit={submit} className="form">
        <label>Correo<input type="email" autoComplete="email" required value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Contraseña<input type="password" autoComplete="current-password" required value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</button>
      </form>
      <div className="social">
        <p className="muted small">o continúa con</p>
        <button className="btn ghost" onClick={() => social('Google')}>Google</button>
        <button className="btn ghost" onClick={() => social('Facebook')}>Facebook</button>
        <p className="muted small">Inicio de sesión social en modo demostración.</p>
      </div>
      <p>¿No tienes cuenta? <Link to="/registro" state={{ from }}>Regístrate</Link></p>
    </section>
  )
}
