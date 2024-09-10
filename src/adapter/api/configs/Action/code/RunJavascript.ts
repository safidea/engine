import type { Config } from '@domain/entities/Action/code/RunJavascript'

export interface RunJavascript extends Config {
  service: 'Code'
  action: 'RunJavascript'
}
