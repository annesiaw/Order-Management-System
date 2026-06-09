import { useCallback } from 'react'
import useLocalStorage from './useLocalStorage'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function nextOrderNumber(orders) {
  const nums = orders
    .map(o => parseInt((o.orderNumber || '').replace(/\D/g, ''), 10))
    .filter(n => !isNaN(n))
  const max = nums.length > 0 ? Math.max(...nums) : 0
  return `#ORD-${String(max + 1).padStart(3, '0')}`
}

export default function useOrders() {
  const [orders, setOrders] = useLocalStorage('order-studio-v1', [])

  const addOrder = useCallback(
    (data) => {
      const order = {
        id: uid(),
        orderNumber: nextOrderNumber(orders),
        status: 'pending',
        tasks: [],
        notes: '',
        createdAt: new Date().toISOString(),
        ...data,
        amount: Number(data.amount) || 0
      }
      setOrders((prev) => [order, ...prev])
      return order
    },
    [orders, setOrders]
  )

  const updateOrder = useCallback(
    (id, updates) => {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, ...updates, amount: Number(updates.amount ?? o.amount) || 0 } : o
        )
      )
    },
    [setOrders]
  )

  const deleteOrder = useCallback(
    (id) => {
      setOrders((prev) => prev.filter((o) => o.id !== id))
    },
    [setOrders]
  )

  const toggleTask = useCallback(
    (orderId, taskId) => {
      setOrders((prev) =>
        prev.map((o) => {
          if (o.id !== orderId) return o
          return {
            ...o,
            tasks: o.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
          }
        })
      )
    },
    [setOrders]
  )

  return { orders, addOrder, updateOrder, deleteOrder, toggleTask }
}
