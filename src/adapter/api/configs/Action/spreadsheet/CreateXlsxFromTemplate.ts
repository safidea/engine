import type { OutputParser } from '@domain/services/Template'
import type { Base } from '../base'

export interface CreateXlsxFromTemplate extends Base {
  service: 'Spreadsheet'
  action: 'CreateXlsxFromTemplate'
  input?: {
    [key: string]: {
      type: OutputParser
      value: string
    }
  }
  templatePath: string
  fileName: string
  bucket: string
}
