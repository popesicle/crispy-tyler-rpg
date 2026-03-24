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
    <header className="border-b border-concrete-dark bg-black/30 px-4">
      <div className="mx-auto max-w-[960px] flex items-center gap-0 h-[52px]">
        {/* Logo */}
        <Link
          href="/roster"
          className="font-display text-[36px] text-amber tracking-[3px] no-underline mr-8 shrink-0"
        >
          FRC
        </Link>

        {/* Nav links */}
        <nav className="flex gap-0.5 flex-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-[19px] tracking-[3px] uppercase no-underline px-[14px] py-1.5 transition-colors duration-150 ${
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

        {/* Agent + logout */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-[30px] tracking-[2px] text-concrete uppercase">
            {username}
          </span>
          <button
            className="btn text-[30px] tracking-[2px] px-[10px] py-1"
            onClick={() => signOut({ callbackUrl: '/login' })}
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  )
}
