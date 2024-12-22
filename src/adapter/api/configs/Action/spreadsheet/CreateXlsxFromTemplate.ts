import type { CreateXlsxFromTemplateSpreadsheetActionConfig } from '@domain/entities/Action/spreadsheet/CreateXlsxFromTemplate'

export interface ICreateXlsxFromTemplateSpreadsheetAction
  extends CreateXlsxFromTemplateSpreadsheetActionConfig {
  service: 'Spreadsheet'
  action: 'CreateXlsxFromTemplate'
}
