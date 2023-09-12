import { AppDrivers } from '@entities/app/App'
import { AutomationConfig } from '../../../Automation'
import { BaseTrigger } from '../../base/BaseTrigger'
import { ServerStoppedTriggerOptions } from './ServerStoppedTriggerOptions'

export class ServerStoppedTrigger extends BaseTrigger {
  constructor(options: ServerStoppedTriggerOptions, drivers: AppDrivers, config: AutomationConfig) {
    const { event } = options
    super({ event }, drivers, config)
  }

  shouldTrigger(event: string): boolean {
    return super.shouldTriggerEvent(event)
  }
}
