'use client'

export default function PrintTrigger() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        fontFamily: '"Share Tech Mono", monospace',
        fontSize: 36,
        letterSpacing: 2,
        textTransform: 'uppercase',
        padding: '6px 16px',
        background: 'transparent',
        border: '1px solid #6b5428',
        color: '#6b5428',
        cursor: 'pointer',
      }}
    >
      Print / Save PDF
    </button>
  )
}
