import type { Config as Auth } from '@domain/services/Auth'
import type { Config as Database } from '@domain/services/Database'
import type { Config as Logger } from '@domain/services/Logger'
import type { Config as Mailer } from '@domain/services/Mailer'
import type { Config as Server } from '@domain/services/Server'
import type { Config as Theme } from '@domain/services/Theme'
import type { Feature } from './Feature'

export interface App {
  name: string
  features: Feature[]
  server?: Server
  database?: Database
  mailer?: Mailer
  auth?: Auth
  logger?: Logger
  theme?: Theme
}

export type AppSchema = App
