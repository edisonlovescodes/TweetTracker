"use client"

import { useState } from 'react'

interface InAppPurchaseButtonProps {
  planId: string
  label?: string
}

type PurchaseState = 'idle' | 'loading' | 'success' | 'error'

export function InAppPurchaseButton({ planId, label }: InAppPurchaseButtonProps) {
  const [state, setState] = useState<PurchaseState>('idle')

  const handleClick = async () => {
    if (!window.WhopCheckout || typeof window.WhopCheckout.inAppPurchase !== 'function') {
      setState('error')
      console.warn('WhopCheckout.inAppPurchase is only available inside the Whop iframe.')
      return
    }

    setState('loading')

    try {
      const result = await window.WhopCheckout.inAppPurchase({
        planId,
        metadata: { source: 'order-bump-demo' },
      })

      if (result?.status === 'success') {
        setState('success')
      } else {
        setState('error')
      }
    } catch (error) {
      console.error('Failed to trigger in-app purchase', error)
      setState('error')
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-6 text-sm text-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Demo</p>
          <h3 className="text-lg font-semibold text-slate-900">In-app purchase trigger</h3>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/85">
          Beta
        </span>
      </div>
      <p className="text-sm leading-relaxed text-slate-600">
        Call the iframe SDK directly to sell add-ons after the initial checkout. Works best when
        paired with bundle plans and post-purchase flows.
      </p>
      <button
        onClick={handleClick}
        disabled={state === 'loading'}
        className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/20 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {state === 'loading' ? 'Launching flow…' : label ?? 'Launch in-app purchase'}
      </button>
      <p className="text-xs text-slate-500">
        Status:{' '}
        <span className="font-semibold text-slate-600">
          {state === 'idle' && 'ready'}
          {state === 'loading' && 'waiting for Whop'}
          {state === 'success' && 'completed'}
          {state === 'error' && 'unavailable outside Whop'}
        </span>
      </p>
    </div>
  )
}
