"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Script from 'next/script'
import clsx from 'clsx'

import type { OrderBumpConfig } from '@/lib/config/order-bump'

const WHOP_LOADER_SRC = 'https://js.whop.com/static/checkout/loader.js'

export interface CheckoutPrefill {
  email?: string
  name?: string
  country?: string
  line1?: string
  line2?: string
  city?: string
  state?: string
  postal?: string
  affiliateCode?: string
}

interface OrderBumpCheckoutProps {
  config: OrderBumpConfig
  prefill: CheckoutPrefill
}

type PrefillKey = keyof CheckoutPrefill

export function OrderBumpCheckout({ config, prefill }: OrderBumpCheckoutProps) {
  const [includeBump, setIncludeBump] = useState(false)
  const [prefillState, setPrefillState] = useState(prefill)
  const [isLoading, setIsLoading] = useState(true)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<MutationObserver | null>(null)
  const retryHandle = useRef<number | null>(null)

  const hasPrefillEmail = useMemo(
    () => Boolean(prefillState.email && /\S+@\S+\.\S+/.test(prefillState.email)),
    [prefillState.email]
  )

  useEffect(() => {
    setPrefillState((state) => {
      const next = { ...state, ...prefill }
      const keys = new Set<PrefillKey>([
        ...(Object.keys(state) as PrefillKey[]),
        ...(Object.keys(next) as PrefillKey[]),
      ])
      let hasChanges = false
      keys.forEach((key) => {
        if (state[key] !== next[key]) {
          hasChanges = true
        }
      })
      return hasChanges ? next : state
    })
  }, [prefill])

  useEffect(() => {
    if (prefill.email) {
      window.localStorage.setItem('prefill_email', prefill.email)
    } else if (!prefillState.email) {
      const storedEmail = window.localStorage.getItem('prefill_email')
      if (storedEmail) {
        setPrefillState((state) => ({ ...state, email: storedEmail }))
      }
    }
    if (prefill.email || prefill.name) {
      const url = new URL(window.location.href)
      ;['email', 'name', 'country', 'line1', 'line2', 'city', 'state', 'postal'].forEach((key) =>
        url.searchParams.delete(key)
      )
      window.history.replaceState({}, document.title, url.toString())
    }
  }, [prefill, prefillState.email])

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect()
      if (retryHandle.current) window.clearInterval(retryHandle.current)
    }
  }, [])

  const renderCheckout = useCallback(
    (withBundle: boolean) => {
      if (retryHandle.current) {
        window.clearInterval(retryHandle.current)
        retryHandle.current = null
      }

      const wrapper = wrapperRef.current
      if (!wrapper) return

      setIsLoading(true)
      wrapper.innerHTML = ''

      const embed = document.createElement('div')
      embed.className = 'whop-checkout-embed'

      embed.setAttribute(
        'data-whop-checkout-plan-id',
        withBundle ? config.bundlePlan.id : config.basePlan.id
      )

      if (withBundle && config.bundlePlan.productId) {
        embed.setAttribute('data-whop-checkout-product-id', config.bundlePlan.productId)
      }

      embed.setAttribute('data-whop-checkout-theme', config.checkoutTheme.mode)
      embed.setAttribute('data-whop-checkout-theme-accent-color', config.checkoutTheme.accent)

      if (hasPrefillEmail && prefillState.email) {
        embed.setAttribute('data-whop-checkout-prefill-email', prefillState.email)
      }
      if (prefillState.name) {
        embed.setAttribute('data-whop-checkout-prefill-name', prefillState.name)
      }
      if (prefillState.country) {
        embed.setAttribute('data-whop-checkout-prefill-address-country', prefillState.country)
      }
      if (prefillState.line1) {
        embed.setAttribute('data-whop-checkout-prefill-address-line1', prefillState.line1)
      }
      if (prefillState.line2) {
        embed.setAttribute('data-whop-checkout-prefill-address-line2', prefillState.line2)
      }
      if (prefillState.city) {
        embed.setAttribute('data-whop-checkout-prefill-address-city', prefillState.city)
      }
      if (prefillState.state) {
        embed.setAttribute('data-whop-checkout-prefill-address-state', prefillState.state)
      }
      if (prefillState.postal) {
        embed.setAttribute('data-whop-checkout-prefill-address-postal-code', prefillState.postal)
      }
      if (prefillState.affiliateCode) {
        embed.setAttribute('data-whop-checkout-affiliate-code', prefillState.affiliateCode)
      }

      wrapper.appendChild(embed)

      observerRef.current?.disconnect()
      observerRef.current = new MutationObserver(() => {
        if (wrapper.querySelector('iframe')) {
          setIsLoading(false)
          observerRef.current?.disconnect()
        }
      })
      observerRef.current.observe(wrapper, { childList: true, subtree: true })

      const attemptMount = () => {
        if (window.WhopCheckout?.mount) {
          window.WhopCheckout.mount()
          return true
        }
        return false
      }

      if (!attemptMount()) {
        const startedAt = Date.now()
        retryHandle.current = window.setInterval(() => {
          if (attemptMount()) {
            if (retryHandle.current) {
              window.clearInterval(retryHandle.current)
              retryHandle.current = null
            }
          } else if (Date.now() - startedAt > 12000) {
            if (retryHandle.current) {
              window.clearInterval(retryHandle.current)
              retryHandle.current = null
            }
            setIsLoading(false)
          }
        }, 140)
      }
    },
    [config, hasPrefillEmail, prefillState]
  )

  useEffect(() => {
    renderCheckout(includeBump)
  }, [includeBump, renderCheckout])

  const descriptionId = 'order-bump-description'

  return (
    <div className="wc-shell">
      <Script src={WHOP_LOADER_SRC} strategy="lazyOnload" />
      <div className="wc-card">
        <div className="wc-section">
          <div className="bump-wrap" aria-describedby={descriptionId}>
            <div className="bump-header">
              <div className="bump-arrow" aria-hidden>
                →
              </div>
              <input
                id="order-bump-toggle"
                className="bump-checkbox"
                type="checkbox"
                checked={includeBump}
                onChange={(event) => setIncludeBump(event.target.checked)}
                aria-label="Add bundle upgrade"
              />
              <div>
                <p className="bump-title">
                  <span>Yes! Add the Viral Hooks bundle</span>
                  <span className="now">Now</span>
                </p>
                <p className="text-sm text-slate-600" id={descriptionId}>
                  Includes the swipe file, one-click upsell scenario, and ready-to-launch scripts.
                </p>
              </div>
            </div>

            <div className="bump-body">
              <div className="bump-meta">
                <span className="was">$47</span>
                <span className="price">Only $17 today</span>
                <span className="save">Save $30</span>
              </div>

              <ul className="bump-bullets">
                {config.bundlePlan.bullets.map((bullet) => (
                  <li key={bullet}>
                    <span className="check">✓</span>
                    {bullet}
                  </li>
                ))}
              </ul>

              <p className="bump-warning">
                ⚠️ <strong>Important:</strong> {config.bundlePlan.warning}
              </p>
            </div>
          </div>
        </div>

        <hr className="wc-divider" />

        <div className="wc-section">
          <p
            className={clsx('wc-loading-note transition-opacity duration-150', {
              'is-hidden': !isLoading,
            })}
          >
            Please allow the secure Whop checkout to load…
          </p>
          <div ref={wrapperRef} id="whop-checkout-wrapper" aria-live="polite" />
        </div>
      </div>
    </div>
  )
}
