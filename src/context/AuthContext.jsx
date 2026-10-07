import { createContext, useContext, useState } from 'react'
import { load, save } from '../services/storage'

const SESSION_KEY = 'te.session'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => load(SESSION_KEY, null))

  const signIn = (u) => {
    setUser(u)
    save(SESSION_KEY, u)
  }
  const signOut = () => {
    setUser(null)
    save(SESSION_KEY, null)
  }

  return <AuthContext.Provider value={{ user, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
