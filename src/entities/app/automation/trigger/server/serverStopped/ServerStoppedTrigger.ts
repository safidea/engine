import { AppServices } from '@entities/app/App'
import { AutomationConfig } from '../../../Automation'
import { BaseTrigger } from '../../base/BaseTrigger'
import { ServerStoppedTriggerParams } from './ServerStoppedTriggerParams'

export class ServerStoppedTrigger extends BaseTrigger {
  constructor(params: ServerStoppedTriggerParams, services: AppServices, config: AutomationConfig) {
    const { event } = params
    super({ event }, services, config)
  }

  shouldTrigger(event: string): boolean {
    return super.shouldTriggerEvent(event)
  }
}
