import type { DatabaseConfig } from '@domain/services/Database'
import type { MailerConfig } from '@domain/services/Mailer'
import type { AuthConfig } from '@domain/services/Auth'
import type { LoggersConfig } from '@domain/services/Logger'
import type { ThemeConfig } from '@domain/services/Theme'
import type { MonitorsConfig } from '@domain/services/Monitor'
import type { ServerConfig } from '@domain/services/Server'

export type {
  DatabaseConfig,
  MailerConfig,
  AuthConfig,
  LoggersConfig,
  ThemeConfig,
  MonitorsConfig,
  ServerConfig,
}

export type IServices = {
  server?: ServerConfig
  database?: DatabaseConfig
  mailer?: MailerConfig
  auth?: AuthConfig
  theme?: ThemeConfig
  monitors?: MonitorsConfig
  loggers?: LoggersConfig
}
