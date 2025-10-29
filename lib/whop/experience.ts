import type { AccessLevel } from '@whop/sdk/resources/shared'
import { headers } from 'next/headers'
import { cache } from 'react'

import { getWhopClient } from './client'

export interface ExperienceSession {
  userId: string
  accessLevel: AccessLevel
  hasAccess: boolean
  tokenVerified: boolean
}

export class ExperienceAccessError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ExperienceAccessError'
  }
}

const DEV_BYPASS =
  process.env.NODE_ENV !== 'production' && process.env.WHOP_DEV_BYPASS === 'true'

export const getExperienceSession = cache(async (experienceId: string) => {
  if (!experienceId) {
    throw new ExperienceAccessError('Missing experience id in route params')
  }

  if (DEV_BYPASS) {
    return {
      userId: process.env.WHOP_DEV_USER_ID || 'dev-user',
      accessLevel: (process.env.WHOP_DEV_ACCESS_LEVEL as AccessLevel) || 'admin',
      hasAccess: true,
      tokenVerified: false,
    } satisfies ExperienceSession
  }

  const whop = getWhopClient()

  try {
    const headerList = headers()
    const verification = await whop.verifyUserToken(headerList)

    const access = await whop.users.checkAccess(experienceId, {
      id: verification.userId,
    })

    if (!access.has_access) {
      throw new ExperienceAccessError('User does not have access to this experience')
    }

    return {
      userId: verification.userId,
      accessLevel: access.access_level,
      hasAccess: access.has_access,
      tokenVerified: true,
    } satisfies ExperienceSession
  } catch (error) {
    if (error instanceof ExperienceAccessError) {
      throw error
    }

    throw new ExperienceAccessError(
      error instanceof Error ? error.message : 'Unable to verify Whop user token'
    )
  }
})
