import {
  CreateXlsxFromTemplate,
  type Config,
  type Entities,
  type Services,
} from '@domain/entities/Action/spreadsheet/CreateXlsxFromTemplate'

export class CreateXlsxFromTemplateMapper {
  static toEntity = (
    config: Config,
    services: Services,
    entities: Entities
  ): CreateXlsxFromTemplate => {
    return new CreateXlsxFromTemplate(config, services, entities)
  }
}
