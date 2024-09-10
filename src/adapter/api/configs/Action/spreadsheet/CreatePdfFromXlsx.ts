import type { Config } from '@domain/entities/Action/spreadsheet/CreatePdfFromXlsx'

export interface CreatePdfFromXlsx extends Config {
  service: 'Spreadsheet'
  action: 'CreatePdfFromXlsx'
}
