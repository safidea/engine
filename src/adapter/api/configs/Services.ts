import type { Config as Database } from '@domain/services/Database'
import type { Config as Mailer } from '@domain/services/Mailer'
import type { Config as Auth } from '@domain/services/Auth'
import type { Config as Logger } from '@domain/services/Logger'
import type { Config as Theme } from '@domain/services/Theme'
import type { Config as Monitor } from '@domain/services/Monitor'
import type { Config as Server } from '@domain/services/Server'

export type { Database, Mailer, Auth, Logger, Theme, Monitor, Server }

export type Services = {
  server?: Server
  database?: Database
  mailer?: Mailer
  auth?: Auth
  logger?: Logger
  theme?: Theme
  monitor?: Monitor
}
