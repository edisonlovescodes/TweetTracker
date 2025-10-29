import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_#f8fafc,_#e2e8f0)] px-6 py-20 text-center text-slate-800">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
        Whop Checkout CRO Lab
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
        Drop this Next.js app into the Whop dev proxy to explore a production-ready experience view
        with plan-based checkout embeds, order bump toggles, and webhook-ready scaffolding.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold">
        <Link
          href="/experiences/demo-experience"
          className="rounded-full bg-slate-900 px-6 py-3 text-white shadow-lg shadow-slate-900/15"
        >
          Open sample experience
        </Link>
        <a
          href="https://docs.whop.com/apps/guides/app-views"
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-slate-300 px-6 py-3 text-slate-700 hover:border-slate-400"
        >
          Learn about experience views ↗
        </a>
      </div>
    </main>
  )
}
