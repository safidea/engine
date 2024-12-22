import { WaitForAutomationEvent } from '@domain/entities/Event/WaitForAutomation'
import type { IWaitForAutomationEvent } from '@adapter/api/configs/Event/WaitForAutomation'

export class WaitForAutomationEventMapper {
  static toEntity = (config: IWaitForAutomationEvent): WaitForAutomationEvent => {
    return new WaitForAutomationEvent(config)
  }

  static toManyEntities = (configs: IWaitForAutomationEvent[]): WaitForAutomationEvent[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
