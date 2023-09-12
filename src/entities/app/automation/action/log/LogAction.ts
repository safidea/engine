import { BaseAction } from '../base/BaseAction'
import { LogActionOptions } from './LogActionOptions'
import { AppDrivers } from '@entities/app/App'
import { AutomationConfig } from '../../Automation'

export class LogAction extends BaseAction {
  message: string

  constructor(options: LogActionOptions, drivers: AppDrivers, config: AutomationConfig) {
    const { name, type, message } = options
    super({ name, type }, drivers, config)
    this.message = message
  }

  execute() {
    this.drivers.logger(this.message)
  }
}
