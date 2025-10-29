import { NextResponse } from 'next/server'

import { getWhopClient } from '@/lib/whop/client'

const WEBHOOK_SECRET = process.env.WHOP_WEBHOOK_SECRET

export async function POST(request: Request) {
  const client = getWhopClient()
  const rawBody = await request.text()
  const headers = Object.fromEntries(request.headers.entries())

  try {
    const event = client.webhooks.unwrap(rawBody, {
      headers,
      key: WEBHOOK_SECRET ?? undefined,
    })

    switch (event.type) {
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.data.id, event.data.user?.id || null)
        break
      case 'membership.activated':
        await handleMembershipActivated(event.data.id, event.data.user?.id || null)
        break
      default:
        console.info('[whop webhook] event received', event.type)
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[whop webhook] signature verification failed', error)
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }
}

async function handlePaymentSucceeded(paymentId: string, userId: string | null) {
  console.info('[whop webhook] payment succeeded', { paymentId, userId })
  // TODO: unlock content, trigger CRM automation, send email, etc.
}

async function handleMembershipActivated(membershipId: string, userId: string | null) {
  console.info('[whop webhook] membership activated', { membershipId, userId })
  // TODO: persist membership state in your database to unlock the experience.
}
