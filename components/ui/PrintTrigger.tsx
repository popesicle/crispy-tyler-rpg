'use client'

export default function PrintTrigger() {
  return (
    <button
      onClick={() => window.print()}
      className="font-mono text-[36px] tracking-[2px] uppercase px-4 py-1.5 bg-transparent border cursor-pointer"
      style={{
        borderColor: '#6b5428',
        color: '#6b5428',
      }}
    >
      Print / Save PDF
    </button>
  )
}
