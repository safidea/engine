import type { OutputParser } from '@domain/services/Template'
import type { Base } from '../base'

export interface CreateDocxFromTemplate extends Base {
  service: 'Document'
  action: 'CreateDocxFromTemplate'
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
