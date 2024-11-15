import type { CreatePdfFromXlsxSpreadsheetActionConfig } from '@domain/entities/Action/spreadsheet/CreatePdfFromXlsx'

export interface ICreatePdfFromXlsxSpreadsheetAction
  extends CreatePdfFromXlsxSpreadsheetActionConfig {
  service: 'Spreadsheet'
  action: 'CreatePdfFromXlsx'
}
