import { useState } from 'react'

export default function PricesTab({ prices, onAdd, onUpdate, onDelete }) {
  const [form, setForm] = useState({ name: '', description: '', price: '' })
  const [editId, setEditId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const resetForm = () => {
    setForm({ name: '', description: '', price: '' })
    setEditId(null)
  }

  const startEdit = (item) => {
    setForm({ name: item.name, description: item.description || '', price: String(item.price) })
    setEditId(item.id)
    setConfirmDelete(null)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.price) return
    const data = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price)
    }
    if (editId) {
      onUpdate(editId, data)
    } else {
      onAdd(data)
    }
    resetForm()
  }

  const sorted = [...prices].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '14px 15px 90px', WebkitOverflowScrolling: 'touch' }}>
      {/* Add / Edit form */}
      <div
        style={{
          background: 'var(--navy-mid)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--gold-border)',
          padding: '14px 15px',
          marginBottom: 16,
          animation: 'slideUp 0.3s ease'
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
          {editId ? 'Edit Item' : 'Add Price Item'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Item name (e.g. T-Shirt DTF Print)"
            style={{ fontSize: 14 }}
          />
          <input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Description (optional)"
            style={{ fontSize: 14 }}
          />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gold)', fontWeight: 700 }}>$</span>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0.00"
                min="0"
                step="any"
                style={{ fontSize: 14, paddingLeft: 26, width: '100%' }}
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={!form.name.trim() || !form.price}
              style={{
                padding: '0 20px',
                height: 44,
                borderRadius: 8,
                background: form.name.trim() && form.price ? 'var(--gold)' : 'var(--navy-light)',
                color: form.name.trim() && form.price ? 'var(--navy)' : 'var(--text-dim)',
                fontWeight: 700,
                fontSize: 14,
                border: '1px solid var(--gold-border)',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}
            >
              {editId ? 'Save' : 'Add'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '0 14px',
                  height: 44,
                  borderRadius: 8,
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  fontSize: 13,
                  border: '1px solid rgba(255,255,255,0.1)',
                  flexShrink: 0
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Price list */}
      {sorted.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 220, gap: 12, color: 'var(--text-muted)', animation: 'fadeIn 0.3s ease' }}>
          <div style={{ fontSize: 48 }}>🏷️</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>No prices saved yet</div>
          <div style={{ fontSize: 13, textAlign: 'center', maxWidth: 220 }}>
            Add your common items above to quickly fill order amounts
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map((item, i) => (
            <div
              key={item.id}
              style={{
                background: 'var(--navy-mid)',
                borderRadius: 'var(--radius)',
                border: `1px solid ${editId === item.id ? 'var(--gold)' : 'var(--gold-border)'}`,
                overflow: 'hidden',
                animation: `slideUp 0.25s ease ${Math.min(i * 0.04, 0.2)}s both`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 1 }}>
                    {item.name}
                  </div>
                  {item.description && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.description}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)', letterSpacing: '-0.02em', flexShrink: 0 }}>
                  ${Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'var(--text-muted)',
                    fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  ✎
                </button>
              </div>

              {confirmDelete === item.id ? (
                <div style={{ display: 'flex', gap: 8, padding: '0 14px 12px', borderTop: '1px solid var(--gold-border)' }}>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(null)}
                    style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'var(--navy-light)', color: 'var(--text-muted)', fontSize: 13, border: '1px solid var(--gold-border)' }}
                  >
                    Keep
                  </button>
                  <button
                    type="button"
                    onClick={() => { onDelete(item.id); setConfirmDelete(null) }}
                    style={{ flex: 1, padding: '8px', borderRadius: 8, background: 'rgba(248,113,113,0.1)', color: 'var(--error)', fontSize: 13, fontWeight: 600, border: '1px solid rgba(248,113,113,0.25)' }}
                  >
                    Delete
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(item.id)}
                  style={{ width: '100%', padding: '7px', fontSize: 12, color: 'rgba(248,113,113,0.5)', background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.04)', transition: 'color 0.15s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(248,113,113,0.5)')}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
