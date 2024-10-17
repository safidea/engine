import type { Table } from '@domain/entities/Table'
import type { RecordJson } from '@domain/entities/Record/base'

export interface Spi {
  run: (data: object, modules: Modules) => Promise<object>
}

export interface Modules {
  table: (name: string) => {
    insert: (data: unknown) => Promise<RecordJson>
    update: (id: string, data: unknown) => Promise<RecordJson>
    read: (id: string) => Promise<RecordJson | undefined>
    list: (filters: unknown) => Promise<RecordJson[]>
  }
}

export interface FunctionContext {
  inputData: object
  env: { [key: string]: string }
  table: Modules['table']
  packages: {
    xml2js: typeof import('xml2js')
    dateFns: typeof import('date-fns')
    googleapis: typeof import('googleapis')
    Airtable: typeof import('airtable')
  }
}

export interface Entities {
  tables: Table[]
}

export class JavascriptRunner {
  constructor(
    private _spi: Spi,
    private _entities: Entities
  ) {}

  run = (data: object): Promise<object> => {
    return this._spi.run(data, this._modules())
  }

  private _modules = (): Modules => {
    const { tables } = this._entities
    return {
      table: (name: string) => {
        const table = tables.find((table) => table.name === name)
        if (!table) {
          throw new Error(`JavascriptRunner: Table ${name} not found`)
        }
        return {
          insert: async (data: unknown) => {
            const { record, error } = await table.insert(data)
            if (error)
              throw new Error(
                `JavascriptRunner: table(${name}).insert: ${JSON.stringify(error, null, 2)}`
              )
            return record
          },
          update: async (id: string, data: unknown) => {
            const { record, error } = await table.update(id, data)
            if (error)
              throw new Error(
                `JavascriptRunner: table(${name}).update: ${JSON.stringify(error, null, 2)}`
              )
            return record
          },
          read: async (id: string) => {
            const record = await table.readById(id)
            if (!record) throw new Error(`JavascriptRunner: table(${name}).read: Record not found`)
            return record
          },
          list: async (filters: unknown) => {
            const { records, error } = await table.list(filters)
            if (error)
              throw new Error(
                `JavascriptRunner: table(${name}).list: ${JSON.stringify(error, null, 2)}`
              )
            return records
          },
        }
      },
    }
  }
}
