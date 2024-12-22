import { ClickEvent } from '@domain/entities/Event/Click'
import type { IClickEvent } from '@adapter/api/configs/Event/Click'

export class ClickEventMapper {
  static toEntity = (config: IClickEvent): ClickEvent => {
    return new ClickEvent(config)
  }

  static toManyEntities = (configs: IClickEvent[]): ClickEvent[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
