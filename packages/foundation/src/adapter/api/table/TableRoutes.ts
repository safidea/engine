import { RequestDto } from '@adapter/spi/server/dtos/RequestDto'
import { TableController } from './TableController'
import { TableMiddleware } from './TableMiddleware'
import { App } from '@domain/entities/app/App'
import { ApiRoute } from '@adapter/spi/server/IServerAdapter'
import { ApiError } from '@domain/entities/app/errors/ApiError'
import { ResponseDto } from '@adapter/spi/server/dtos/ResponseDto'
import { RecordMapper } from '@adapter/api/app/mappers/RecordMapper'
import { OrmSpi } from '@adapter/spi/orm/OrmSpi'
import { TablesSyncMapper } from '../app/mappers/sync/TablesSyncMapper'

export class TableRoutes {
  private readonly tableController: TableController
  private readonly tableMiddleware: TableMiddleware

  constructor(app: App, ormSpi: OrmSpi) {
    this.tableMiddleware = new TableMiddleware(app, ormSpi)
    this.tableController = new TableController(app, ormSpi)
  }

  get routes(): ApiRoute[] {
    return [
      {
        path: '/api/sync/table',
        method: 'POST',
        handler: async (request: RequestDto) => this.sync(request),
      },
      {
        path: '/api/table/:table/:id',
        method: 'GET',
        handler: async (request: RequestDto) => this.get(request),
      },
      {
        path: '/api/table/:table/:id',
        method: 'PATCH',
        handler: async (request: RequestDto) => this.patch(request),
      },
      {
        path: '/api/table/:table/:id',
        method: 'DELETE',
        handler: async (request: RequestDto) => this.delete(request),
      },
      {
        path: '/api/table/:table',
        method: 'GET',
        handler: async (request: RequestDto) => this.get(request),
      },
      {
        path: '/api/table/:table',
        method: 'POST',
        handler: async (request: RequestDto) => this.post(request),
      },
    ]
  }

  async sync(request: RequestDto): Promise<ResponseDto> {
    try {
      const { records, resources } = await this.tableMiddleware.validateSyncBody(request.body)
      const tablesDto = await this.tableController.sync(records, resources)
      const tables = TablesSyncMapper.toDtos(tablesDto)
      return { json: { tables } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async get(request: RequestDto): Promise<ResponseDto> {
    try {
      const table = await this.tableMiddleware.validateTableExist(request)
      if (request.params?.id) {
        const id = await this.tableMiddleware.validateRecordExist(request)
        const record = await this.tableController.read(table, id)
        return { json: { record: RecordMapper.toDto(record) } }
      }
      const filters = await this.tableMiddleware.extractAndValidateQuery(request)
      const records = await this.tableController.list(table, filters)
      return { json: { records: RecordMapper.toDtos(records) } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async post(request: RequestDto): Promise<ResponseDto> {
    try {
      const table = await this.tableMiddleware.validateTableExist(request)
      if (Array.isArray(request.body)) {
        const record = await this.tableMiddleware.validateRecordsBody(table, request.body, 'create')
        const ids = await this.tableController.createMany(table, record)
        return { json: { ids } }
      }
      const record = await this.tableMiddleware.validateRecordBody(table, request.body, 'create')
      const id = await this.tableController.create(table, record)
      return { json: { id } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async patch(request: RequestDto): Promise<ResponseDto> {
    try {
      const table = await this.tableMiddleware.validateTableExist(request)
      if (Array.isArray(request.body)) {
        throw new ApiError('Method not implemented', 405)
      }
      const id = await this.tableMiddleware.validateRecordExist(request)
      const recordDto = { ...(request.body ?? {}), id }
      const record = await this.tableMiddleware.validateRecordBody(table, recordDto, 'update')
      await this.tableController.update(table, id, record)
      return { json: { id } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async delete(request: RequestDto): Promise<ResponseDto> {
    try {
      const table = await this.tableMiddleware.validateTableExist(request)
      const id = await this.tableMiddleware.validateRecordExist(request)
      await this.tableController.delete(table, id)
      return { json: { id } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  catchError(error: unknown): ResponseDto {
    if (error instanceof ApiError) {
      return { status: error.status, json: { error: error.message } }
    } else if (error instanceof Error) {
      return { status: 500, json: { error: error.message } }
    } else {
      return { status: 500, json: { error: 'Internal server error' } }
    }
  }
}
