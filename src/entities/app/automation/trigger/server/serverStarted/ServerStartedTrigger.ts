import { AppDrivers } from '@entities/app/App'
import { BaseTrigger } from '../../base/BaseTrigger'
import { ServerStartedTriggerParams } from './ServerStartedTriggerParams'
import { AutomationConfig } from '../../../Automation'

export class ServerStartedTrigger extends BaseTrigger {
  constructor(params: ServerStartedTriggerParams, drivers: AppDrivers, config: AutomationConfig) {
    const { event } = params
    super({ event }, drivers, config)
  }

  shouldTrigger(event: string): boolean {
    return super.shouldTriggerEvent(event)
  }
}
