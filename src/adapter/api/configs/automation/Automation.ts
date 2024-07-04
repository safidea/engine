import type { Config as Mailer } from '@domain/services/Mailer'
import type { Config as Database } from '@domain/services/Database'
import type { Action } from './action'
import type { Trigger } from './trigger'

export interface Automation {
  name: string
  trigger: Trigger
  actions: Action[]
  mailer?: Mailer
  database?: Database
}

export type AutomationSchema = Automation
