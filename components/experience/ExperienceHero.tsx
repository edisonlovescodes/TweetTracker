import type { ExperienceSession } from '@/lib/whop/experience'
import type { OrderBumpConfig } from '@/lib/config/order-bump'
import clsx from 'clsx'

interface ExperienceHeroProps {
  config: OrderBumpConfig
  session: ExperienceSession
}

const ACCESS_COPY: Record<ExperienceSession['accessLevel'], { label: string; tone: string }> = {
  admin: { label: 'Creator dashboard view', tone: 'bg-emerald-500/10 text-emerald-600' },
  customer: { label: 'Member experience view', tone: 'bg-sky-500/10 text-sky-600' },
  no_access: { label: 'Access pending', tone: 'bg-rose-500/10 text-rose-600' },
}

export function ExperienceHero({ config, session }: ExperienceHeroProps) {
  const accessState = ACCESS_COPY[session.accessLevel] ?? ACCESS_COPY.no_access

  return (
    <header className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-14 text-slate-900 sm:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-900/5 px-4 py-1 text-sm font-medium uppercase tracking-[0.18em] text-slate-700">
          {config.hero.eyebrow}
        </span>
        <span
          className={clsx(
            'inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold',
            accessState.tone
          )}
        >
          <span className="h-2.5 w-2.5 rounded-full bg-current" aria-hidden />
          {accessState.label}
        </span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-6">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-950 md:text-5xl">
            {config.hero.title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
            {config.hero.subtitle}
          </p>

          <dl className="grid gap-6 sm:grid-cols-3">
            {config.hero.bullets.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm shadow-slate-900/5"
              >
                <dt className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                  {item.title}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-slate-600">{item.body}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-xl shadow-slate-900/10 backdrop-blur">
          <div className="space-y-3">
            {config.basePlan.copy.badge ? (
              <span className="inline-flex rounded-full bg-slate-900 text-xs font-semibold uppercase tracking-[0.24em] text-white/90 px-3 py-1">
                {config.basePlan.copy.badge}
              </span>
            ) : null}
            <h2 className="text-2xl font-semibold text-slate-950">
              {config.basePlan.copy.headline}
            </h2>
            <p className="text-sm leading-relaxed text-slate-500">
              {config.basePlan.copy.description}
            </p>
          </div>
          <div className="mt-6 flex items-baseline gap-2 text-slate-900">
            <span className="text-4xl font-bold">{config.basePlan.copy.price}</span>
            <span className="text-sm text-slate-500">one-time</span>
          </div>
          <ul className="mt-6 space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-600">
                ✓
              </span>
              Complete plan-based embed template with install notes
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-600">
                ✓
              </span>
              Adjustable frosted UI shell with dark/light theming
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-xs font-semibold text-emerald-600">
                ✓
              </span>
              Inline doc links for apps, payouts, and distribution playbook
            </li>
          </ul>
        </aside>
      </div>
    </header>
  )
}
