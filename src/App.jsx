import { useState, useCallback } from 'react'
import useOrders from './hooks/useOrders'
import TabBar from './components/TabBar'
import OrdersTab from './components/OrdersTab'
import CalendarTab from './components/CalendarTab'
import StatsTab from './components/StatsTab'
import BottomSheet from './components/BottomSheet'
import OrderForm from './components/OrderForm'

export default function App() {
  const [tab, setTab] = useState('orders')
  const [sheet, setSheet] = useState({ open: false, order: null })
  const { orders, addOrder, updateOrder, deleteOrder } = useOrders()

  const openNew = useCallback(() => setSheet({ open: true, order: null }), [])
  const openEdit = useCallback((order) => setSheet({ open: true, order }), [])
  const closeSheet = useCallback(() => setSheet({ open: false, order: null }), [])

  const handleSubmit = useCallback(
    (data) => {
      if (sheet.order) {
        updateOrder(sheet.order.id, data)
      } else {
        addOrder(data)
      }
      closeSheet()
    },
    [sheet.order, addOrder, updateOrder, closeSheet]
  )

  const handleDelete = useCallback(
    (id) => {
      deleteOrder(id)
      closeSheet()
    },
    [deleteOrder, closeSheet]
  )

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--navy)',
        overflow: 'hidden'
      }}
    >
      {/* App header */}
      <header
        style={{
          background: 'var(--navy-mid)',
          padding: '14px 18px 10px',
          borderBottom: '1px solid var(--gold-border)',
          display: 'flex',
          alignItems: 'center',
          gap: 11,
          flexShrink: 0,
          paddingTop: 'max(14px, env(safe-area-inset-top))'
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'var(--gold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="3" rx="1.5" fill="#1a1a2e" />
            <rect x="3" y="10.5" width="13" height="3" rx="1.5" fill="#1a1a2e" opacity="0.7" />
            <rect x="3" y="17" width="15" height="3" rx="1.5" fill="#1a1a2e" opacity="0.5" />
          </svg>
        </div>
        <div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1.2
            }}
          >
            Order Studio
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {TAB_LABELS[tab]} · {orders.length} order{orders.length !== 1 ? 's' : ''}
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main
        style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {tab === 'orders' && (
          <OrdersTab orders={orders} onOpen={openEdit} onNew={openNew} />
        )}
        {tab === 'calendar' && (
          <CalendarTab orders={orders} onOpen={openEdit} />
        )}
        {tab === 'stats' && (
          <StatsTab orders={orders} />
        )}
      </main>

      {/* Bottom tab bar */}
      <TabBar active={tab} onChange={setTab} />

      {/* Order form bottom sheet */}
      <BottomSheet open={sheet.open} onClose={closeSheet}>
        <OrderForm
          key={sheet.order?.id ?? 'new'}
          order={sheet.order}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onClose={closeSheet}
        />
      </BottomSheet>
    </div>
  )
}

const TAB_LABELS = {
  orders: 'Orders',
  calendar: 'Calendar',
  stats: 'Analytics'
}
