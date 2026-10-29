// US-14 Devuelve un número que cambia cada vez que el inventario se modifica (en esta u otra pestaña),
// para que las pantallas vuelvan a leer existencias y precios al instante.
import { useEffect, useState } from 'react'
import { subscribe } from '../services/inventory'

export default function useInventoryVersion() {
  const [version, setVersion] = useState(0)
  useEffect(() => subscribe(() => setVersion((v) => v + 1)), [])
  return version
}
