import { useState, useEffect, useCallback } from 'react'

const ICON = '/Order-Management-System/favicon.svg'
const STORAGE_KEY = 'order-studio-notif-date'

export default function useNotifications(orders) {
  const [permission, setPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  )

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return
    const result = await Notification.requestPermission()
    setPermission(result)
  }, [])

  useEffect(() => {
    if (permission !== 'granted') return

    const check = () => {
      const today = new Date().toISOString().slice(0, 10)
      if (localStorage.getItem(STORAGE_KEY) === today) return

      const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
      const dueToday = []
      const dueTomorrow = []

      orders.forEach((order) => {
        if (order.status === 'completed') return
        ;(order.tasks || []).forEach((task) => {
          if (task.done || !task.dueDate) return
          const label = `${task.text} · ${order.client}`
          if (task.dueDate === today) dueToday.push(label)
          else if (task.dueDate === tomorrow) dueTomorrow.push(label)
        })
      })

      if (dueToday.length > 0) {
        new Notification(
          `${dueToday.length} task${dueToday.length > 1 ? 's' : ''} due today`,
          { body: dueToday.join('\n'), icon: ICON, tag: 'tasks-today' }
        )
      }

      if (dueTomorrow.length > 0) {
        setTimeout(
          () =>
            new Notification(
              `${dueTomorrow.length} task${dueTomorrow.length > 1 ? 's' : ''} due tomorrow`,
              { body: dueTomorrow.join('\n'), icon: ICON, tag: 'tasks-tomorrow' }
            ),
          dueToday.length > 0 ? 4000 : 0
        )
      }

      localStorage.setItem(STORAGE_KEY, today)
    }

    check()
    window.addEventListener('focus', check)
    return () => window.removeEventListener('focus', check)
  }, [permission, orders])

  return { permission, requestPermission }
}
