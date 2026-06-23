import { useState } from 'react'
import TaskChecklist from './TaskChecklist'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: '#fb923c' },
  { value: 'in-progress', label: 'In Progress', color: '#60a5fa' },
  { value: 'awaiting-payment', label: 'Awaiting Payment', color: '#f59e0b' },
  { value: 'completed', label: 'Completed', color: '#4ade80' },
  { value: 'cancelled', label: 'Cancelled', color: '#9ca3af' }
]

export default function OrderForm({ order, prices = [], onSubmit, onDelete, onClose }) {
  const [form, setForm] = useState({
    client: order?.client ?? '',
    title: order?.title ?? '',
    amount: order?.amount ?? '',
    status: order?.status ?? 'pending',
    dueDate: order?.dueDate ?? '',
    notes: order?.notes ?? '',
    tasks: order?.tasks ?? []
  })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showPrices, setShowPrices] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.client.trim()) return
    onSubmit({ ...form, amount: Number(form.amount) || 0 })
  }

  const headerBadge =
    order?.status === 'completed'
      ? { label: 'Archived', color: '#a3a3a3' }
      : order?.status === 'awaiting-payment'
      ? { label: 'Awaiting Payment', color: '#f59e0b' }
      : null

  return (
    <form onSubmit={handleSubmit} style={{ padding: '4px 20px 44px' }}>
      {/* Sheet header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: '1px solid var(--gold-border)'
        }}
      >
        <div>
          <div style={{ fontSize: 19, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {order ? 'Edit Order' : 'New Order'}
            {headerBadge && (
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                color: headerBadge.color,
                background: `${headerBadge.color}18`,
                border: `1px solid ${headerBadge.color}40`,
                padding: '2px 8px',
                borderRadius: 12,
                letterSpacing: '0.04em'
              }}>
                {headerBadge.label}
              </span>
            )}
          </div>
          {order && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: 2 }}>
              {order.orderNumber}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: 34, height: 34, borderRadius: 17,
            background: 'rgba(255,255,255,0.08)',
            color: 'var(--text-muted)', fontSize: 20,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}
        >
          ×
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Client name */}
        <Field label="Client Name *">
          <input
            value={form.client}
            onChange={(e) => set('client', e.target.value)}
            placeholder="Enter client name"
            required
            autoFocus={!order}
          />
        </Field>

        {/* Job description */}
        <Field label="Job Description">
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="What is this order for?"
          />
        </Field>

        {/* Amount + Due date */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <Field label="Amount ($)">
              <input
                type="number"
                value={form.amount}
                onChange={(e) => set('amount', e.target.value)}
                placeholder="0"
                min="0"
                step="any"
              />
            </Field>
            {prices.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPrices((v) => !v)}
                style={{
                  marginTop: 5,
                  fontSize: 11,
                  color: 'var(--gold)',
                  background: 'transparent',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                🏷️ {showPrices ? 'Hide' : 'From price list'}
              </button>
            )}
            {showPrices && prices.length > 0 && (
              <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 160, overflowY: 'auto' }}>
                {[...prices].sort((a, b) => a.name.localeCompare(b.name)).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { set('amount', p.price); setShowPrices(false) }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '7px 10px', borderRadius: 7,
                      background: 'var(--navy-light)', border: '1px solid var(--gold-border)',
                      fontSize: 12, textAlign: 'left'
                    }}
                  >
                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{p.name}</span>
                    <span style={{ color: 'var(--gold)', fontWeight: 700 }}>${Number(p.price).toLocaleString()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Field label="Due Date">
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => set('dueDate', e.target.value)}
            />
          </Field>
        </div>

        {/* Status */}
        <Field label="Status">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {STATUS_OPTIONS.slice(0, 4).map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => set('status', s.value)}
                style={{
                  padding: '9px 8px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 500,
                  border: `1.5px solid ${form.status === s.value ? s.color : 'var(--gold-border)'}`,
                  background: form.status === s.value ? `${s.color}18` : 'var(--navy-light)',
                  color: form.status === s.value ? s.color : 'var(--text-muted)',
                  transition: 'all 0.15s',
                  textAlign: 'center'
                }}
              >
                {s.label}
              </button>
            ))}
            {/* Cancelled spans full width */}
            <button
              type="button"
              onClick={() => set('status', 'cancelled')}
              style={{
                gridColumn: '1 / -1',
                padding: '8px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 500,
                border: `1.5px solid ${form.status === 'cancelled' ? '#9ca3af' : 'var(--gold-border)'}`,
                background: form.status === 'cancelled' ? '#9ca3af18' : 'var(--navy-light)',
                color: form.status === 'cancelled' ? '#9ca3af' : 'var(--text-muted)',
                transition: 'all 0.15s',
                textAlign: 'center'
              }}
            >
              Cancelled
            </button>
          </div>
        </Field>

        {/* Status hints */}
        {form.status === 'completed' && (
          <div style={{ fontSize: 12, color: '#4ade80', background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 8, padding: '8px 12px', marginTop: -8 }}>
            ✓ Paid & done — this order will be moved to Archived
          </div>
        )}
        {form.status === 'awaiting-payment' && (
          <div style={{ fontSize: 12, color: '#f59e0b', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 8, padding: '8px 12px', marginTop: -8 }}>
            ⏳ Order is complete — waiting on payment. Will appear in the Unpaid section.
          </div>
        )}

        {/* Notes */}
        <Field label="Notes">
          <textarea
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Additional notes..."
            rows={2}
          />
        </Field>

        {/* Task checklist */}
        <TaskChecklist
          tasks={form.tasks}
          onChange={(tasks) => set('tasks', tasks)}
        />
      </div>

      {/* Action buttons */}
      <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          type="submit"
          style={{
            padding: '15px',
            borderRadius: 'var(--radius)',
            background: 'var(--gold)',
            color: 'var(--navy)',
            fontSize: 16,
            fontWeight: 700,
            width: '100%',
            letterSpacing: '0.01em'
          }}
        >
          {order ? 'Save Changes' : 'Create Order'}
        </button>

        {order &&
          (confirmDelete ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                style={{ flex: 1, padding: 13, borderRadius: 'var(--radius)', background: 'var(--navy-light)', color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, border: '1px solid var(--gold-border)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onDelete(order.id)}
                style={{ flex: 1, padding: 13, borderRadius: 'var(--radius)', background: 'rgba(248,113,113,0.12)', color: 'var(--error)', fontSize: 14, fontWeight: 600, border: '1px solid rgba(248,113,113,0.3)' }}
              >
                Confirm Delete
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              style={{ padding: 13, borderRadius: 'var(--radius)', background: 'transparent', color: 'var(--text-muted)', fontSize: 14, border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Delete Order
            </button>
          ))}
      </div>
    </form>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          marginBottom: 6
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}
