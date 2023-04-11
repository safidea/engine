import { AutomationService } from '../services/automation.service'

import type { NextApiRequest, NextApiResponse, NextMiddleware } from 'foundation-common'

export async function validateAutomationExist(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextMiddleware
) {
  if (!AutomationService.get(String(req.query.automation))) {
    return res.status(404).json({
      error: `Automation ${req.query.automation} does not exist`,
    })
  }
  req.locals.automation = req.query.automation
  return next()
}

export async function validateInput(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextMiddleware
) {
  const input = req.method !== 'GET' ? req.body : req.query
  const errors = AutomationService.validateInput(req.locals.automation, input)
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Invalid input',
      details: errors,
    })
  }
  req.locals.input = input
  return next()
}
