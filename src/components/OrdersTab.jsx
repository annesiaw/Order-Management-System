import { useState } from 'react'
import OrderCard from './OrderCard'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'in-progress', label: 'Active' },
  { id: 'awaiting-payment', label: 'Unpaid' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'archived', label: 'Archived' }
]

export default function OrdersTab({ orders, onOpen, onNew }) {
  const [filter, setFilter] = useState('all')

  const counts = FILTERS.reduce((acc, f) => {
    if (f.id === 'all') acc[f.id] = orders.filter((o) => o.status !== 'completed').length
    else if (f.id === 'archived') acc[f.id] = orders.filter((o) => o.status === 'completed').length
    else acc[f.id] = orders.filter((o) => o.status === f.id).length
    return acc
  }, {})

  const visible =
    filter === 'all'
      ? orders.filter((o) => o.status !== 'completed')
      : filter === 'archived'
      ? orders.filter((o) => o.status === 'completed')
      : orders.filter((o) => o.status === filter)

  const sortedByDate = [...visible].sort((a, b) => {
    if (filter === 'archived') return b.createdAt.localeCompare(a.createdAt)
    if (!a.dueDate && !b.dueDate) return 0
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return a.dueDate.localeCompare(b.dueDate)
  })

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Filter chips */}
      <div
        style={{
          display: 'flex',
          gap: 7,
          padding: '10px 16px',
          overflowX: 'auto',
          flexShrink: 0,
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {FILTERS.map((f) => {
          const isActive = filter === f.id
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                whiteSpace: 'nowrap',
                background: isActive ? 'var(--gold)' : 'var(--navy-light)',
                color: isActive ? 'var(--navy)' : 'var(--text-muted)',
                border: isActive ? 'none' : '1px solid var(--gold-border)',
                transition: 'all 0.18s',
                flexShrink: 0
              }}
            >
              {f.label}
              {counts[f.id] > 0 && (
                <span
                  style={{
                    marginLeft: 5,
                    fontSize: 11,
                    opacity: isActive ? 0.7 : 0.5
                  }}
                >
                  {counts[f.id]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Orders list */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4px 15px 90px',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {sortedByDate.length === 0 ? (
          <EmptyState filter={filter} onNew={onNew} />
        ) : (
          sortedByDate.map((order, i) => (
            <div
              key={order.id}
              style={{
                animation: `slideUp 0.28s ease ${Math.min(i * 0.04, 0.3)}s both`
              }}
            >
              <OrderCard order={order} onClick={() => onOpen(order)} />
            </div>
          ))
        )}
      </div>

      {/* FAB */}
      <button
        onClick={onNew}
        aria-label="New order"
        style={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          width: 56,
          height: 56,
          borderRadius: 28,
          background: 'var(--gold)',
          color: 'var(--navy)',
          fontSize: 30,
          fontWeight: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-gold)',
          zIndex: 5,
          transition: 'transform 0.15s, box-shadow 0.15s'
        }}
        onPointerDown={(e) => {
          e.currentTarget.style.transform = 'scale(0.9)'
          e.currentTarget.style.boxShadow = '0 2px 10px rgba(232,197,71,0.3)'
        }}
        onPointerUp={(e) => {
          e.currentTarget.style.transform = ''
          e.currentTarget.style.boxShadow = 'var(--shadow-gold)'
        }}
        onPointerLeave={(e) => {
          e.currentTarget.style.transform = ''
          e.currentTarget.style.boxShadow = 'var(--shadow-gold)'
        }}
      >
        +
      </button>
    </div>
  )
}

function EmptyState({ filter, onNew }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 320,
        gap: 12,
        color: 'var(--text-muted)',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      <div style={{ fontSize: 52 }}>📋</div>
      <div style={{ fontSize: 16, fontWeight: 600 }}>
        {filter === 'all' ? 'No orders yet' : filter === 'archived' ? 'No archived orders' : `No ${filter} orders`}
      </div>
      <div style={{ fontSize: 13, textAlign: 'center', maxWidth: 200 }}>
        {filter === 'all'
          ? 'Tap the + button to create your first order'
          : filter === 'archived'
          ? 'Completed orders will appear here'
          : 'Change filter to see other orders'}
      </div>
      {filter === 'all' && (
        <button
          onClick={onNew}
          style={{
            marginTop: 8,
            padding: '11px 28px',
            borderRadius: 24,
            background: 'var(--gold)',
            color: 'var(--navy)',
            fontWeight: 700,
            fontSize: 14
          }}
        >
          Create First Order
        </button>
      )}
    </div>
  )
}
