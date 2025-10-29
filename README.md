# Whop Checkout CRO Lab

An end-to-end Whop **experience view** that verifies the signed user token, checks access, renders a CRO-optimized plan-based checkout embed with an interactive order bump, exposes an in-app purchase trigger, and ships a webhook handler ready for fulfillment automations.

> ℹ️ The legacy “Twitter Monitor” prototype is still in the repo for reference, but this README, setup flow, and deployment guidance now target the checkout experience.

## Highlights

- ✅ **Experience view ready** – mounts on `/experiences/[experienceId]`, verifies `x-whop-user-token`, and branches on `users.checkAccess`.
- 🧊 **Frosted UI-inspired wrapper** – responsive, accessible card around the secure Whop iframe with flashing bump arrow, reduced-motion support, and live loading states.
- 🔄 **Plan-based order bump** – toggles between base & bundle `plan_` IDs, preserving prefills (URL, localStorage, affiliate code) and re-invoking `WhopCheckout.mount()`.
- 🛒 **In-app purchase button** – demonstrates calling `window.WhopCheckout.inAppPurchase` for post-checkout upsells (no-op outside the Whop iframe).
- 📬 **Webhook scaffolding** – `/api/webhooks` verifies signatures via the SDK, logs `payment.succeeded` and `membership.activated`, and is ready for fulfillment logic.
- 📚 **Research-driven guidance** – experience view best practices, permissions, rate limits, and doc links surfaced throughout the UI and documentation.

## Getting Started

### 1. Clone & install

```bash
npm install
```

### 2. Configure environment

Copy `.env.local.example` to `.env.local` and fill in Whop credentials:

```bash
WHOP_API_KEY=api_xxxxxxxxx
WHOP_APP_ID=app_xxxxxxxxx
WHOP_WEBHOOK_SECRET=whsec_xxxxxxxxx
WHOP_BASE_PLAN_ID=plan_baseOnly
WHOP_BUNDLE_PLAN_ID=plan_bundleUpgrade
WHOP_BUNDLE_PRODUCT_ID=prod_optional
WHOP_CHECKOUT_THEME=light
WHOP_CHECKOUT_ACCENT=sky
# Local-only escape hatch (never turn on in production)
# WHOP_DEV_BYPASS=true
# WHOP_DEV_USER_ID=dev-user
# WHOP_DEV_ACCESS_LEVEL=admin
```

- `WHOP_API_KEY` / `WHOP_APP_ID` come from the Whop Developer Dashboard.
- `WHOP_WEBHOOK_SECRET` is found on the Webhooks tab of your app.
- Plan/product IDs come from the Plans screen (create both base & bundle plans before testing).
- Optional dev bypass lets you run the page outside Whop while building the wrapper UI.

### 3. Run locally

```bash
npm run dev
```

Visit:

- Landing intro: `http://localhost:3000/`
- Experience view: `http://localhost:3000/experiences/demo-experience`

When running inside the Whop dev proxy the platform injects `x-whop-user-token`, so leave `WHOP_DEV_BYPASS` set to `false`. For pure front-end work outside the iframe you can enable the bypass (again: never in production).

### 4. Test inside Whop

1. Create a dev app in Whop → copy the app ID & API key.
2. Enable the dev proxy and point the proxy URL at your local server (`http://localhost:3000`).
3. Load the experience from the Whop sidebar; you should see the verified state and order bump interactivity.
4. Toggle the bump—watch the plan ID noted in the helper text change to the bundle ID.

### 5. Webhook verification

The handler at `/api/webhooks` uses `client.webhooks.unwrap(...)` to verify signatures. Point a Whop webhook (app or company) to `https://your-domain.com/api/webhooks` and ensure `WHOP_WEBHOOK_SECRET` matches.

Locally, you can simulate events with a tool like `curl` via [`docs.whop.com/apps/guides/webhooks`](https://docs.whop.com/apps/guides/webhooks).

### 6. Build check

```bash
npm run build
```

This runs a production Next.js build (dynamic routes stay on-demand). If you link additional sub-projects inside this monorepo, make sure they’re excluded in `tsconfig.json`.

## Project Structure

```
app/
 ├─ page.tsx                      → landing helper
 ├─ experiences/[experienceId]/   → experience view entrypoint
 └─ api/webhooks/route.ts         → webhook verification
components/
 ├─ checkout/OrderBumpCheckout.tsx
 ├─ checkout/InAppPurchaseButton.tsx
 └─ experience/*                  → hero + research cards
lib/
 ├─ config/order-bump.ts          → marketing copy + plan IDs
 ├─ utils/prefill.ts              → URL/localStorage prefill resolver
 └─ whop/                         → SDK client + experience access helper
types/whop.d.ts                   → global typings for iframe SDK
```

The legacy Twitter monitor pages/API routes remain for reference but are excluded from the TypeScript build via `tsconfig.json`.

## Deployment (Vercel)

1. Ensure `npm run build` succeeds.
2. Commit + push to GitHub (see [`DEPLOY.md`](./DEPLOY.md) for git & Vercel walkthrough).
3. When importing into Vercel:
   - Framework: **Next.js** (auto)
   - Set environment variables from `.env.local`
   - Remove old cron job configuration unless you still rely on it (`vercel.json` is not required anymore for this experience).
4. After deployment, add a webhook in Whop pointing at your Vercel domain.

## Experience View Research Notes

- Experience surfaces live in the member sidebar (`/experiences/[experienceId]`) and always send the signed `x-whop-user-token`. Verify it before rendering personalized content.  
- After verification, call `client.users.checkAccess(experienceId, { id: userId })` to distinguish `admin`, `customer`, and `no_access`.  
- Creators can install multiple instances of your experience—use the route param to load the correct context or plan mapping.  
- `/v5/*` endpoints rate-limit at **20 req / 10s** with a 60-second cooldown; plan for caching and backoffs.  
- Only style the wrapper around the checkout iframe; use plan-based embeds plus attributes (theme/accent) to influence internal styling.

More notes live in [`docs/whop-experience-notes.md`](./docs/whop-experience-notes.md).

## Useful Links

- [App Views – Whop Docs](https://docs.whop.com/apps/guides/app-views)
- [Getting Started](https://docs.whop.com/apps/getting-started)
- [Pay-ins & Checkout Embeds](https://docs.whop.com/apps/guides/payins)
- [Webhooks](https://docs.whop.com/apps/guides/webhooks)
- [Permissions](https://docs.whop.com/apps/guides/permissions)

---

Built with 💡 for founders dialing in their Whop conversion flows. Ping [@edisonisgrowing](https://twitter.com/edisonisgrowing) if you ship something with it!
