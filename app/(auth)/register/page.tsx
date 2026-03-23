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
    <div style={{ width: '100%', maxWidth: 420 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div
          style={{
            fontFamily: '"Special Elite", serif',
            fontSize: 19,
            letterSpacing: 6,
            color: 'var(--amber-dim)',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Federal Remediation Commission
        </div>
        <div
          style={{
            fontFamily: '"Special Elite", serif',
            fontSize: 36,
            color: 'var(--amber)',
            letterSpacing: 2,
            lineHeight: 1.1,
          }}
        >
          FRC
        </div>
        <div
          style={{
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 30,
            letterSpacing: 4,
            color: 'var(--concrete)',
            textTransform: 'uppercase',
            marginTop: 4,
          }}
        >
          Personnel Registration
        </div>
      </div>

      {/* Register panel */}
      <div
        style={{
          border: '1px solid var(--concrete-dark)',
          background: 'rgba(255,255,255,0.02)',
          padding: 28,
        }}
      >
        <div
          style={{
            background: 'rgba(139,26,26,0.15)',
            border: '1px solid var(--red-stamp)',
            color: 'var(--concrete-light)',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 30,
            letterSpacing: 2,
            padding: '8px 12px',
            marginBottom: 24,
            lineHeight: 1.5,
          }}
        >
          New operative registration. Credentials will be stored in secure FRC records.
          All activity is monitored and logged.
        </div>

        <div className="section-label" style={{ marginBottom: 20 }}>
          Register Operative
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 30,
                letterSpacing: 3,
                color: 'var(--amber-dim)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
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

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: 'block',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 30,
                letterSpacing: 3,
                color: 'var(--amber-dim)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
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

          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: 'block',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 30,
                letterSpacing: 3,
                color: 'var(--amber-dim)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}
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
              style={{
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: 19,
                color: 'var(--red-stamp)',
                border: '1px solid var(--red-stamp)',
                padding: '8px 10px',
                marginBottom: 16,
                letterSpacing: 1,
              }}
            >
              {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', fontSize: 17, padding: '10px 0', letterSpacing: 4 }}
          >
            {loading ? 'Submitting...' : 'File Registration'}
          </button>
        </form>

        <div
          style={{
            marginTop: 20,
            paddingTop: 16,
            borderTop: '1px solid var(--concrete-dark)',
            fontFamily: '"Share Tech Mono", monospace',
            fontSize: 19,
            color: 'var(--concrete)',
            textAlign: 'center',
          }}
        >
          Already registered?{' '}
          <Link
            href="/login"
            style={{ color: 'var(--amber-dim)', textDecoration: 'underline', letterSpacing: 1 }}
          >
            Access Terminal
          </Link>
        </div>
      </div>

      <div
        style={{
          marginTop: 16,
          textAlign: 'center',
          fontFamily: '"Share Tech Mono", monospace',
          fontSize: 17,
          color: 'var(--concrete-dark)',
          letterSpacing: 2,
          textTransform: 'uppercase',
        }}
      >
        FRC Form 7-OP — Operative Personnel Record
      </div>
    </div>
  )
}
