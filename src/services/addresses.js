// US-10 Perfil y direcciones.
// CA: alta, edición y baja de direcciones; dirección predeterminada en el checkout.
import { load, save } from './storage'

const key = (userId) => `te.addresses.${userId}`

export const getAddresses = (userId) => load(key(userId), [])

export const getDefaultAddress = (userId) => {
  const list = getAddresses(userId)
  return list.find((a) => a.isDefault) ?? list[0] ?? null
}

export function validateAddress({ alias, street, city, zip }) {
  const errors = {}
  if (!alias.trim()) errors.alias = 'Ponle un nombre, por ejemplo «Casa» u «Oficina».'
  if (!street.trim()) errors.street = 'Escribe la calle y el número.'
  if (!city.trim()) errors.city = 'Escribe la ciudad.'
  if (!/^\d{5}$/.test(zip.trim())) errors.zip = 'El código postal tiene 5 dígitos.'
  return errors
}

const newId = () => 'a-' + Math.random().toString(36).slice(2, 9)

export function saveAddress(userId, address) {
  const errors = validateAddress(address)
  if (Object.keys(errors).length) {
    const err = new Error('Revisa los datos de la dirección.')
    err.fields = errors
    throw err
  }
  const clean = {
    alias: address.alias.trim(),
    street: address.street.trim(),
    city: address.city.trim(),
    zip: address.zip.trim(),
  }
  let list = getAddresses(userId)
  if (address.id) {
    list = list.map((a) => (a.id === address.id ? { ...a, ...clean } : a))
  } else {
    // La primera dirección queda como predeterminada.
    list = [...list, { id: newId(), ...clean, isDefault: list.length === 0 }]
  }
  save(key(userId), list)
  return list
}

export function deleteAddress(userId, id) {
  let list = getAddresses(userId).filter((a) => a.id !== id)
  if (list.length && !list.some((a) => a.isDefault)) list = list.map((a, i) => ({ ...a, isDefault: i === 0 }))
  save(key(userId), list)
  return list
}

export function setDefaultAddress(userId, id) {
  const list = getAddresses(userId).map((a) => ({ ...a, isDefault: a.id === id }))
  save(key(userId), list)
  return list
}
