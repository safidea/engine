import type { Table } from '@domain/entities/Table'
import { FilterMapper, type FilterConfig } from '@domain/entities/Filter'
import type { Notion } from '@domain/integrations/Notion'
import {
  NotionTablePage,
  type NotionTablePageProperties,
} from '@domain/integrations/NotionTablePage'
import type { PersistedRecord } from '@domain/entities/Record/Persisted'

export interface ICodeRunnerSpi {
  run: (
    data: object,
    services: CodeRunnerContextServices,
    integrations: CodeRunnerContextIntegrations
  ) => Promise<object>
}

export interface CodeRunnerContextServices {
  database: {
    table: (name: string) => {
      insert: (data: unknown) => Promise<PersistedRecord>
      update: (id: string, data: unknown) => Promise<PersistedRecord>
      read: (filter: FilterConfig) => Promise<PersistedRecord | undefined>
      readById: (id: string) => Promise<PersistedRecord | undefined>
      list: (filter?: FilterConfig) => Promise<PersistedRecord[]>
    }
  }
}

export interface CodeRunnerContextIntegrations {
  notion: {
    getTable: (id: string) => Promise<{
      create: (data: NotionTablePageProperties) => Promise<NotionTablePage>
      update: (id: string, data: NotionTablePageProperties) => Promise<NotionTablePage>
      retrieve: (id: string) => Promise<NotionTablePage | undefined>
      list: (filter?: FilterConfig) => Promise<NotionTablePage[]>
      archive: (id: string) => Promise<void>
    }>
  }
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

export interface CodeRunnerEntities {
  tables: Table[]
}

export interface CodeRunnerIntegrations {
  notion: Notion
}

export class CodeRunner {
  constructor(
    private _spi: ICodeRunnerSpi,
    private _entities: CodeRunnerEntities,
    private _integrations: CodeRunnerIntegrations
  ) {}

  run = (data: object): Promise<object> => {
    return this._spi.run(data, this._contextServices(), this._contextIntegrations())
  }

  private _contextServices = (): CodeRunnerContextServices => {
    const { tables } = this._entities
    return {
      database: {
        table: (name: string) => {
          const table = tables.find((table) => table.name === name)
          if (!table) {
            throw new Error(`CodeRunner: Database table "${name}" not found`)
          }
          return {
            insert: async (data: unknown) => {
              const { record, error } = await table.insert(data)
              if (error)
                throw new Error(
                  `CodeRunner: table(${name}).insert: ${JSON.stringify(error, null, 2)}`
                )
              return record
            },
            update: async (id: string, data: unknown) => {
              const { record, error } = await table.update(id, data)
              if (error)
                throw new Error(
                  `CodeRunner: table(${name}).update: ${JSON.stringify(error, null, 2)}`
                )
              return record
            },
            read: async (filter: FilterConfig) => {
              return table.read(filter)
            },
            readById: async (id: string) => {
              return table.readById(id)
            },
            list: async (filter?: FilterConfig) => {
              const { records, error } = await table.list(filter)
              if (error)
                throw new Error(
                  `CodeRunner: table(${name}).list: ${JSON.stringify(error, null, 2)}`
                )
              return records
            },
          }
        },
      },
    }
  }

  private _contextIntegrations = (): CodeRunnerContextIntegrations => {
    const { notion } = this._integrations
    return {
      notion: {
        getTable: async (id: string) => {
          const table = await notion.getTable(id)
          if (!table) {
            throw new Error(`CodeRunner: Notion table "${id}" not found`)
          }
          return {
            create: async (data: NotionTablePageProperties) => {
              return table.create(data)
            },
            update: async (id: string, data: NotionTablePageProperties) => {
              return table.update(id, data)
            },
            retrieve: async (id: string) => {
              return table.retrieve(id)
            },
            list: async (filterConfig?: FilterConfig) => {
              const filter = filterConfig ? FilterMapper.toEntity(filterConfig) : undefined
              return table.list(filter)
            },
            archive: async (id: string) => {
              return table.archive(id)
            },
          }
        },
      },
    }
  }
}
