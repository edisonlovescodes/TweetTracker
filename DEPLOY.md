# Deployment Guide

Ship the Whop checkout experience to Vercel and wire it to your live app.

## Prerequisites

- `.env.local` configured (API key, app ID, plan IDs, webhook secret)
- `npm run build` passes locally
- Git repository initialised (or linked to GitHub)

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "chore: bootstrap whop checkout lab"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/whop-checkout-lab.git
git push -u origin main
```

## 2. Import into Vercel

1. Visit [vercel.com/new](https://vercel.com/new) and pick the repository.
2. Framework preset: **Next.js** (auto detected).
3. Build command: `npm run build` (default).
4. Output directory: `.next`.
5. Add environment variables under **Settings → Environment Variables**:

```
WHOP_API_KEY=api_xxxxxxxxx
WHOP_APP_ID=app_xxxxxxxxx
WHOP_WEBHOOK_SECRET=whsec_xxxxxxxxx
WHOP_BASE_PLAN_ID=plan_baseOnly
WHOP_BUNDLE_PLAN_ID=plan_bundleUpgrade
WHOP_BUNDLE_PRODUCT_ID=prod_optional
WHOP_CHECKOUT_THEME=light
WHOP_CHECKOUT_ACCENT=sky
```

Apply them to Production, Preview, and Development.  
*(Optional)* Add `WHOP_DEV_BYPASS=true` **only** to Development environments if you need to preview the wrapper outside the iframe.

## 3. Deploy

Click **Deploy**. Vercel installs dependencies, runs `npm run build`, and hosts the app.

## 4. Hook up Whop webhooks

1. In the Whop dashboard, open your app → **Webhooks**.
2. Point a webhook at `https://your-vercel-domain.com/api/webhooks`.
3. Use the same secret you configured for `WHOP_WEBHOOK_SECRET`.
4. Trigger a test event and inspect Vercel → Functions logs to confirm verification succeeds.

## 5. Verify the experience view

- Enable the Whop dev proxy and set it to your Vercel URL, or rely on the live routing.
- Open the experience from a test community; confirm token verification, plan switching, and the in-app purchase button work inside the iframe.
- Update `lib/config/order-bump.ts` with production copy/plan IDs as needed.

## 6. Updates & rollbacks

- Push to `main`; Vercel redeploys automatically.
- To roll back, open Vercel → Deployments → pick a previous build → **Promote to Production**.

## 7. Notes

- Remove or update `vercel.json` if you no longer need legacy cron jobs.
- Use Vercel’s **Logs → Functions** tab to debug webhook handlers.
- Add custom domains via **Settings → Domains** and update DNS.

Need local setup details? See [`SETUP.md`](./SETUP.md). For Whop-specific research, reference [`docs/whop-experience-notes.md`](./docs/whop-experience-notes.md).
