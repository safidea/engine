import { RecordCreated } from '@domain/entities/Trigger/RecordCreated'
import type { RecordCreated as Config } from '@adapter/api/configs/Trigger/RecordCreated'
import type { Queue } from '@domain/services/Queue'
import type { Realtime } from '@domain/services/Realtime'

interface MapperConfig extends Config {
  automation: string
}

interface Services {
  queue: Queue
  realtime: Realtime
}

export class RecordCreatedMapper {
  static toEntity = (config: MapperConfig, services: Services): RecordCreated => {
    return new RecordCreated(config, services)
  }

  static toManyEntities = (configs: MapperConfig[], services: Services): RecordCreated[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
