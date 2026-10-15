// US-09 Revisa cambios de estado cada 15 s mientras la app está abierta.
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { checkForUpdates, getNotifications, markAllRead } from '../services/notifications'

const NotificationsContext = createContext(null)
const INTERVAL_MS = 15000

export function NotificationsProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  const refresh = useCallback(() => {
    if (user) setItems(checkForUpdates(user))
  }, [user])

  useEffect(() => {
    if (!user) {
      setItems([])
      return
    }
    setItems(getNotifications(user.id))
    refresh()
    const t = setInterval(refresh, INTERVAL_MS)
    return () => clearInterval(t)
  }, [user, refresh])

  const value = {
    items,
    unread: items.filter((n) => !n.read).length,
    refresh,
    readAll: () => user && setItems(markAllRead(user.id)),
  }
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export const useNotifications = () => useContext(NotificationsContext)
