'use client'

import { useState } from 'react'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="no-print border-b border-concrete-dark bg-black/30 px-4">
      <div className="mx-auto max-w-[960px] flex items-center gap-0 h-[52px]">
        {/* Logo */}
        <Link
          href="/roster"
          className="font-display text-xl text-amber tracking-[3px] no-underline mr-8 shrink-0"
        >
          FRC
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex gap-0.5 flex-1 items-center">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-base tracking-[3px] uppercase no-underline px-[14px] py-1.5 transition-colors duration-150 ${
                  active
                    ? 'text-amber border-b-2 border-amber-dim'
                    : 'text-concrete border-b-2 border-transparent'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Agent + logout — desktop */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <span className="font-mono text-xl tracking-[2px] text-concrete uppercase">
            {username}
          </span>
          <button
            className="btn text-3xl tracking-[2px] px-[10px] py-1"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Sign Out
          </button>
        </div>

        {/* Hamburger button — mobile */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden ml-auto text-amber hover:text-amber-dim transition-colors"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-concrete-dark bg-black/50">
          <div className="flex flex-col">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/')
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`font-mono text-base tracking-[2px] uppercase no-underline px-4 py-3 border-l-2 transition-colors duration-150 ${
                    active
                      ? 'text-amber border-amber-dim bg-white/[0.02]'
                      : 'text-concrete border-concrete-dark hover:bg-white/[0.01]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="border-t border-concrete-dark px-4 py-3">
              <div className="font-mono text-sm tracking-[2px] text-concrete uppercase mb-3">
                {username}
              </div>
              <button
                className="btn w-full text-center text-sm tracking-[2px] px-3 py-2"
                onClick={() => {
                  closeMobileMenu()
                  signOut({ callbackUrl: '/login' })
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}
