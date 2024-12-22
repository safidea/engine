import {
  RecordCreatedDatabaseTrigger,
  type RecordCreatedDatabaseTriggerConfig,
  type RecordCreatedDatabaseTriggerServices,
} from '@domain/entities/Trigger/database/RecordCreated'

export class RecordCreatedDatabaseTriggerMapper {
  static toEntity = (
    config: RecordCreatedDatabaseTriggerConfig,
    services: RecordCreatedDatabaseTriggerServices
  ): RecordCreatedDatabaseTrigger => {
    return new RecordCreatedDatabaseTrigger(config, services)
  }

  static toManyEntities = (
    configs: RecordCreatedDatabaseTriggerConfig[],
    services: RecordCreatedDatabaseTriggerServices
  ): RecordCreatedDatabaseTrigger[] => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
