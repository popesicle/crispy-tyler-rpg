'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const NAV_LINKS = [
  { href: '/roster', label: 'Roster' },
  { href: '/create', label: 'New Operative' },
  { href: '/reference', label: 'Reference' },
]

export default function AppNav({ username }: { username: string }) {
  const pathname = usePathname()

  return (
    <header
      style={{
        borderBottom: '1px solid var(--concrete-dark)',
        background: 'rgba(0,0,0,0.3)',
        padding: '0 16px',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          height: 52,
        }}
      >
        {/* Logo */}
        <Link
          href="/roster"
          style={{
            fontFamily: '"Special Elite", serif',
            fontSize: 36,
            color: 'var(--amber)',
            letterSpacing: 3,
            textDecoration: 'none',
            marginRight: 32,
            flexShrink: 0,
          }}
        >
          FRC
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: 2, flex: 1 }}>
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: '"Share Tech Mono", monospace',
                  fontSize: 19,
                  letterSpacing: 3,
                  textTransform: 'uppercase',
                  color: active ? 'var(--amber)' : 'var(--concrete)',
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderBottom: active ? '2px solid var(--amber-dim)' : '2px solid transparent',
                  transition: 'color 0.15s',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Agent + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <span
            style={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: 30,
              letterSpacing: 2,
              color: 'var(--concrete)',
              textTransform: 'uppercase',
            }}
          >
            {username}
          </span>
          <button
            className="btn"
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{ fontSize: 30, letterSpacing: 2, padding: '4px 10px' }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
