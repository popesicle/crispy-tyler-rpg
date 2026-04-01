import type { NextAuthConfig } from 'next-auth'

// Edge-safe config — no Node.js imports (no Prisma, no bcrypt, no pg).
// Used by middleware for JWT session checks.
// Providers are added in auth.ts for server-side use only.
export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = (token.id ?? token.sub) as string
      return session
    },
  },
  providers: [],
}
