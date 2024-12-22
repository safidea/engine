import {
  CreatePdfFromXlsxSpreadsheetAction,
  type CreatePdfFromXlsxSpreadsheetActionConfig,
  type CreatePdfFromXlsxSpreadsheetActionEntities,
  type CreatePdfFromXlsxSpreadsheetActionServices,
} from '@domain/entities/Action/spreadsheet/CreatePdfFromXlsx'

export type CreatePdfFromXlsxSpreadsheetActionMapperServices =
  CreatePdfFromXlsxSpreadsheetActionServices

export class CreatePdfFromXlsxSpreadsheetActionMapper {
  static toEntity = (
    config: CreatePdfFromXlsxSpreadsheetActionConfig,
    services: CreatePdfFromXlsxSpreadsheetActionMapperServices,
    entities: CreatePdfFromXlsxSpreadsheetActionEntities
  ): CreatePdfFromXlsxSpreadsheetAction => {
    return new CreatePdfFromXlsxSpreadsheetAction(config, services, entities)
  }
}
