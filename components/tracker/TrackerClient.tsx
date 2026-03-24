'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { CharacterData, Expendable, Clock } from '@/types/character'
import AttributeBlock from './AttributeBlock'
import ResourceBar from './ResourceBar'
import ClockWidget from './ClockWidget'
import ExpendableSlot from './ExpendableSlot'
import WoPanel from './WoPanel'

interface Props {
  character: CharacterData
}

type SavePayload = {
  fatigue?: number
  stress?: number
  clocks?: Clock[]
  activeAuras?: string[]
  notes?: string
  expendables?: Expendable[]
}

export default function TrackerClient({ character }: Props) {
  // Mutable tracker state
  const [fatigue, setFatigue] = useState(character.fatigue)
  const [stress, setStress] = useState(character.stress)
  const [clocks, setClocks] = useState<Clock[]>(character.clocks)
  const [activeAuras, setActiveAuras] = useState<string[]>(character.activeAuras)
  const [notes, setNotes] = useState(character.notes)
  const [expendables, setExpendables] = useState<Expendable[]>(character.expendables)

  // Per-scene UI state (not persisted — resets on reload, appropriate for "once per scene")
  const [usedBgTags, setUsedBgTags] = useState<string[]>([])

  // Save state
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pending = useRef<SavePayload>({})

  function scheduleSave(updates: SavePayload) {
    pending.current = { ...pending.current, ...updates }
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const payload = { ...pending.current }
      pending.current = {}
      setSaving(true)
      try {
        await fetch(`/api/characters/${character.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        setLastSaved(new Date())
      } finally {
        setSaving(false)
      }
    }, 500)
  }

  function updateFatigue(val: number) {
    setFatigue(val)
    scheduleSave({ fatigue: val })
  }

  function updateStress(val: number) {
    setStress(val)
    scheduleSave({ stress: val })
  }

  function updateClocks(val: Clock[]) {
    setClocks(val)
    scheduleSave({ clocks: val })
  }

  function updateAuras(val: string[]) {
    setActiveAuras(val)
    scheduleSave({ activeAuras: val })
  }

  function updateNotes(val: string) {
    setNotes(val)
    scheduleSave({ notes: val })
  }

  function updateExpendables(val: Expendable[]) {
    setExpendables(val)
    scheduleSave({ expendables: val })
  }

  function toggleBgTag(tag: string) {
    setUsedBgTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const expertSkill = character.skills.find((s) => s.level === 'expert')
  const trainedSkills = character.skills.filter((s) => s.level === 'trained')
  const armorLabel: string | undefined = {
    light: 'Light — Soak 1d6, Initiative +1',
    medium: 'Medium — Soak 2d6',
    heavy: 'Heavy — Soak 3d6, Initiative −1',
  }[character.armor]

  return (
    <div>
      {/* ── Header ──────────────────────────────────────── */}
      <div className="mb-6 pb-4 border-b border-concrete-dark">
        {/* Top bar: name, actions, save status */}
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="section-label">Federal Remediation Commission — Operative File</div>
            <h1 className="font-display text-[32px] text-amber m-0 mb-1 tracking-[2px] leading-none">
              {character.name}
            </h1>
            {character.codename && (
              <div className="font-mono text-sm text-amber-dim tracking-[3px]">
                &ldquo;{character.codename}&rdquo;
              </div>
            )}
          </div>

          {/* Badges + actions */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2 flex-wrap justify-end">
              <div className="stamp text-[13px] px-1.5 py-0.5">
                FRC
              </div>
              <div className="stamp text-[13px] px-1.5 py-0.5 uppercase tracking-[2px]">
                {character.armor} armor
              </div>
              {fatigue >= character.attrs.CON && (
                <div className="font-display text-sm tracking-[3px] text-red-stamp border border-red-stamp px-1.5 py-0.5 uppercase">
                  {fatigue > character.attrs.CON ? 'DOWN' : 'WOUNDED'}
                </div>
              )}
            </div>

            <div className="flex gap-1.5">
              <Link
                href={`/character/${character.id}/print`}
                className="btn text-xs tracking-[2px] px-[10px] py-1"
                target="_blank"
              >
                Print Sheet
              </Link>
              <Link
                href="/roster"
                className="btn text-xs tracking-[2px] px-[10px] py-1"
              >
                ← Roster
              </Link>
            </div>

            {/* Save indicator */}
            <div className={`font-mono text-xs tracking-[2px] ${saving ? 'text-amber-dim' : 'text-concrete-dark'}`}>
              {saving
                ? '● Saving...'
                : lastSaved
                ? `✓ Saved ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : ''}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main grid ────────────────────────────────────── */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 items-start">
        {/* Left column */}
        <div className="flex flex-col gap-5">
          {/* Attributes */}
          <div className="panel">
            <AttributeBlock attrs={character.attrs} />
          </div>

          {/* Fatigue */}
          <div className="panel">
            <ResourceBar
              type="fatigue"
              value={fatigue}
              max={character.attrs.CON}
              onChange={updateFatigue}
            />
          </div>

          {/* Stress */}
          <div className="panel">
            <ResourceBar
              type="stress"
              value={stress}
              max={character.attrs.WIS}
              onChange={updateStress}
            />
          </div>

          {/* Armor + Weapons quick ref */}
          <div className="panel">
            <div className="section-label">Loadout</div>
            <div className="font-mono text-base text-concrete-light tracking-[1px] mb-2">
              {armorLabel}
            </div>
            <div className="flex flex-col gap-0.5">
              {character.weapons.map((w, i) => (
                <div
                  key={i}
                  className="flex justify-between px-2 py-1.25 border border-concrete-dark font-mono text-base"
                >
                  <span className="text-off-white">{w.name}</span>
                  <span className="text-amber-dim">{w.damage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Skills */}
          <div className="panel">
            <div className="section-label">Skills</div>

            {expertSkill && (
              <div className="mb-3">
                <div className="font-mono text-xs tracking-[3px] text-amber-dim uppercase mb-1">
                  Expert
                </div>
                <div className="px-3 py-2 border border-amber-deep bg-[rgba(200,164,90,0.06)]">
                  <div className="font-display text-lg text-amber tracking-[1px] mb-1">
                    {expertSkill.name}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {expertSkill.specializations.map((spec) => (
                      <div
                        key={spec}
                        className="font-mono text-xs text-amber-dim border border-amber-deep px-1.5 py-0.5 tracking-[1px]"
                      >
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <div className="font-mono text-xs tracking-[3px] text-concrete uppercase mb-1">
                Trained
              </div>
              <div className="flex flex-col gap-0.5">
                {trainedSkills.map((s) => (
                  <div
                    key={s.name}
                    className="font-mono text-base text-concrete-light px-2 py-1.25 border border-concrete-dark tracking-[1px]"
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Talent */}
          <div className="panel">
            <div className="section-label">Talent</div>
            <div className="font-display text-lg text-off-white tracking-[1px] mb-1.5">
              {character.talent}
            </div>
            <div className="font-mono text-sm text-concrete tracking-[1px] leading-relaxed">
              {character.talentDesc}
            </div>
          </div>

          {/* Expendables */}
          <div className="panel">
            <ExpendableSlot expendables={expendables} onChange={updateExpendables} />
          </div>
        </div>
      </div>

      {/* ── Full-width sections ──────────────────────────── */}
      <div className="mt-5 flex flex-col gap-5">
        {/* Weird Operations */}
        <div className="panel">
          <WoPanel activeAuras={activeAuras} onChange={updateAuras} />
        </div>

        {/* Background Tags */}
        <div className="panel">
          <div className="section-label">Background Tags</div>
          <div className="font-mono text-xs text-concrete tracking-[2px] mb-2.5 leading-relaxed">
            Once per scene, when a tag applies, click to mark as used. Resets on page reload.
          </div>
          <div className="flex flex-wrap gap-2">
            {character.bgTags.map((tag) => {
              const used = usedBgTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleBgTag(tag)}
                  className={`font-mono text-base tracking-[1px] px-3.5 py-1.5 transition-all duration-150 cursor-pointer ${
                    used
                      ? 'border border-concrete-dark bg-white/[0.02] text-concrete line-through opacity-60'
                      : 'border border-amber-deep bg-[rgba(200,164,90,0.08)] text-amber'
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>

        {/* Clocks */}
        <div className="panel">
          <ClockWidget clocks={clocks} onChange={updateClocks} />
        </div>

        {/* Notes */}
        <div className="panel">
          <div className="section-label">Field Notes</div>
          <textarea
            className="input"
            value={notes}
            onChange={(e) => updateNotes(e.target.value)}
            placeholder="Session notes, reminders, active threats..."
          />
        </div>

        {/* Backstory (read-only, collapsible) */}
        {character.backstory && (
          <div className="panel">
            <div className="section-label">Personnel File — Backstory</div>
            <p className="font-mono text-sm text-concrete tracking-[1px] leading-relaxed m-0">
              {character.backstory}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
