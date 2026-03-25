import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AppNav from '@/components/ui/AppNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen flex flex-col">
      <AppNav username={session.user.name ?? 'OPERATIVE'} />
      <main className="flex-1 px-4 py-6 max-w-[960px] mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
