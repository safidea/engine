import { ConfigService } from 'foundation-common/server'

import type { NextApiRequest, NextApiResponse, NextMiddleware } from 'foundation-common'
import type { Config } from '../../types'

export async function validateAutomationExist(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextMiddleware
) {
  const { automations } = (await ConfigService.get()) as Config
  if (!automations) {
    return res.status(404).json({
      error: `No automations found`,
    })
  }
  const automation = automations[req.query.automation]
  if (!automation) {
    return res.status(404).json({
      error: `Automation ${req.query.automation} does not exist`,
    })
  }
  req.locals.automation = automation
  return next()
}
