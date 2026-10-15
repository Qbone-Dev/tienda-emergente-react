// US-01 Registro y login.
// Las contraseñas nunca se guardan en texto plano: se guarda SHA-256(sal + contraseña).
import { load, save } from './storage'

const USERS_KEY = 'te.users'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const isValidEmail = (email) => EMAIL_RE.test(String(email).trim())

export function validatePassword(password) {
  if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  if (!/[0-9]/.test(password) || !/[A-Za-z]/.test(password)) return 'Usa letras y números.'
  return null
}

async function sha256(text) {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

const randomHex = (n = 16) =>
  [...crypto.getRandomValues(new Uint8Array(n))].map((b) => b.toString(16).padStart(2, '0')).join('')

const getUsers = () => load(USERS_KEY, [])
const publicUser = ({ id, name, email, provider }) => ({ id, name, email, provider })

export async function register({ name, email, password }) {
  email = email.trim().toLowerCase()
  if (!name.trim()) throw new Error('Escribe tu nombre.')
  if (!isValidEmail(email)) throw new Error('El correo no es válido.')
  const passwordError = validatePassword(password)
  if (passwordError) throw new Error(passwordError)
  const users = getUsers()
  if (users.some((u) => u.email === email)) throw new Error('Ya existe una cuenta con ese correo.')

  const salt = randomHex()
  // Validación de correo: se "envía" un código de 6 dígitos (se muestra en pantalla).
  const code = String(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000))
  users.push({
    id: 'u-' + randomHex(6),
    name: name.trim(),
    email,
    provider: 'correo',
    salt,
    passwordHash: await sha256(salt + password),
    verified: false,
    code,
  })
  save(USERS_KEY, users)
  return { email, code }
}

export function verifyEmail(email, code) {
  const users = getUsers()
  const user = users.find((u) => u.email === email.trim().toLowerCase())
  if (!user || user.code !== code.trim()) throw new Error('El código no coincide.')
  user.verified = true
  delete user.code
  save(USERS_KEY, users)
  return publicUser(user)
}

export async function login({ email, password }) {
  const user = getUsers().find((u) => u.email === email.trim().toLowerCase() && u.provider === 'correo')
  if (!user || user.passwordHash !== (await sha256(user.salt + password))) {
    throw new Error('Correo o contraseña incorrectos.')
  }
  if (!user.verified) throw new Error('Primero confirma tu correo con el código que te enviamos.')
  return publicUser(user)
}

// Login social simulado: el flujo OAuth real requiere el backend (ajuste T-05).
export function loginWithProvider(provider) {
  const users = getUsers()
  const email = `demo.${provider.toLowerCase()}@tiendaemergente.mx`
  let user = users.find((u) => u.email === email)
  if (!user) {
    user = { id: 'u-' + randomHex(6), name: `Usuario ${provider}`, email, provider, verified: true }
    users.push(user)
    save(USERS_KEY, users)
  }
  return publicUser(user)
}

// US-10 Edición de los datos del perfil.
export function updateProfile(userId, { name }) {
  if (!name.trim()) throw new Error('Escribe tu nombre.')
  const users = getUsers()
  const user = users.find((u) => u.id === userId)
  if (user) {
    user.name = name.trim()
    save(USERS_KEY, users)
  }
  return name.trim()
}
