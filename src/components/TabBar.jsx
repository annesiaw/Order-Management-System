const TABS = [
  { id: 'orders', label: 'Orders', Icon: GridIcon },
  { id: 'calendar', label: 'Calendar', Icon: CalIcon },
  { id: 'stats', label: 'Stats', Icon: BarIcon },
  { id: 'prices', label: 'Prices', Icon: TagIcon }
]

export default function TabBar({ active, onChange }) {
  return (
    <nav
      style={{
        display: 'flex',
        background: 'var(--navy-mid)',
        borderTop: '1px solid var(--gold-border)',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        paddingTop: 6,
        flexShrink: 0,
        position: 'relative',
        zIndex: 10
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '5px 0',
              background: 'transparent',
              color: isActive ? 'var(--gold)' : 'var(--text-muted)',
              transition: 'color 0.2s',
              position: 'relative'
            }}
          >
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: -7,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 28,
                  height: 2,
                  borderRadius: 1,
                  background: 'var(--gold)'
                }}
              />
            )}
            <Icon size={22} bold={isActive} />
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, letterSpacing: '0.02em' }}>
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

function GridIcon({ size, bold }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={bold ? 2.5 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function CalIcon({ size, bold }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={bold ? 2.5 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function BarIcon({ size, bold }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={bold ? 2.5 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  )
}

function TagIcon({ size, bold }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={bold ? 2.5 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
