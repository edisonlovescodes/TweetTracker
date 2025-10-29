const insights = [
  {
    title: 'Experience views live in the sidebar',
    body: 'When members open your app inside Whop, the platform hits `/experiences/[experienceId]` and injects the `x-whop-user-token` header so you can personalize safely.',
    link: {
      label: 'View docs',
      href: 'https://docs.whop.com/apps/guides/app-views',
    },
  },
  {
    title: 'Token verify → permission check',
    body: 'Always verify the signed token and then call `users.checkAccess`. It returns `admin`, `customer`, or `no_access` so you can branch experiences or block install testing.',
    link: {
      label: 'Permissions',
      href: 'https://docs.whop.com/apps/guides/permissions',
    },
  },
  {
    title: 'Unlimited instances are supported',
    body: 'Creators can drop multiple experiences or dashboards into a single whop. Read the `experienceId` param to load the right plan or workspace for each install.',
    link: {
      label: 'What are Whop apps?',
      href: 'https://docs.whop.com/whop-apps/what-are-whop-apps',
    },
  },
]

export function ExperienceInsights() {
  return (
    <section className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200 bg-white/80 px-8 py-12 shadow-lg shadow-slate-900/10 backdrop-blur">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Shipping fan-favorite experiences
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Experience pages power member-facing surfaces. Verify, personalize, and keep things
            fast—this blueprint gives you a head start.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {insights.map((item) => (
          <article
            key={item.title}
            className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white px-6 py-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.body}</p>
            </div>
            <a
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-500"
              href={item.link.href}
              target="_blank"
              rel="noreferrer"
            >
              {item.link.label}
              <span aria-hidden>↗</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
