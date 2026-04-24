type RateLimitEntry = {
  count: number
  resetAt: number
}

type RateLimitResult = {
  allowed: boolean
  retryAfter: number
}

type RateLimitOptions = {
  limit: number
  windowMs: number
}

const buckets = new Map<string, RateLimitEntry>()

export function getClientIp(req: Request) {
  const forwardedFor = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  return forwardedFor || req.headers.get('x-real-ip') || 'unknown'
}

export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs })
    return { allowed: true, retryAfter: 0 }
  }

  if (entry.count >= options.limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    }
  }

  entry.count += 1
  return { allowed: true, retryAfter: 0 }
}

export function isRateLimited(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || entry.resetAt <= now) {
    buckets.delete(key)
    return { allowed: true, retryAfter: 0 }
  }

  if (entry.count < options.limit) {
    return { allowed: true, retryAfter: 0 }
  }

  return {
    allowed: false,
    retryAfter: Math.ceil((entry.resetAt - now) / 1000),
  }
}

export function resetRateLimit(key: string) {
  buckets.delete(key)
}
