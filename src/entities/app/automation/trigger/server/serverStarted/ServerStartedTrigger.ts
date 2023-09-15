import { AppServices } from '@entities/app/App'
import { BaseTrigger } from '../../base/BaseTrigger'
import { ServerStartedTriggerParams } from './ServerStartedTriggerParams'
import { AutomationConfig } from '../../../Automation'

export class ServerStartedTrigger extends BaseTrigger {
  constructor(params: ServerStartedTriggerParams, services: AppServices, config: AutomationConfig) {
    const { event } = params
    super({ event }, services, config)
  }

  shouldTrigger(event: string): boolean {
    return super.shouldTriggerEvent(event)
  }
}
