import type { Database } from './Database'
import type { Server } from './Server'
import type { Auth } from './Auth'
import type { Mailer } from './Mailer'
import type { Theme } from './Theme'
import type { Logger } from './Logger'
import type { Monitor } from './Monitor'

export type Services = {
  server?: Server
  database?: Database
  mailer?: Mailer
  auth?: Auth
  logger?: Logger
  theme?: Theme
  monitor?: Monitor
}
