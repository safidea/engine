import { drivers } from '@infrastructure/drivers'
import { integrations } from '@infrastructure/integrations'
import App from '@adapter/api'
import type { Drivers as AllDrivers } from '@adapter/spi/drivers'

export type { Config } from '@adapter/api/configs'
export type { ITable as Table } from '@adapter/api/configs/Table'
export type { IPage as Page } from '@adapter/api/configs/Page'
export type { IAutomation as Automation } from '@adapter/api/configs/Automation'
export type { IBucket as Bucket } from '@adapter/api/configs/Bucket'
export type { IHead as Head } from '@adapter/api/configs/Head'
export type { IComponent as Component } from '@adapter/api/configs/Component'
export type { IAction as Action } from '@adapter/api/configs/Action'
export type { ITrigger as Trigger } from '@adapter/api/configs/Trigger'
export type { IField as Field } from '@adapter/api/configs/Field'
export type { IEvent as Event } from '@adapter/api/configs/Event'
export type { IExpect as Expect } from '@adapter/api/configs/Expect'
export type { ITest as Test } from '@adapter/api/configs/Test'
export type {
  DatabaseConfig as Database,
  MailerConfig as Mailer,
  AuthConfig as Auth,
  LoggersConfig as Loggers,
  ThemeConfig as Theme,
  MonitorsConfig as Monitors,
  ServerConfig as Server,
} from '@adapter/api/configs/Services'
export type { CodeRunnerContext } from '@domain/services/CodeRunner'
export type { NotionTablePage } from '@domain/integrations/NotionTablePage'

export type Drivers = Partial<AllDrivers>

export default class extends App {
  constructor(options: Drivers = {}) {
    super({ ...drivers, ...options }, integrations)
  }
}
