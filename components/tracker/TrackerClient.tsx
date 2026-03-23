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
  const armorLabel = {
    light: 'Light — Soak 1d6, Initiative +1',
    medium: 'Medium — Soak 2d6',
    heavy: 'Heavy — Soak 3d6, Initiative −1',
  }[character.armor]

  return (
    <div>
      {/* ── Header ──────────────────────────────────────── */}
      <div
        style={{
          marginBottom: 24,
          paddingBottom: 16,
          borderBottom: '1px solid var(--concrete-dark)',
        }}
      >
        {/* Top bar: name, actions, save status */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="section-label">Federal Remediation Commission — Operative File</div>
            <h1
              style={{
                fontFamily: '"Special Elite", serif',
                fontSize: 32,
                color: 'var(--amber)',
                margin: '0 0 4px',
                letterSpacing: 2,
                lineHeight: 1,
              }}
            >
              {character.name}
            </h1>
            {character.codename && (
              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 14,
                  color: 'var(--amber-dim)',
                  letterSpacing: 3,
                }}
              >
                &ldquo;{character.codename}&rdquo;
              </div>
            )}
          </div>

          {/* Badges + actions */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <div className="stamp" style={{ fontSize: 13, padding: '1px 6px' }}>
                FRC
              </div>
              <div
                className="stamp"
                style={{
                  fontSize: 13,
                  padding: '1px 6px',
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              >
                {character.armor} armor
              </div>
              {fatigue >= character.attrs.CON && (
                <div
                  style={{
                    fontFamily: '"Special Elite", serif',
                    fontSize: 14,
                    letterSpacing: 3,
                    color: 'var(--red-stamp)',
                    border: '1px solid var(--red-stamp)',
                    padding: '1px 6px',
                    textTransform: 'uppercase',
                  }}
                >
                  {fatigue > character.attrs.CON ? 'DOWN' : 'WOUNDED'}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <Link
                href={`/character/${character.id}/print`}
                className="btn"
                style={{ fontSize: 13, letterSpacing: 2, padding: '4px 10px' }}
                target="_blank"
              >
                Print Sheet
              </Link>
              <Link
                href="/roster"
                className="btn"
                style={{ fontSize: 13, letterSpacing: 2, padding: '4px 10px' }}
              >
                ← Roster
              </Link>
            </div>

            {/* Save indicator */}
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 12,
                color: saving ? 'var(--amber-dim)' : 'var(--concrete-dark)',
                letterSpacing: 2,
              }}
            >
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
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
          alignItems: 'start',
        }}
      >
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 16,
                color: 'var(--concrete-light)',
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              {armorLabel}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {character.weapons.map((w, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '5px 8px',
                    border: '1px solid var(--concrete-dark)',
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 16,
                  }}
                >
                  <span style={{ color: 'var(--off-white)' }}>{w.name}</span>
                  <span style={{ color: 'var(--amber-dim)' }}>{w.damage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Skills */}
          <div className="panel">
            <div className="section-label">Skills</div>

            {expertSkill && (
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 12,
                    letterSpacing: 3,
                    color: 'var(--amber-dim)',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  Expert
                </div>
                <div
                  style={{
                    padding: '8px 12px',
                    border: '1px solid var(--amber-deep)',
                    background: 'rgba(200,164,90,0.06)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: '"Special Elite", serif',
                      fontSize: 18,
                      color: 'var(--amber)',
                      letterSpacing: 1,
                      marginBottom: 4,
                    }}
                  >
                    {expertSkill.name}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {expertSkill.specializations.map((spec) => (
                      <div
                        key={spec}
                        style={{
                          fontFamily: '"Share Tech Mono", monospace',
                          fontSize: 13,
                          color: 'var(--amber-dim)',
                          border: '1px solid var(--amber-deep)',
                          padding: '1px 6px',
                          letterSpacing: 1,
                        }}
                      >
                        {spec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <div
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 12,
                  letterSpacing: 3,
                  color: 'var(--concrete)',
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                Trained
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {trainedSkills.map((s) => (
                  <div
                    key={s.name}
                    style={{
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: 16,
                      color: 'var(--concrete-light)',
                      padding: '5px 8px',
                      border: '1px solid var(--concrete-dark)',
                      letterSpacing: 1,
                    }}
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
            <div
              style={{
                fontFamily: '"Special Elite", serif',
                fontSize: 18,
                color: 'var(--off-white)',
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              {character.talent}
            </div>
            <div
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 14,
                color: 'var(--concrete)',
                letterSpacing: 1,
                lineHeight: 1.6,
              }}
            >
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
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Weird Operations */}
        <div className="panel">
          <WoPanel activeAuras={activeAuras} onChange={updateAuras} />
        </div>

        {/* Background Tags */}
        <div className="panel">
          <div className="section-label">Background Tags</div>
          <div
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 13,
              color: 'var(--concrete)',
              letterSpacing: 2,
              marginBottom: 10,
              lineHeight: 1.5,
            }}
          >
            Once per scene, when a tag applies, click to mark as used. Resets on page reload.
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {character.bgTags.map((tag) => {
              const used = usedBgTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleBgTag(tag)}
                  style={{
                    fontFamily: '"Share Tech Mono", monospace',
                    fontSize: 16,
                    letterSpacing: 1,
                    padding: '6px 14px',
                    border: `1px solid ${used ? 'var(--concrete-dark)' : 'var(--amber-deep)'}`,
                    background: used
                      ? 'rgba(255,255,255,0.02)'
                      : 'rgba(200,164,90,0.08)',
                    color: used ? 'var(--concrete)' : 'var(--amber)',
                    cursor: 'pointer',
                    textDecoration: used ? 'line-through' : 'none',
                    opacity: used ? 0.6 : 1,
                    transition: 'all 0.15s',
                  }}
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
            style={{ minHeight: 120, width: '100%' }}
          />
        </div>

        {/* Backstory (read-only, collapsible) */}
        {character.backstory && (
          <div className="panel">
            <div className="section-label">Personnel File — Backstory</div>
            <p
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 14,
                color: 'var(--concrete)',
                letterSpacing: 1,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {character.backstory}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
