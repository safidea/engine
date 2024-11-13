import {
  PageCreated,
  type Config,
  type Integrations,
  type Services,
} from '@domain/entities/Trigger/notion/PageCreated'

export class PageCreatedMapper {
  static toEntity = (
    config: Config,
    services: Services,
    integration: Integrations
  ): PageCreated => {
    return new PageCreated(config, services, integration)
  }

  static toManyEntities = (
    configs: Config[],
    services: Services,
    integration: Integrations
  ): PageCreated[] => {
    return configs.map((config) => this.toEntity(config, services, integration))
  }
}
