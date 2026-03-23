'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid credentials. Access denied.')
    } else {
      router.push('/roster')
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 420 }}>
      {/* Header stamp */}
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
          Field Operations Terminal
        </div>
      </div>

      {/* Login panel */}
      <div
        style={{
          border: '1px solid var(--concrete-dark)',
          background: 'rgba(255,255,255,0.02)',
          padding: 28,
        }}
      >
        {/* Classified bar */}
        <div
          style={{
            background: 'var(--red-stamp)',
            color: 'var(--off-white)',
            fontFamily: '"Special Elite", serif',
            fontSize: 19,
            letterSpacing: 5,
            textTransform: 'uppercase',
            textAlign: 'center',
            padding: '5px 0',
            marginBottom: 24,
            opacity: 0.9,
          }}
        >
          Restricted Access
        </div>

        <div className="section-label" style={{ marginBottom: 20 }}>
          Authenticate Agent
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
              placeholder="enter username"
              autoComplete="username"
              required
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
              Passphrase
            </label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
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
            {loading ? 'Verifying...' : 'Access Terminal'}
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
          New operative?{' '}
          <Link
            href="/register"
            style={{ color: 'var(--amber-dim)', textDecoration: 'underline', letterSpacing: 1 }}
          >
            Request Clearance
          </Link>
        </div>
      </div>

      {/* Footer */}
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
        Unauthorized access will be prosecuted — FRC Internal Directive 7-A
      </div>
    </div>
  )
}
