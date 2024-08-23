import type { OutputParser } from '@domain/services/Template'
import type { Base } from '../base'

export interface CreatePdfFromHtmlTemplate extends Base {
  service: 'Browser'
  action: 'CreatePdfFromHtmlTemplate'
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
