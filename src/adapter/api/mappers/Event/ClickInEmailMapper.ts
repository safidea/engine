import { ClickInEmailEvent } from '@domain/entities/Event/ClickInEmail'
import type { IClickInEmailEvent } from '@adapter/api/configs/Event/ClickInEmail'

export class ClickInEmailEventMapper {
  static toEntity = (config: IClickInEmailEvent): ClickInEmailEvent => {
    return new ClickInEmailEvent(config)
  }

  static toManyEntities = (configs: IClickInEmailEvent[]): ClickInEmailEvent[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
