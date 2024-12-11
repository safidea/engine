import type { Table } from '@domain/entities/Table'
import type { RecordJson } from '@domain/entities/Record/base'
import { FilterMapper, type FilterConfig } from '@domain/entities/Filter'
import type { Notion } from '@domain/integrations/Notion'
import type { NotionTablePage, NotionTablePageProperties } from '@domain/integrations/NotionTable'

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
      insert: (data: unknown) => Promise<RecordJson>
      update: (id: string, data: unknown) => Promise<RecordJson>
      read: (id: string) => Promise<RecordJson | undefined>
      list: (filter?: FilterConfig) => Promise<RecordJson[]>
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
            read: async (id: string) => {
              const record = await table.readById(id)
              if (!record) throw new Error(`CodeRunner: table(${name}).read: Record not found`)
              return record
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
          }
        },
      },
    }
  }
}
