import { AppDrivers } from '@entities/app/App'
import { BaseTrigger } from './BaseTrigger'
import { ServerStartedTriggerOptions } from './ServerStartedTriggerOptions'
import { AutomationConfig } from '../Automation'

export class ServerStartedTrigger extends BaseTrigger {
  constructor(options: ServerStartedTriggerOptions, drivers: AppDrivers, config: AutomationConfig) {
    const { event } = options
    super({ event }, drivers, config)
  }

  shouldTrigger(event: string): boolean {
    return super.shouldTriggerEvent(event)
  }
}
