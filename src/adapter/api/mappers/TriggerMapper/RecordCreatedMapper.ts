import { RecordCreated, type Config, type Services } from '@domain/entities/Trigger/RecordCreated'

export class RecordCreatedMapper {
  static toEntity = (config: Config, services: Services): RecordCreated => {
    return new RecordCreated(config, services)
  }

  static toManyEntities = (configs: Config[], services: Services): RecordCreated[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
