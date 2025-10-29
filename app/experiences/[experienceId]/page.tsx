import type { Metadata } from 'next'

import { orderBumpConfig } from '@/lib/config/order-bump'
import { resolveCheckoutPrefill } from '@/lib/utils/prefill'
import { ExperienceHero } from '@/components/experience/ExperienceHero'
import { ExperienceInsights } from '@/components/experience/ExperienceInsights'
import { OrderBumpCheckout } from '@/components/checkout/OrderBumpCheckout'
import { InAppPurchaseButton } from '@/components/checkout/InAppPurchaseButton'
import { ExperienceAccessError, getExperienceSession } from '@/lib/whop/experience'

export const metadata: Metadata = {
  title: 'Whop Checkout CRO Lab',
  description:
    'Sample Whop experience view that verifies tokens, checks access, and renders a CRO-optimized order bump checkout with prefills.',
}

interface ExperiencePageProps {
  params: { experienceId: string }
  searchParams: Record<string, string | string[] | undefined>
}

export default async function ExperiencePage({ params, searchParams }: ExperiencePageProps) {
  const prefill = resolveCheckoutPrefill(searchParams)

  try {
    const session = await getExperienceSession(params.experienceId)

    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#e2e8f0)] pb-24">
        <ExperienceHero config={orderBumpConfig} session={session} />

        <section className="mx-auto mt-6 w-full max-w-4xl px-6">
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur">
            <header className="space-y-2 text-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                In-app checkout preview
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Toggle the order bump to watch the plan swap in real time
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                This embed mounts the secure Whop iframe via the plan-based loader. When the order
                bump is enabled we switch to the bundle plan (`{orderBumpConfig.bundlePlan.id}`) and
                re-run `WhopCheckout.mount()`.
              </p>
            </header>

            <OrderBumpCheckout config={orderBumpConfig} prefill={prefill} />

            <InAppPurchaseButton planId={orderBumpConfig.bundlePlan.id} />

            <footer className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 text-xs leading-relaxed text-slate-500">
              <p>
                Tip: swap the plan IDs in <code>.env.local</code>, then reload inside the Whop dev
                proxy. The wrapper never reaches into the iframe—plan-based embeds give you a safe
                way to control pricing and metadata from the outside.
              </p>
            </footer>
          </div>
        </section>

        <div className="mt-16 px-6">
          <ExperienceInsights />
        </div>

        <DocumentationLinks />
      </main>
    )
  } catch (error) {
    const message =
      error instanceof ExperienceAccessError
        ? error.message
        : 'We could not verify your Whop session.'

    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_#f8fafc,_#e2e8f0)] px-6">
        <div className="max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-2xl shadow-slate-900/15">
          <h1 className="text-2xl font-semibold text-slate-900">Secure access required</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{message}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500">
            Hint: launch the dev proxy inside Whop or enable WHOP_DEV_BYPASS=true locally.
          </p>
        </div>
      </main>
    )
  }
}

function DocumentationLinks() {
  const resources = [
    {
      href: 'https://docs.whop.com/apps/getting-started',
      title: 'Developer quick-start',
      description: 'Spin up the official Next.js template, enable the dev proxy, and ship faster.',
    },
    {
      href: 'https://docs.whop.com/apps/guides/payins',
      title: 'Checkout & pay-ins',
      description: 'Plan-based embeds, checkout configurations, and fulfilling purchases with webhooks.',
    },
    {
      href: 'https://docs.whop.com/apps/guides/webhooks',
      title: 'Webhooks & fulfillment',
      description: 'Verify signatures, differentiate app vs. company webhooks, and ship idempotent handlers.',
    },
  ]

  return (
    <section className="mx-auto mt-16 w-full max-w-5xl px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-xl shadow-slate-900/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Keep iterating with the latest docs
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Whop is evolving quickly—bookmark these pages for the freshest guidance on experience
              views, pay-ins, and developer tooling.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {resources.map((resource) => (
            <a
              key={resource.href}
              href={resource.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-slate-200 bg-white px-6 py-6 transition hover:border-sky-200 hover:shadow-lg hover:shadow-slate-900/10"
            >
              <h3 className="text-lg font-semibold text-slate-900 group-hover:text-sky-600">
                {resource.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{resource.description}</p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-sky-600">
                Read more <span aria-hidden>↗</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
