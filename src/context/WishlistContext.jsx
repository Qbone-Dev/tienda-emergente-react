// US-11 Estado de la lista de deseos del usuario con sesión.
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { getWishlist, removeWish, toggleWish } from '../services/wishlist'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [ids, setIds] = useState([])

  useEffect(() => {
    setIds(user ? getWishlist(user.id) : [])
  }, [user])

  const value = {
    ids,
    has: (productId) => ids.includes(productId),
    toggle: (productId) => user && setIds(toggleWish(user.id, productId)),
    remove: (productId) => user && setIds(removeWish(user.id, productId)),
  }
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const useWishlist = () => useContext(WishlistContext)
