import type { Table } from '@domain/entities/Table'
import type { FilterConfig } from '@domain/entities/Filter'
import type { Notion } from '@domain/integrations/Notion'
import {
  NotionTablePage,
  type NotionTablePageProperties,
} from '@domain/integrations/Notion/NotionTablePage'
import type { Record, UpdateRecordFields } from '@domain/entities/Record'
import { Logger } from '@domain/services/Logger'
import type { NotionUser } from '@domain/integrations/Notion/NotionUser'
import type { RecordFields } from '@domain/entities/Record'

export interface ICodeRunnerSpi {
  run: (
    data: object,
    services: CodeRunnerContextServices,
    integrations: CodeRunnerContextIntegrations
  ) => Promise<object>
}

export interface CodeRunnerContextServicesDatabaseTable<T extends RecordFields = RecordFields> {
  insert: (data: T) => Promise<Record<T>>
  insertMany: (data: T[]) => Promise<Record<T>[]>
  update: (id: string, data: Partial<T>) => Promise<Record<T>>
  updateMany: (data: UpdateRecordFields<T>[]) => Promise<Record<T>[]>
  read: (filter: FilterConfig) => Promise<Record<T> | undefined>
  readById: (id: string) => Promise<Record<T> | undefined>
  list: (filter?: FilterConfig) => Promise<Record<T>[]>
}

// TODO: installer Zod sur l'engine pour générer ce type à partir des schemas de la DB et avec les tables de la Database déjà typées
export interface CodeRunnerContextServicesDatabase {
  table: <T extends RecordFields = RecordFields>(
    name: string
  ) => CodeRunnerContextServicesDatabaseTable<T>
}

export interface CodeRunnerContextServicesLogger {
  error: (message: string, metadata?: object) => void
  info: (message: string, metadata?: object) => void
  debug: (message: string, metadata?: object) => void
}

export interface CodeRunnerContextServices {
  database: CodeRunnerContextServicesDatabase
  logger: CodeRunnerContextServicesLogger
}

export interface CodeRunnerContextIntegrationsNotionTable<
  T extends NotionTablePageProperties = NotionTablePageProperties,
> {
  create: (data: T) => Promise<NotionTablePage<T>>
  update: (id: string, data: Partial<T>) => Promise<NotionTablePage<T>>
  retrieve: (id: string) => Promise<NotionTablePage<T> | undefined>
  list: (filter?: FilterConfig) => Promise<NotionTablePage<T>[]>
  archive: (id: string) => Promise<void>
}

export interface CodeRunnerContextIntegrationsNotion {
  getTable: <T extends NotionTablePageProperties = NotionTablePageProperties>(
    id: string
  ) => Promise<CodeRunnerContextIntegrationsNotionTable<T>>
  listAllUsers: () => Promise<NotionUser[]>
}

export interface CodeRunnerContextIntegrations {
  notion: CodeRunnerContextIntegrationsNotion
}

export interface CodeRunnerContextPackages {
  xml2js: typeof import('xml2js')
  dateFns: typeof import('date-fns')
  googleapis: typeof import('googleapis')
  Airtable: typeof import('airtable')
  axios: typeof import('axios').default
  https: typeof import('https')
  crypto: typeof import('crypto')
  lodash: typeof import('lodash')
}

export interface CodeRunnerContext<I extends object = {}> {
  inputData: I
  env: { [key: string]: string }
  services: CodeRunnerContextServices
  integrations: CodeRunnerContextIntegrations
  packages: CodeRunnerContextPackages
}

export interface CodeRunnerServices {
  logger: Logger
}

export interface CodeRunnerEntities {
  tables: Table[]
}

export interface CodeRunnerIntegrations {
  notion: Notion
}

export class CodeRunner {
  constructor(
    private _spi: ICodeRunnerSpi,
    private _codeServices: CodeRunnerContextServices,
    private _codeIntegrations: CodeRunnerContextIntegrations
  ) {}

  run = (data: object): Promise<object> => {
    return this._spi.run(data, this._codeServices, this._codeIntegrations)
  }
}
