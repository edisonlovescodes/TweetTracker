export interface PricingPlanCopy {
  headline: string
  description: string
  price: string
  badge?: string
}

export interface OrderBumpConfig {
  experienceName: string
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    bullets: Array<{ title: string; body: string }>
  }
  basePlan: {
    id: string
    copy: PricingPlanCopy
  }
  bundlePlan: {
    id: string
    productId?: string
    copy: PricingPlanCopy
    bullets: string[]
    warning: string
  }
  checkoutTheme: {
    mode: 'light' | 'dark' | 'system'
    accent: string
  }
}

const basePlanId = process.env.WHOP_BASE_PLAN_ID || 'plan_yourBasePlanId'
const bundlePlanId = process.env.WHOP_BUNDLE_PLAN_ID || 'plan_yourBundlePlanId'

export const orderBumpConfig: OrderBumpConfig = {
  experienceName: 'Checkout CRO Lab',
  hero: {
    eyebrow: 'Whop CRO Masterclass',
    title: 'Launch a high-converting Whop checkout in under an hour',
    subtitle:
      'Design, test, and iterate custom order bumps that plug directly into your Whop checkout flow—without touching the secure iframe.',
    bullets: [
      {
        title: 'Plan-based embed recipe',
        body: 'Use plan_ IDs to drive instant price swaps without touching the iframe internals.',
      },
      {
        title: 'Ready-to-ship wrapper UI',
        body: 'Frosted UI-inspired shell with responsive states, aria hints, and reduced-motion support.',
      },
      {
        title: 'Prefill & automation',
        body: 'URL + localStorage prefills, plus a Make scenario blueprint for one-click upsells.',
      },
    ],
  },
  basePlan: {
    id: basePlanId,
    copy: {
      headline: 'Creator Checkout Toolkit',
      description: 'Everything you need to ship a polished Whop checkout experience.',
      price: '$27',
      badge: 'Base plan',
    },
  },
  bundlePlan: {
    id: bundlePlanId,
    productId: process.env.WHOP_BUNDLE_PRODUCT_ID,
    copy: {
      headline: 'Creator Checkout Toolkit + Viral Hooks Bundle',
      description: 'Includes the swipe file, upsell automations, and implementation walkthroughs.',
      price: '$44 today',
      badge: 'Best value',
    },
    bullets: [
      '101 high-performing hook templates tested in live launches',
      'Plug-and-play Make scenario for one-click upsells',
      'Template snippets for GoHighLevel, ClickFunnels, and custom HTML',
    ],
    warning: 'This bundle is only unlocked during checkout. Once you leave this page, it is gone.',
  },
  checkoutTheme: {
    mode: (process.env.WHOP_CHECKOUT_THEME as 'light' | 'dark' | 'system') || 'light',
    accent: process.env.WHOP_CHECKOUT_ACCENT || 'sky',
  },
}
