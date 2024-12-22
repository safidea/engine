import { OpenEvent } from '@domain/entities/Event/Open'
import type { IOpenEvent } from '@adapter/api/configs/Event/Open'

export class OpenEventMapper {
  static toEntity = (config: IOpenEvent): OpenEvent => {
    return new OpenEvent(config)
  }

  static toManyEntities = (configs: IOpenEvent[]): OpenEvent[] => {
    return configs.map((config) => this.toEntity(config))
  }
}
