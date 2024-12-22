import {
  PageCreatedNotionTrigger,
  type PageCreatedNotionTriggerConfig,
  type PageCreatedNotionTriggerIntegrations,
  type PageCreatedNotionTriggerServices,
} from '@domain/entities/Trigger/notion/PageCreated'

export class PageCreatedNotionTriggerMapper {
  static toEntity = (
    config: PageCreatedNotionTriggerConfig,
    services: PageCreatedNotionTriggerServices,
    integration: PageCreatedNotionTriggerIntegrations
  ): PageCreatedNotionTrigger => {
    return new PageCreatedNotionTrigger(config, services, integration)
  }

  static toManyEntities = (
    configs: PageCreatedNotionTriggerConfig[],
    services: PageCreatedNotionTriggerServices,
    integration: PageCreatedNotionTriggerIntegrations
  ): PageCreatedNotionTrigger[] => {
    return configs.map((config) => this.toEntity(config, services, integration))
  }
}
