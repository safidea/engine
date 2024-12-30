import {
  TablePageCreatedNotionTrigger,
  type TablePageCreatedNotionTriggerConfig,
  type TablePageCreatedNotionTriggerIntegrations,
  type TablePageCreatedNotionTriggerServices,
} from '@domain/entities/Trigger/notion/TablePageCreated'

export class TablePageCreatedNotionTriggerMapper {
  static toEntity = (
    config: TablePageCreatedNotionTriggerConfig,
    services: TablePageCreatedNotionTriggerServices,
    integration: TablePageCreatedNotionTriggerIntegrations
  ): TablePageCreatedNotionTrigger => {
    return new TablePageCreatedNotionTrigger(config, services, integration)
  }

  static toManyEntities = (
    configs: TablePageCreatedNotionTriggerConfig[],
    services: TablePageCreatedNotionTriggerServices,
    integration: TablePageCreatedNotionTriggerIntegrations
  ): TablePageCreatedNotionTrigger[] => {
    return configs.map((config) => this.toEntity(config, services, integration))
  }
}
