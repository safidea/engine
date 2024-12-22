import { FillEvent } from '@domain/entities/Event/Fill'
import type { IFillEvent } from '@adapter/api/configs/Event/Fill'

export class FillEventMapper {
  static toEntity = (config: IFillEvent): FillEvent => {
    return new FillEvent(config)
  }

  static toManyEntities = (configs: IFillEvent[]): FillEvent[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
