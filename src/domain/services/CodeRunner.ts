import type { Table } from '@domain/entities/Table'
import type { RecordJson } from '@domain/entities/Record/base'
import type { FilterConfig } from '@domain/entities/Filter'

export interface ICodeRunnerSpi {
  run: (data: object, modules: CodeRunnerModules) => Promise<object>
}

export interface CodeRunnerModules {
  table: (name: string) => {
    insert: (data: unknown) => Promise<RecordJson>
    update: (id: string, data: unknown) => Promise<RecordJson>
    read: (id: string) => Promise<RecordJson | undefined>
    list: (filter?: FilterConfig) => Promise<RecordJson[]>
  }
}

export interface CodeContext<I extends object = {}> {
  inputData: I
  env: { [key: string]: string }
  table: CodeRunnerModules['table']
  packages: {
    xml2js: typeof import('xml2js')
    dateFns: typeof import('date-fns')
    googleapis: typeof import('googleapis')
    Airtable: typeof import('airtable')
    axios: typeof import('axios').default
    https: typeof import('https')
    crypto: typeof import('crypto')
  }
}

export interface CodeRunnerEntities {
  tables: Table[]
}

export class CodeRunner {
  constructor(
    private _spi: ICodeRunnerSpi,
    private _entities: CodeRunnerEntities
  ) {}

  run = (data: object): Promise<object> => {
    return this._spi.run(data, this._modules())
  }

  private _modules = (): CodeRunnerModules => {
    const { tables } = this._entities
    return {
      table: (name: string) => {
        const table = tables.find((table) => table.name === name)
        if (!table) {
          throw new Error(`CodeRunner: Table ${name} not found`)
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
              throw new Error(`CodeRunner: table(${name}).list: ${JSON.stringify(error, null, 2)}`)
            return records
          },
        }
      },
    }
  }
}
