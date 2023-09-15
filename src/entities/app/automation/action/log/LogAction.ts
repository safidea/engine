import { BaseAction } from '../base/BaseAction'
import { LogActionParams } from './LogActionParams'
import { AppDrivers } from '@entities/app/App'
import { AutomationConfig } from '../../Automation'

export class LogAction extends BaseAction {
  message: string

  constructor(params: LogActionParams, drivers: AppDrivers, config: AutomationConfig) {
    const { name, type, message } = params
    super({ name, type }, drivers, config)
    this.message = message
  }

  execute() {
    this.drivers.logger(this.message)
  }
}
