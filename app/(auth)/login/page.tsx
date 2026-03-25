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
    <div className="w-full max-w-[420px]">
      {/* Header stamp */}
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
          Field Operations Terminal
        </div>
      </div>

      {/* Login panel */}
      <div
        className="border border-concrete-dark bg-white/[0.02] p-7"
      >
        {/* Classified bar */}
        <div
          className="bg-red-stamp text-off-white font-display text-base tracking-[5px] uppercase text-center py-1.25 mb-6 opacity-90"
        >
          Restricted Access
        </div>

        <div className="section-label mb-5">
          Authenticate Agent
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
              placeholder="enter username"
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-6">
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
              placeholder="••••••••"
              autoComplete="current-password"
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
            {loading ? 'Verifying...' : 'Access Terminal'}
          </button>
        </form>

        <div
          className="mt-5 pt-4 border-t border-concrete-dark font-mono text-base text-concrete text-center"
        >
          New operative?{' '}
          <Link
            href="/register"
            className="text-amber-dim underline tracking-[1px]"
          >
            Request Clearance
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-4 text-center font-mono text-base text-concrete-dark tracking-[2px] uppercase"
      >
        Unauthorized access will be prosecuted — FRC Internal Directive 7-A
      </div>
    </div>
  )
}
