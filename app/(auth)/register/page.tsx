'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError('Passphrases do not match.')
      return
    }

    setLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Registration failed.')
      return
    }

    router.push('/login?registered=1')
  }

  return (
    <div className="w-full max-w-[420px]">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="font-display text-base tracking-[6px] text-amber-dim uppercase mb-2"
        >
          Federal Remediation Commission
        </div>
        <div
          className="font-display text-4xl text-amber tracking-[2px] leading-tight"
        >
          FRC
        </div>
        <div
          className="font-mono text-3xl tracking-[4px] text-concrete uppercase mt-1"
        >
          Personnel Registration
        </div>
      </div>

      {/* Register panel */}
      <div
        className="border border-concrete-dark bg-white/[0.02] p-7"
      >
        <div
          className="bg-[rgba(139,26,26,0.15)] border border-red-stamp text-concrete-light font-mono text-3xl tracking-[2px] p-3 mb-6 leading-relaxed"
        >
          New operative registration. Credentials will be stored in secure FRC records.
          All activity is monitored and logged.
        </div>

        <div className="section-label mb-5">
          Register Operative
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block font-mono text-3xl tracking-[3px] text-amber-dim uppercase mb-1.5"
            >
              Agent ID
            </label>
            <input
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="choose username (min 3 chars)"
              autoComplete="username"
              required
              minLength={3}
            />
          </div>

          <div className="mb-4">
            <label
              className="block font-mono text-3xl tracking-[3px] text-amber-dim uppercase mb-1.5"
            >
              Passphrase
            </label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••  (min 6 chars)"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>

          <div className="mb-6">
            <label
              className="block font-mono text-3xl tracking-[3px] text-amber-dim uppercase mb-1.5"
            >
              Confirm Passphrase
            </label>
            <input
              className="input"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <div
              className="font-mono text-base text-red-stamp border border-red-stamp p-2.5 mb-4 tracking-[1px]"
            >
              {error}
            </div>
          )}

          <button
            className="btn btn-primary w-full text-base py-2.5 tracking-[4px]"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'File Registration'}
          </button>
        </form>

        <div
          className="mt-5 pt-4 border-t border-concrete-dark font-mono text-base text-concrete text-center"
        >
          Already registered?{' '}
          <Link
            href="/login"
            className="text-amber-dim underline tracking-[1px]"
          >
            Access Terminal
          </Link>
        </div>
      </div>

      <div
        className="mt-4 text-center font-mono text-base text-concrete-dark tracking-[2px] uppercase"
      >
        FRC Form 7-OP — Operative Personnel Record
      </div>
    </div>
  )
}
