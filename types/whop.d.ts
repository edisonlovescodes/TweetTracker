export {}

declare global {
  interface Window {
    WhopCheckout?: {
      mount: () => void
      inAppPurchase?: (options: {
        planId: string
        metadata?: Record<string, unknown>
      }) => Promise<{ status: 'success' | 'pending' | 'error' }>
    }
  }
}
