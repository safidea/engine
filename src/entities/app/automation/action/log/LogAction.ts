import { BaseAction } from '../base/BaseAction'
import { LogActionParams } from './LogActionParams'
import { AppServices } from '@entities/app/App'
import { AutomationConfig } from '../../Automation'

export class LogAction extends BaseAction {
  message: string

  constructor(params: LogActionParams, services: AppServices, config: AutomationConfig) {
    const { name, type, message } = params
    super({ name, type }, services, config)
    this.message = message
  }

  execute() {
    this.services.logger(this.message)
  }
}
