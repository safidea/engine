import type { OutputParser } from '@domain/services/Template'
import type { Base } from '../base'

export interface RunJavascript extends Base {
  service: 'Code'
  action: 'RunJavascript'
  input?: {
    [key: string]: {
      type: OutputParser
      value: string
    }
  }
  code: string
}
