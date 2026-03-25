'use client'

export default function PrintTrigger() {
  return (
    <button
      onClick={() => window.print()}
      className="font-mono text-3xl tracking-[2px] uppercase px-4 py-1.5 bg-transparent border cursor-pointer border-[#6b5428] text-[#6b5428]"
    >
      Print / Save PDF
    </button>
  )
}
