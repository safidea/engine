import type { Database } from '../Database'
import type { Mailer } from '../Mailer'
import type { Action } from './action'
import type { Trigger } from './trigger'

export interface Automation {
  name: string
  trigger: Trigger
  actions: Action[]
  mailer?: Partial<Mailer>
  database?: Partial<Database>
}

export type AutomationSchema = Automation
