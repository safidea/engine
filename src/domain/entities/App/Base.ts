import type { Logger } from '@domain/services/Logger'
import type { Server } from '@domain/services/Server'
import type { Database } from '@domain/services/Database'
import type { Table } from '../Table'
import type { Bucket } from '../Bucket'
import type { Automation } from '../Automation'
import type { Queue } from '@domain/services/Queue'
import type { Mailer } from '@domain/services/Mailer'
import type { Realtime } from '@domain/services/Realtime'
import type { Storage } from '@domain/services/Storage'
import type { Monitor } from '@domain/services/Monitor'
import type { Notion } from '@domain/integrations/Notion'
import type { CodeCompiler } from '@domain/services/CodeCompiler'

export interface AppConfig {
  name: string
}

export interface AppServices {
  logger: Logger
  server: Server
  database: Database
  queue: Queue
  mailer: Mailer
  realtime: Realtime
  storage: Storage
  monitor: Monitor
  codeCompiler: CodeCompiler
}

export interface AppEntities {
  tables: Table[]
  automations: Automation[]
  buckets: Bucket[]
}

export interface AppIntegrations {
  notion: Notion
}

type Status = 'stopped' | 'starting' | 'started' | 'stopping'

export class BaseApp {
  public name: string
  public logger: Logger
  protected _status: Status = 'stopped'

  constructor(
    protected _config: AppConfig,
    protected _services: AppServices,
    protected _entities: AppEntities,
    protected _integrations: AppIntegrations
  ) {
    const { name } = _config
    this.name = name
    this.logger = _services.logger
  }

  getTable = (name: string): Table => {
    const table = this._entities.tables.find((table) => table.name === name)
    if (!table) throw new Error(`table "${name}" not found`)
    return table
  }

  protected _setStatus = (status: Status) => {
    this.logger.debug(`set app status: ${status}`)
    this._status = status
  }
}
