import type { Auth } from './Auth'
import type { Database } from './Database'
import type { Feature } from './Feature'
import type { Mailer } from './Mailer'
import type { Server } from './Server'
import type { Logger } from './Logger'

export interface App {
  name: string
  features: Feature[]
  server?: Server
  database?: Database
  mailer?: Mailer
  auth?: Auth
  logger?: Logger
}

export type AppSchema = App
