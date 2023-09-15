import { AppDrivers } from '@entities/app/App'
import { AutomationConfig } from '../../../Automation'
import { BaseTrigger } from '../../base/BaseTrigger'
import { ServerStoppedTriggerParams } from './ServerStoppedTriggerParams'

export class ServerStoppedTrigger extends BaseTrigger {
  constructor(params: ServerStoppedTriggerParams, drivers: AppDrivers, config: AutomationConfig) {
    const { event } = params
    super({ event }, drivers, config)
  }

  shouldTrigger(event: string): boolean {
    return super.shouldTriggerEvent(event)
  }
}
