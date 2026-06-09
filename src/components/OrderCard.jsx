const STATUS_COLORS = {
  pending: '#fb923c',
  'in-progress': '#60a5fa',
  completed: '#4ade80',
  cancelled: '#9ca3af'
}

const STATUS_LABELS = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled'
}

export default function OrderCard({ order, onClick }) {
  const doneTasks = order.tasks.filter((t) => t.done).length
  const totalTasks = order.tasks.length
  const statusColor = STATUS_COLORS[order.status] || 'var(--text-muted)'

  const isOverdue =
    order.dueDate &&
    new Date(order.dueDate + 'T23:59:59') < new Date() &&
    order.status !== 'completed' &&
    order.status !== 'cancelled'

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      style={{
        background: 'var(--navy-mid)',
        borderRadius: 'var(--radius)',
        marginBottom: 11,
        overflow: 'hidden',
        border: '1px solid var(--gold-border)',
        borderLeft: `3px solid ${statusColor}`,
        cursor: 'pointer',
        boxShadow: 'var(--shadow)',
        transition: 'transform 0.12s, box-shadow 0.12s',
        WebkitTapHighlightColor: 'transparent'
      }}
      onPointerDown={(e) => (e.currentTarget.style.transform = 'scale(0.985)')}
      onPointerUp={(e) => (e.currentTarget.style.transform = '')}
      onPointerLeave={(e) => (e.currentTarget.style.transform = '')}
    >
      <div style={{ padding: '14px 15px' }}>
        {/* Top row: order number + status badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 7
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                color: 'var(--text-dim)',
                fontFamily: 'monospace',
                fontWeight: 600
              }}
            >
              {order.orderNumber}
            </span>
            {isOverdue && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: 'var(--error)',
                  background: 'rgba(248,113,113,0.12)',
                  padding: '1px 6px',
                  borderRadius: 4,
                  letterSpacing: '0.05em'
                }}
              >
                OVERDUE
              </span>
            )}
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 9px',
              borderRadius: 20,
              background: `${statusColor}1a`,
              color: statusColor,
              border: `1px solid ${statusColor}40`
            }}
          >
            {STATUS_LABELS[order.status]}
          </span>
        </div>

        {/* Client name */}
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            marginBottom: 2,
            lineHeight: 1.3
          }}
        >
          {order.client || 'Unnamed Client'}
        </div>

        {/* Title/description */}
        {order.title && (
          <div
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              marginBottom: 11,
              lineHeight: 1.4,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {order.title}
          </div>
        )}

        {/* Bottom row: amount + metadata */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: order.title ? 0 : 10
          }}
        >
          <span
            style={{
              fontSize: 19,
              fontWeight: 800,
              color: 'var(--gold)',
              letterSpacing: '-0.02em'
            }}
          >
            ${Number(order.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </span>
          <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--text-muted)' }}>
            {order.dueDate && (
              <span>
                {formatDate(order.dueDate)}
              </span>
            )}
            {totalTasks > 0 && (
              <span
                style={{
                  color: doneTasks === totalTasks ? 'var(--success)' : 'var(--text-muted)'
                }}
              >
                {doneTasks}/{totalTasks} tasks
              </span>
            )}
          </div>
        </div>

        {/* Task progress bar */}
        {totalTasks > 0 && (
          <div
            style={{
              marginTop: 10,
              height: 3,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.07)'
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 2,
                background: doneTasks === totalTasks ? 'var(--success)' : 'var(--gold)',
                width: `${(doneTasks / totalTasks) * 100}%`,
                transition: 'width 0.35s ease'
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
