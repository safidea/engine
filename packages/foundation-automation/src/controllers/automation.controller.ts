import * as AutomationService from '../services/automation.service'

import type { NextApiRequest, NextApiResponse } from 'foundation-common'

export async function start(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  const result = await AutomationService.start(req.locals.automation, req.body)
  res.status(200).json(result)
}
