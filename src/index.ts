import { drivers } from '@infrastructure/drivers'
import { integrations } from '@infrastructure/integrations'
import App from '@adapter/api'

export type { Config } from '@adapter/api/configs'
export type { IAutomation as Automation } from '@adapter/api/configs/Automation'
export type { IAction as Action } from '@adapter/api/configs/Action'
export type { ITrigger as Trigger } from '@adapter/api/configs/Trigger'
export type { ITable as Table } from '@adapter/api/configs/Table'
export type { IField as Field } from '@adapter/api/configs/Field'
export type { FilterConfig as Filter } from '@domain/entities/Filter'
export type { IBucket as Bucket } from '@adapter/api/configs/Bucket'
// export type { IPage as Page } from '@adapter/api/configs/Page'
// export type { IComponent as Component } from '@adapter/api/configs/Component'
// export type { IHead as Head } from '@adapter/api/configs/Head'
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
  CodeRunnerContextServicesDatabase as DatabaseIntegration,
  CodeRunnerContextServicesDatabaseTable as DatabaseTable,
  CodeRunnerContextIntegrationsNotion as NotionIntegration,
  CodeRunnerContextIntegrationsNotionTable as NotionTable,
} from '@domain/services/CodeRunner'
export type {
  NotionTablePage,
  NotionTablePageProperties,
  NotionTablePagePropertyValue,
} from '@domain/integrations/Notion/NotionTablePage'
export type { NotionUser } from '@domain/integrations/Notion/NotionUser'
export type {
  Record as DatabaseTableRecord,
  RecordFields as DatabaseTableRecordFields,
  RecordFieldValue as DatabaseTableRecordFieldValue,
  UpdateRecordFields as DatabaseTableUpdateRecordFields,
} from '@domain/entities/Record'
export type { AppIntegrations } from '@domain/entities/App/Base'
export type { StartedApp } from '@domain/entities/App/Started'
export type { StoppedApp } from '@domain/entities/App/Stopped'
export { packages } from '@infrastructure/drivers/CodeCompilerDriver/JavascriptRunnerDriver'

export default class extends App {
  constructor() {
    super(drivers, integrations)
  }
}
