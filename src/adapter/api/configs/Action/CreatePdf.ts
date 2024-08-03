import type { OutputParser } from '@domain/services/Template'
import type { Base } from './base'

export interface CreatePdf extends Base {
  action: 'CreatePdf'
  input?: {
    [key: string]: {
      type: OutputParser
      value: string
    }
  }
  template: string
}
