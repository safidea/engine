import { RouterService } from 'foundation-common/server'

import type { MiddlewareFunction } from 'foundation-common'

import * as AutomationController from '../controllers/automation.controller'
import * as AutomationMiddleware from '../middlewares/automation.middleware'

function all(): MiddlewareFunction[] {
  return [
    AutomationMiddleware.validateAutomationExist,
    AutomationMiddleware.validateInput,
    AutomationController.start,
  ]
}

export default RouterService({
  all,
})
