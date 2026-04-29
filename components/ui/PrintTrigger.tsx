'use client'

interface Props {
  characterId: string
}

export default function PrintTrigger({ characterId }: Props) {
  function savePdf() {
    window.location.assign(`/api/characters/${characterId}/pdf`)
  }

  return (
    <div className="inline-flex flex-wrap gap-3">
      <button
        onClick={() => window.print()}
        className="font-mono text-3xl tracking-[2px] uppercase px-4 py-1.5 bg-transparent border cursor-pointer border-[#6b5428] text-[#6b5428]"
      >
        Print
      </button>
      <button
        onClick={savePdf}
        className="font-mono text-3xl tracking-[2px] uppercase px-4 py-1.5 bg-transparent border cursor-pointer border-[#6b5428] text-[#6b5428]"
      >
        Save PDF
      </button>
    </div>
  )
}
