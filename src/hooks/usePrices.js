import { useCallback } from 'react'
import useLocalStorage from './useLocalStorage'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}

export default function usePrices() {
  const [prices, setPrices] = useLocalStorage('order-studio-prices-v1', [])

  const addPrice = useCallback(
    (data) => setPrices((prev) => [...prev, { id: uid(), ...data }]),
    [setPrices]
  )

  const updatePrice = useCallback(
    (id, data) => setPrices((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p))),
    [setPrices]
  )

  const deletePrice = useCallback(
    (id) => setPrices((prev) => prev.filter((p) => p.id !== id)),
    [setPrices]
  )

  return { prices, addPrice, updatePrice, deletePrice }
}
