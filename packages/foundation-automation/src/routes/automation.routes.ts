import { RouterService } from 'foundation-common'

import type { MiddlewareFunction } from 'foundation-common'

import * as AutomationController from '../controllers/automation.controller'
import * as AutomationMiddleware from '../middlewares/automation.middleware'

function post(): MiddlewareFunction[] {
  return [AutomationMiddleware.validateAutomationExist, AutomationController.start]
}

export default RouterService.handler({
  post,
})
