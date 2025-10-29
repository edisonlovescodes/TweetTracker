import Whop from '@whop/sdk'

let client: Whop | null = null

export function getWhopClient() {
  if (client) return client

  const apiKey = process.env.WHOP_API_KEY
  const appID = process.env.WHOP_APP_ID

  if (!apiKey) {
    throw new Error('Missing WHOP_API_KEY. Set it in your environment to use the Whop SDK.')
  }

  if (!appID) {
    throw new Error('Missing WHOP_APP_ID. Set it in your environment to verify user tokens.')
  }

  client = new Whop({
    apiKey,
    appID,
  })

  return client
}
