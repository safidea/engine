import type { Table } from '@domain/entities/Table'
import type { Data as PersistedData } from '@domain/entities/Record/Persisted'

export interface Spi {
  run: (data: object, modules: Modules) => Promise<object>
}

export interface Modules {
  table: (name: string) => {
    insert: (data: unknown) => Promise<PersistedData>
    update: (id: string, data: unknown) => Promise<PersistedData>
    read: (id: string) => Promise<PersistedData | undefined>
  }
}

export interface Entities {
  tables: Table[]
}

export class CodeRunner {
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
          throw new Error(`CodeRunner: Table ${name} not found`)
        }
        return {
          insert: async (data: unknown) => {
            const { record, error } = await table.insert(data)
            if (error) throw new Error(`CodeRunner: table(${name}).insert: ${error}`)
            return record
          },
          update: async (id: string, data: unknown) => {
            const { record, error } = await table.update(id, data)
            if (error) throw new Error(`CodeRunner: table(${name}).update: ${error}`)
            return record
          },
          read: async (id: string) => {
            const record = await table.read(id)
            if (!record) throw new Error(`CodeRunner: table(${name}).read: Record not found`)
            return record
          },
        }
      },
    }
  }
}
