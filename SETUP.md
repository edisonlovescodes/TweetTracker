# Setup Instructions

This checklist walks you from a fresh clone to a working Whop checkout experience in the dev proxy.

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Create `.env.local` and copy the template from `.env.local.example`. Fill in:

- `WHOP_API_KEY` – App API key from Whop Developer Dashboard  
- `WHOP_APP_ID` – App ID (also shown in the dashboard)  
- `WHOP_WEBHOOK_SECRET` – Found under the Webhooks tab of the app settings  
- `WHOP_BASE_PLAN_ID` – Plan ID for the base offer (no bump)  
- `WHOP_BUNDLE_PLAN_ID` – Plan ID that bundles the order bump  
- `WHOP_BUNDLE_PRODUCT_ID` – Optional product ID for analytics/SDK calls  
- `WHOP_CHECKOUT_THEME` / `WHOP_CHECKOUT_ACCENT` – Theme knobs for the iframe  
- Optional dev helpers: `WHOP_DEV_BYPASS`, `WHOP_DEV_USER_ID`, `WHOP_DEV_ACCESS_LEVEL`

> ⚠️ Do **not** enable `WHOP_DEV_BYPASS` in production—it intentionally skips token verification for local work outside the Whop iframe.

## 3. Run the dev server

```bash
npm run dev
```

Open:

- `http://localhost:3000/` – landing instructions  
- `http://localhost:3000/experiences/demo-experience` – experience view preview

If you enabled the dev bypass you can test the wrapper UI here. Otherwise, continue to the dev proxy.

## 4. Attach to the Whop dev proxy

1. In the Whop developer dashboard, open your app → **Develop** tab.
2. Enable the dev proxy and set the proxy URL to `http://localhost:3000`.
3. Launch the app from a test community sidebar. Whop inserts the `x-whop-user-token` header and you’ll see access state + order bump demo.
4. Toggle the bump to confirm the plan swap, and try the in-app purchase button (works only inside the iframe).

## 5. Webhook testing

The webhook handler lives at `/api/webhooks`.

- Point a Whop webhook (app or company scope) to `https://your-domain.com/api/webhooks`.
- Use the same `WHOP_WEBHOOK_SECRET` in both Whop and your environment.
- Inspect logs to verify `payment.succeeded` or `membership.activated` events reach the server.

For local testing you can forward the endpoint with `ngrok` or replay payloads using the Whop CLI.

## 6. Production build check

```bash
npm run build
```

This validates TypeScript and produces an optimized Next.js build. Dynamic routes remain server-rendered (`λ` in the output).

## 7. Next steps

- Update `lib/config/order-bump.ts` with your real marketing copy and plan IDs.
- Wire actual fulfillment logic inside `app/api/webhooks/route.ts`.
- Review [`docs/whop-experience-notes.md`](./docs/whop-experience-notes.md) for implementation callouts.

Need the full deploy story? Jump to [`DEPLOY.md`](./DEPLOY.md).
