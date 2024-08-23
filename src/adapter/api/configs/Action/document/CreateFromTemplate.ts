import type { OutputParser } from '@domain/services/Template'
import type { Base } from '../base'

export interface CreateFromTemplate extends Base {
  service: 'Document'
  action: 'CreateFromTemplate'
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
