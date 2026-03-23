import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FRC — Field Operations',
  description: 'Federal Remediation Commission — Paranormal Investigation character management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
