import * as AutomationService from '../services/automation.service'

import type { NextApiRequest, NextApiResponse } from 'foundation-common'

export async function start(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  return AutomationService.start(req.locals.automation, req.locals.input, (result) => {
    res.status(200).json(result)
  })
}
