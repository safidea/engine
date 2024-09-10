import type { Config } from '@domain/entities/Action/spreadsheet/CreateXlsxFromTemplate'

export interface CreateXlsxFromTemplate extends Config {
  service: 'Spreadsheet'
  action: 'CreateXlsxFromTemplate'
}
