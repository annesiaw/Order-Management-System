import { useState } from 'react'

const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const STATUS_COLORS = {
  pending: '#fb923c',
  'in-progress': '#60a5fa',
  completed: '#4ade80',
  cancelled: '#9ca3af'
}

export default function CalendarTab({ orders, onOpen }) {
  const today = new Date()
  const todayStr = toDateStr(today)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState(todayStr)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  // Build date → orders map
  const orderMap = {}
  for (const o of orders) {
    if (o.dueDate) {
      if (!orderMap[o.dueDate]) orderMap[o.dueDate] = []
      orderMap[o.dueDate].push(o)
    }
  }

  const selectedOrders = orderMap[selected] || []

  // Build calendar cells
  const cells = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* Month navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          borderBottom: '1px solid var(--gold-border)',
          flexShrink: 0
        }}
      >
        <NavBtn onClick={prevMonth} label="‹" />
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, textAlign: 'center' }}>
            {MONTHS[viewMonth]}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              textAlign: 'center'
            }}
          >
            {viewYear}
          </div>
        </div>
        <NavBtn onClick={nextMonth} label="›" />
      </div>

      {/* Day-of-week headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          padding: '8px 12px 2px',
          flexShrink: 0
        }}
      >
        {DAYS_SHORT.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              fontSize: 11,
              fontWeight: 600,
              color: i === 0 || i === 6 ? 'var(--gold)' : 'var(--text-muted)',
              paddingBottom: 2
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          padding: '2px 12px 6px',
          gap: 2,
          flexShrink: 0
        }}
      >
        {cells.map((day, idx) => {
          if (!day) return <div key={`e${idx}`} />
          const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`
          const dayOrders = orderMap[dateStr] || []
          const isToday = dateStr === todayStr
          const isSelected = dateStr === selected

          return (
            <button
              key={dateStr}
              onClick={() => setSelected(dateStr)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '7px 2px 5px',
                borderRadius: 8,
                background: isSelected
                  ? 'var(--gold)'
                  : isToday
                  ? 'var(--gold-dim)'
                  : 'transparent',
                color: isSelected
                  ? 'var(--navy)'
                  : isToday
                  ? 'var(--gold)'
                  : 'var(--text)',
                border: isToday && !isSelected
                  ? '1px solid var(--gold-border)'
                  : '1px solid transparent',
                fontWeight: isToday || isSelected ? 700 : 400,
                fontSize: 14,
                transition: 'all 0.15s',
                cursor: 'pointer'
              }}
            >
              {day}
              {dayOrders.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    gap: 2,
                    marginTop: 3,
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    maxWidth: 20
                  }}
                >
                  {dayOrders.slice(0, 3).map((o, i) => (
                    <div
                      key={i}
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: '50%',
                        background: isSelected
                          ? 'var(--navy)'
                          : STATUS_COLORS[o.status] || 'var(--gold)'
                      }}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected day panel */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          borderTop: '1px solid var(--gold-border)',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div
          style={{
            padding: '12px 16px 6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {formatSelectedDate(selected)}
          </span>
          <span
            style={{
              fontSize: 12,
              color:
                selectedOrders.length > 0 ? 'var(--gold)' : 'var(--text-dim)'
            }}
          >
            {selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div style={{ padding: '4px 16px 100px' }}>
          {selectedOrders.length === 0 ? (
            <div
              style={{
                color: 'var(--text-muted)',
                fontSize: 13,
                textAlign: 'center',
                paddingTop: 20
              }}
            >
              No orders due on this date
            </div>
          ) : (
            selectedOrders.map((order) => (
              <CalendarOrderRow
                key={order.id}
                order={order}
                onClick={() => onOpen(order)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function CalendarOrderRow({ order, onClick }) {
  const sc = STATUS_COLORS[order.status] || 'var(--text-muted)'
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 13px',
        marginBottom: 8,
        background: 'var(--navy-mid)',
        borderRadius: 10,
        border: '1px solid var(--gold-border)',
        borderLeft: `3px solid ${sc}`,
        cursor: 'pointer',
        transition: 'transform 0.12s'
      }}
      onPointerDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
      onPointerUp={(e) => (e.currentTarget.style.transform = '')}
      onPointerLeave={(e) => (e.currentTarget.style.transform = '')}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 14,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {order.client || 'Unnamed'}
        </div>
        {order.title && (
          <div
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {order.title}
          </div>
        )}
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--gold)' }}>
          ${Number(order.amount || 0).toLocaleString()}
        </div>
        <div style={{ fontSize: 11, color: sc }}>
          {order.status === 'in-progress' ? 'Active' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
      </div>
    </div>
  )
}

function NavBtn({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        background: 'var(--navy-light)',
        color: 'var(--text)',
        border: '1px solid var(--gold-border)',
        fontSize: 22,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      {label}
    </button>
  )
}

function pad(n) {
  return String(n).padStart(2, '0')
}

function toDateStr(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function formatSelectedDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}
