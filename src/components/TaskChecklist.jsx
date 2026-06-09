import { useState } from 'react'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 5)
}

export default function TaskChecklist({ tasks, onChange }) {
  const [input, setInput] = useState('')

  const addTask = () => {
    const text = input.trim()
    if (!text) return
    onChange([...tasks, { id: uid(), text, done: false }])
    setInput('')
  }

  const toggleTask = (id) => {
    onChange(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  const removeTask = (id) => {
    onChange(tasks.filter((t) => t.id !== id))
  }

  const done = tasks.filter((t) => t.done).length

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10
        }}
      >
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em'
          }}
        >
          Tasks
        </label>
        {tasks.length > 0 && (
          <span
            style={{
              fontSize: 12,
              color: done === tasks.length ? 'var(--success)' : 'var(--text-muted)',
              fontWeight: 500
            }}
          >
            {done}/{tasks.length} done
          </span>
        )}
      </div>

      {/* Progress bar */}
      {tasks.length > 0 && (
        <div
          style={{
            height: 3,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.08)',
            marginBottom: 10
          }}
        >
          <div
            style={{
              height: '100%',
              borderRadius: 2,
              background: done === tasks.length ? 'var(--success)' : 'var(--gold)',
              width: `${tasks.length > 0 ? (done / tasks.length) * 100 : 0}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      )}

      {/* Task list */}
      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 10px',
            borderRadius: 8,
            background: 'var(--navy-light)',
            marginBottom: 6,
            border: '1px solid var(--gold-border)'
          }}
        >
          <CheckBox checked={task.done} onChange={() => toggleTask(task.id)} />
          <span
            style={{
              flex: 1,
              fontSize: 14,
              color: task.done ? 'var(--text-dim)' : 'var(--text)',
              textDecoration: task.done ? 'line-through' : 'none',
              transition: 'all 0.2s',
              lineHeight: 1.4
            }}
          >
            {task.text}
          </span>
          <button
            type="button"
            onClick={() => removeTask(task.id)}
            style={{
              background: 'transparent',
              color: 'var(--text-dim)',
              fontSize: 18,
              lineHeight: 1,
              padding: '0 4px',
              transition: 'color 0.15s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--error)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--text-dim)')}
          >
            ×
          </button>
        </div>
      ))}

      {/* Add task row */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTask()
            }
          }}
          placeholder="Add a task..."
          style={{ flex: 1, fontSize: 14 }}
        />
        <button
          type="button"
          onClick={addTask}
          style={{
            padding: '0 16px',
            borderRadius: 8,
            background: input.trim() ? 'var(--gold)' : 'var(--navy-light)',
            color: input.trim() ? 'var(--navy)' : 'var(--text-dim)',
            fontWeight: 700,
            fontSize: 20,
            border: '1px solid var(--gold-border)',
            flexShrink: 0,
            transition: 'all 0.2s',
            height: 44
          }}
        >
          +
        </button>
      </div>
    </div>
  )
}

function CheckBox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        flexShrink: 0,
        background: checked ? 'var(--gold)' : 'transparent',
        border: `2px solid ${checked ? 'var(--gold)' : 'rgba(255,255,255,0.25)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--navy)',
        fontSize: 13,
        fontWeight: 800,
        transition: 'all 0.18s'
      }}
    >
      {checked && '✓'}
    </button>
  )
}
