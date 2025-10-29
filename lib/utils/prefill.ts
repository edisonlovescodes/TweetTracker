import type { CheckoutPrefill } from '@/components/checkout/OrderBumpCheckout'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const pickString = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) return value[0]?.trim() ?? ''
  return (value || '').trim()
}

export function resolveCheckoutPrefill(
  searchParams: Record<string, string | string[] | undefined>
): CheckoutPrefill {
  const emailCandidate = pickString(searchParams.email)
  const email = EMAIL_REGEX.test(emailCandidate) ? emailCandidate : undefined

  const name = pickString(searchParams.name) || undefined
  const country = pickString(searchParams.country).toUpperCase() || undefined
  const line1 = pickString(searchParams.line1) || undefined
  const line2 = pickString(searchParams.line2) || undefined
  const city = pickString(searchParams.city) || undefined
  const state = pickString(searchParams.state).toUpperCase() || undefined
  const postal = pickString(searchParams.postal) || undefined
  const affiliateCode = pickString(searchParams.affiliate) || undefined

  return {
    email,
    name,
    country,
    line1,
    line2,
    city,
    state,
    postal,
    affiliateCode,
  }
}
