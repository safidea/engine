import type { OutputParser } from '@domain/services/Template'
import type { Base } from './base'

export interface RunJavascriptCode extends Base {
  action: 'RunJavascriptCode'
  input?: {
    [key: string]: {
      type: OutputParser
      value: string
    }
  }
  code: string
}
