import {
  CreateXlsxFromTemplateSpreadsheetAction,
  type CreateXlsxFromTemplateSpreadsheetActionConfig,
  type CreateXlsxFromTemplateSpreadsheetActionEntities,
  type CreateXlsxFromTemplateSpreadsheetActionServices,
} from '@domain/entities/Action/spreadsheet/CreateXlsxFromTemplate'

export type CreateXlsxFromTemplateSpreadsheetActionMapperServices =
  CreateXlsxFromTemplateSpreadsheetActionServices

export class CreateXlsxFromTemplateSpreadsheetActionMapper {
  static toEntity = (
    config: CreateXlsxFromTemplateSpreadsheetActionConfig,
    services: CreateXlsxFromTemplateSpreadsheetActionMapperServices,
    entities: CreateXlsxFromTemplateSpreadsheetActionEntities
  ): CreateXlsxFromTemplateSpreadsheetAction => {
    return new CreateXlsxFromTemplateSpreadsheetAction(config, services, entities)
  }
}
