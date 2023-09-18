import { BaseAction } from '../base/BaseAction'
import { LogActionParams } from './LogActionParams'
import { AutomationConfig } from '../../Automation'
import { AutomationServices } from '../../AutomationServices'

export class LogAction extends BaseAction {
  message: string

  constructor(params: LogActionParams, services: AutomationServices, config: AutomationConfig) {
    const { name, type, message } = params
    super({ name, type }, services, config)
    this.message = message
  }

  execute() {
    this.services.logger.log(this.message)
  }
}
