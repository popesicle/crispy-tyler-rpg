import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AppNav from '@/components/ui/AppNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppNav username={session.user.name ?? 'OPERATIVE'} />
      <main style={{ flex: 1, padding: '24px 16px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        {children}
      </main>
    </div>
  )
}
