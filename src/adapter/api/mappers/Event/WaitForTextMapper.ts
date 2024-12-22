import { WaitForTextEvent } from '@domain/entities/Event/WaitForText'
import type { IWaitForTextEvent } from '@adapter/api/configs/Event/WaitForText'

export class WaitForTextEventMapper {
  static toEntity = (config: IWaitForTextEvent): WaitForTextEvent => {
    return new WaitForTextEvent(config)
  }

  static toManyEntities = (configs: IWaitForTextEvent[]): WaitForTextEvent[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
