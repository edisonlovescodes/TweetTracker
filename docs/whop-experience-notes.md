# Whop Experience View Notes

These are the key takeaways collected while building the checkout order-bump experience. Everything below is sourced from the current public docs (October 2025) and verified during implementation.

## Experience vs. Dashboard views
- **Experience** pages load on `/experiences/[experienceId]` inside the member sidebar. Whop injects the `x-whop-user-token` header so the app can verify and personalize securely.
- **Dashboard** pages load on `/dashboard/[companyId]` for creators/admins. They use the same token verification flow but should expect different access levels.
- Creators can install multiple instances of the same app; use the dynamic route param to look up the right plan/product mapping or workspace configuration.

## Token verification & permissions
- Call `client.verifyUserToken(headers())` (or `verifyUserToken(request)`) to authenticate the iframe request. The payload includes `sub` (user id) and `aud` (app id).
- Always follow up with `client.users.checkAccess(experienceId, { id: userId })` to confirm the member has access. Expect `access_level` values `admin`, `customer`, or `no_access`.
- Permissions are configured in the app dashboard and surfaced during install. Request the minimum scopes; creators can see your permission list before approving.

## Checkout embeds & order bumps
- Use **plan-based embeds** (plan IDs start with `plan_`). Switching between plans is the supported way to show order bumps—never try to modify the iframe contents directly.
- All styling happens outside the iframe. Use your own wrapper card + data attributes (`data-whop-checkout-theme`, `data-whop-checkout-theme-accent-color`) to influence the internal palette.
- Prefills support email, name, and address attributes via `data-whop-checkout-prefill-*`. URL query parameters + localStorage work well for multi-step funnels.

## Payments & upsells
- You must create both a base plan and a bundle plan if you want the checkout to reflect the combined price when the bump is enabled.
- The iframe SDK exposes `WhopCheckout.inAppPurchase(...)` for post-checkout upsells. Trigger it inside the Whop iframe after the initial payment succeeds.
- For one-click upsells via automation platforms (Make/Zapier), capture `payment_id` from the redirect querystring and use the SDK to create a checkout request against the saved payment method.

## Webhooks & fulfillment
- Configure the webhook secret in the app dashboard, then call `client.webhooks.unwrap(body, { headers, key })` in your handler to verify signatures.
- **App webhooks** require the `webhook_receive:*` permissions and deliver events for every company that installs your app. **Company webhooks** only fire for your business.
- Common events for checkout flows: `payment.succeeded`, `membership.activated`, `membership.deactivated`, and `payment.failed`.
- Add idempotency storage (e.g., Redis or database) keyed by the webhook `id` to avoid duplicate processing.

## Rate limits & performance
- `/v5/*` endpoints: **20 requests / 10 seconds** then a 60-second cooldown.
- `/v2/*` endpoints: **100 requests / 10 seconds** (deprecated but still in circulation for some references).
- Batch reads when possible and cache plan/product metadata on your side to stay inside rate limits.

## Distribution & review
- Apps can be distributed privately via a direct install URL or submitted to the Discover/App Store.
- Store submission requires a working end-to-end flow, minimal permissions, polished light/dark styling, and marketing assets (icon, screenshots, 15-second clip).

## Useful doc links
- App views: https://docs.whop.com/apps/guides/app-views
- Getting started: https://docs.whop.com/apps/getting-started
- Checkout embeds: https://docs.whop.com/payments/checkout-embed
- Pay-ins: https://docs.whop.com/apps/guides/payins
- Permissions: https://docs.whop.com/apps/guides/permissions
- Webhooks: https://docs.whop.com/apps/guides/webhooks
- Rate limits: https://docs.whop.com/api-reference/v2/rate-limits
