import { type FilterConfig, FilterMapper } from '@domain/entities/Filter'
import type { NotionTablePageProperties } from '@domain/integrations/Notion/NotionTablePage'
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
import type { RecordFields, UpdateRecordFields } from '@domain/entities/Record'

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
          insert: async (data: RecordFields) => {
            return await table.db.insert(data)
          },
          insertMany: async (data: RecordFields[]) => {
            return await table.db.insertMany(data)
          },
          update: async (id: string, data: RecordFields) => {
            return await table.db.update(id, data)
          },
          updateMany: async (data: UpdateRecordFields[]) => {
            return await table.db.updateMany(data)
          },
          read: async (filterConfig: FilterConfig) => {
            const filter = FilterMapper.toEntity(filterConfig)
            return table.db.read(filter)
          },
          readById: async (id: string) => {
            return table.db.readById(id)
          },
          list: async (filterConfig?: FilterConfig) => {
            const filter = filterConfig && FilterMapper.toEntity(filterConfig)
            return await table.db.list(filter)
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
        listAllUsers: async () => {
          return notion.listAllUsers()
        },
      },
    }
  }
}
