import type { OutputParser } from '@domain/services/Template'
import type { Base } from '../base'

export interface CreatePdfFromTemplate extends Base {
  service: 'Document'
  action: 'CreatePdfFromTemplate'
  input?: {
    [key: string]: {
      type: OutputParser
      value: string
    }
  }
  templatePath: string
}
