import { useEffect } from 'react'

export default function BottomSheet({ open, onClose, children }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.65)',
          animation: 'fadeIn 0.25s ease',
          backdropFilter: 'blur(3px)'
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: 430,
          background: 'var(--navy-mid)',
          borderRadius: '20px 20px 0 0',
          borderTop: '1px solid var(--gold-border)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'sheetUp 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
          overflow: 'hidden',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)'
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 12,
            paddingBottom: 4,
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              background: 'rgba(255, 255, 255, 0.18)'
            }}
          />
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', flex: 1, overscrollBehavior: 'contain' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
