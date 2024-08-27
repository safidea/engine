import type { Base } from '../base'

export interface CreateHtmlFromXlsx extends Base {
  service: 'Spreadsheet'
  action: 'CreateHtmlFromXlsx'
  spreadsheetBucket: string
  spreadsheetFileId: string
  fileName: string
  bucket: string
}
