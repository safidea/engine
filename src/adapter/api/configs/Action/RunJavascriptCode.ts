import type { Base } from './base'

export interface RunJavascriptCode extends Base {
  action: 'RunJavascriptCode'
  inputs: { [key: string]: string | number | boolean }
  code: string
}
