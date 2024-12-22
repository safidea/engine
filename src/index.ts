import { drivers } from '@infrastructure/drivers'
import { integrations } from '@infrastructure/integrations'
import App from '@adapter/api'

export type { Config } from '@adapter/api/configs'
export type { ITable as Table } from '@adapter/api/configs/Table'
export type { IAutomation as Automation } from '@adapter/api/configs/Automation'
export type { IBucket as Bucket } from '@adapter/api/configs/Bucket'
export type { IHead as Head } from '@adapter/api/configs/Head'
export type { IAction as Action } from '@adapter/api/configs/Action'
export type { ITrigger as Trigger } from '@adapter/api/configs/Trigger'
export type { IField as Field } from '@adapter/api/configs/Field'
// export type { IPage as Page } from '@adapter/api/configs/Page'
// export type { IComponent as Component } from '@adapter/api/configs/Component'
// export type { IEvent as Event } from '@adapter/api/configs/Event'
// export type { IExpect as Expect } from '@adapter/api/configs/Expect'
// export type { ITest as Test } from '@adapter/api/configs/Test'
export type {
  DatabaseConfig as Database,
  MailerConfig as Mailer,
  LoggersConfig as Loggers,
  MonitorsConfig as Monitors,
  ServerConfig as Server,
  TunnelConfig as Tunnel,
  // AuthConfig as Auth,
  // ThemeConfig as Theme,
} from '@adapter/api/configs/Services'
export type {
  CodeRunnerContext,
  CodeRunnerContextServicesDatabaseTable as DatabaseTable,
  CodeRunnerContextIntegrationsNotionTable as NotionTable,
} from '@domain/services/CodeRunner'
export type {
  NotionTablePage,
  NotionTablePageProperties,
  NotionTablePagePropertyValue,
} from '@domain/integrations/NotionTablePage'
export type { PersistedRecord as DatabaseTableRecord } from '@domain/entities/Record/Persisted'
export type {
  RecordFields as DatabaseTableRecordFields,
  RecordFieldValue as DatabaseTableRecordFieldValue,
} from '@domain/entities/Record/base'

export default class extends App {
  constructor() {
    super(drivers, integrations)
  }
}
