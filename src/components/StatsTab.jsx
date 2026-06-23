const STATUS_META = [
  { key: 'pending', label: 'Pending', color: '#fb923c', icon: '⏳' },
  { key: 'in-progress', label: 'In Progress', color: '#60a5fa', icon: '⚡' },
  { key: 'awaiting-payment', label: 'Awaiting Payment', color: '#f59e0b', icon: '💳' },
  { key: 'completed', label: 'Completed', color: '#4ade80', icon: '✅' },
  { key: 'cancelled', label: 'Cancelled', color: '#9ca3af', icon: '✕' }
]

export default function StatsTab({ orders }) {
  const total = orders.length
  const revenue = orders.reduce((s, o) => s + Number(o.amount || 0), 0)
  const completed = orders.filter((o) => o.status === 'completed').length
  const inProgress = orders.filter((o) => o.status === 'in-progress').length
  const pending = orders.filter((o) => o.status === 'pending').length
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  const now = new Date()
  const thisMonthOrders = orders.filter((o) => {
    const d = new Date(o.createdAt)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const thisMonthRevenue = thisMonthOrders.reduce((s, o) => s + Number(o.amount || 0), 0)

  const allTasks = orders.flatMap((o) => o.tasks || [])
  const doneTasks = allTasks.filter((t) => t.done).length
  const taskRate = allTasks.length > 0 ? Math.round((doneTasks / allTasks.length) * 100) : 0

  if (total === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          gap: 14,
          color: 'var(--text-muted)',
          padding: '0 40px',
          animation: 'fadeIn 0.3s ease'
        }}
      >
        <div style={{ fontSize: 56 }}>📊</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>No data yet</div>
        <div style={{ fontSize: 14, textAlign: 'center', lineHeight: 1.6 }}>
          Create orders to see revenue breakdowns, completion rates, and more.
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        overflowY: 'auto',
        height: '100%',
        padding: '14px 15px 100px',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Summary grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 11,
          marginBottom: 16,
          animation: 'slideUp 0.3s ease'
        }}
      >
        <StatCard
          label="Total Orders"
          value={total}
          sub={`${thisMonthOrders.length} this month`}
          color="var(--gold)"
          icon="📦"
        />
        <StatCard
          label="Revenue"
          value={`$${formatMoney(revenue)}`}
          sub={`$${formatMoney(thisMonthRevenue)} this month`}
          color="var(--gold)"
          icon="💰"
        />
        <StatCard
          label="Completed"
          value={completed}
          sub={`${completionRate}% completion rate`}
          color="#4ade80"
          icon="✅"
        />
        <StatCard
          label="In Progress"
          value={inProgress}
          sub={`${pending} pending`}
          color="#60a5fa"
          icon="⚡"
        />
      </div>

      {/* Status breakdown */}
      <SectionCard title="Status Breakdown" style={{ marginBottom: 12 }}>
        {STATUS_META.map((s) => {
          const count = orders.filter((o) => o.status === s.key).length
          return (
            <StatusBar
              key={s.key}
              label={s.label}
              count={count}
              total={total}
              color={s.color}
              icon={s.icon}
            />
          )
        })}
      </SectionCard>

      {/* Task completion */}
      {allTasks.length > 0 && (
        <SectionCard title="Task Completion">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 10
            }}
          >
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--gold)' }}>
                {taskRate}%
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {doneTasks} of {allTasks.length} tasks done
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-muted)' }}>
              <div>{orders.filter((o) => o.tasks?.length > 0).length} orders</div>
              <div>have tasks</div>
            </div>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 5,
              background: 'rgba(255,255,255,0.07)'
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 5,
                background: 'linear-gradient(90deg, var(--gold) 0%, #f0a500 100%)',
                width: `${taskRate}%`,
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>
        </SectionCard>
      )}

      {/* Revenue by status */}
      <SectionCard title="Revenue by Status" style={{ marginTop: 12 }}>
        {STATUS_META.map((s) => {
          const amount = orders
            .filter((o) => o.status === s.key)
            .reduce((sum, o) => sum + Number(o.amount || 0), 0)
          if (amount === 0) return null
          return (
            <div
              key={s.key}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: s.color,
                    flexShrink: 0
                  }}
                />
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</span>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: s.color }}>
                ${formatMoney(amount)}
              </span>
            </div>
          )
        })}
      </SectionCard>
    </div>
  )
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div
      style={{
        background: 'var(--navy-mid)',
        borderRadius: 'var(--radius)',
        padding: '14px 13px',
        border: '1px solid var(--gold-border)',
        animation: 'slideUp 0.3s ease both'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 8
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
      </div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 800,
          color,
          letterSpacing: '-0.02em',
          marginBottom: 4,
          lineHeight: 1
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.4 }}>{sub}</div>
    </div>
  )
}

function SectionCard({ title, children, style }) {
  return (
    <div
      style={{
        background: 'var(--navy-mid)',
        borderRadius: 'var(--radius)',
        padding: '14px 15px',
        border: '1px solid var(--gold-border)',
        animation: 'slideUp 0.35s ease both',
        ...style
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 14
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

function StatusBar({ label, count, total, color, icon }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 5,
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12 }}>{icon}</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
            {Math.round(pct)}%
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color, minWidth: 20, textAlign: 'right' }}>
            {count}
          </span>
        </div>
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: 'rgba(255,255,255,0.07)'
        }}
      >
        <div
          style={{
            height: '100%',
            borderRadius: 3,
            background: color,
            width: `${pct}%`,
            transition: 'width 0.55s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        />
      </div>
    </div>
  )
}

function formatMoney(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n.toLocaleString()
}
