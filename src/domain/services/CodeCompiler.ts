import { type FilterConfig, FilterMapper } from '@domain/entities/Filter'
import type { NotionTablePageProperties } from '@domain/integrations/NotionTablePage'
import { CodeRunner } from './CodeRunner'
import type {
  ICodeRunnerSpi,
  CodeRunnerEntities,
  CodeRunnerIntegrations,
  CodeRunnerContextIntegrations,
  CodeRunnerContextServices,
  CodeRunnerContextServicesDatabase,
  CodeRunnerContextServicesLogger,
  CodeRunnerServices,
} from './CodeRunner'

export type CodeCompilerServices = CodeRunnerServices

export type CodeCompilerEntities = CodeRunnerEntities

export type CodeCompilerIntegrations = CodeRunnerIntegrations

export interface ICodeCompilerSpi {
  compile: (code: string, env: { [key: string]: string }) => ICodeRunnerSpi
}

export interface CodeCompilerConfig {
  language: 'JavaScript' | 'TypeScript'
}

export class CodeCompiler {
  constructor(
    private _spi: ICodeCompilerSpi,
    private _services: CodeCompilerServices,
    private _entities: CodeCompilerEntities,
    private _integrations: CodeCompilerIntegrations
  ) {}

  compile = (code: string, env: { [key: string]: string }): CodeRunner => {
    const codeRunner = this._spi.compile(code, env)
    return new CodeRunner(codeRunner, this.getServices(), this.getIntegrations())
  }

  getServices = (): CodeRunnerContextServices => {
    const database: CodeRunnerContextServicesDatabase = {
      table: (name: string) => {
        const table = this._entities.tables.find((table) => table.name === name)
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
              throw new Error(`CodeRunner: table(${name}).list: ${JSON.stringify(error, null, 2)}`)
            return records
          },
        }
      },
    }
    const logger: CodeRunnerContextServicesLogger = {
      error: (message: string, metadata?: object) => {
        this._services.logger.error(message, metadata)
      },
      info: (message: string, metadata?: object) => {
        this._services.logger.info(message, metadata)
      },
      debug: (message: string, metadata?: object) => {
        this._services.logger.debug(message, metadata)
      },
    }
    return { database, logger }
  }

  getIntegrations = (): CodeRunnerContextIntegrations => {
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
