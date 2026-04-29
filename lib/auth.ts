import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { authConfig } from './auth.config'
import { checkRateLimit, getClientIp, isRateLimited, resetRateLimit } from './rate-limit'

const LOGIN_RATE_LIMIT = {
  limit: 5,
  windowMs: 15 * 60 * 1000,
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const username = credentials?.username as string | undefined
        const password = credentials?.password as string | undefined

        if (!username || !password) return null

        const normalizedUsername = username.trim().toLowerCase()
        const ip = getClientIp(req)
        const ipKey = `login:ip:${ip}`
        const userKey = `login:user:${normalizedUsername}`
        const ipLimit = isRateLimited(ipKey, LOGIN_RATE_LIMIT)
        const userLimit = isRateLimited(userKey, LOGIN_RATE_LIMIT)

        if (!ipLimit.allowed || !userLimit.allowed) return null

        const user = await prisma.user.findUnique({ where: { username } })
        if (!user) {
          checkRateLimit(ipKey, LOGIN_RATE_LIMIT)
          checkRateLimit(userKey, LOGIN_RATE_LIMIT)
          return null
        }

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) {
          checkRateLimit(ipKey, LOGIN_RATE_LIMIT)
          checkRateLimit(userKey, LOGIN_RATE_LIMIT)
          return null
        }

        resetRateLimit(ipKey)
        resetRateLimit(userKey)

        return { id: user.id, name: user.username }
      },
    }),
  ],
})
