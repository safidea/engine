import {
  CreateDocxFromTemplate,
  type Config,
  type Entities,
  type Services,
} from '@domain/entities/Action/document/CreateDocxFromTemplate'

export class CreateDocxFromTemplateMapper {
  static toEntity = (
    config: Config,
    services: Services,
    entities: Entities
  ): CreateDocxFromTemplate => {
    return new CreateDocxFromTemplate(config, services, entities)
  }
}
