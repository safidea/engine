import type { Context } from '../Automation/Context'

export interface BaseConfig {
  automation: string
}

export interface Base {
  init: (run: (triggerData: object) => Promise<Context>) => Promise<void>
}
