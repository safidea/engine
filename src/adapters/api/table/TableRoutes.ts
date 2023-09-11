import { RequestDto } from '@adapters/spi/server/dtos/RequestDto'
import { TableController } from './TableController'
import { TableMiddleware } from './TableMiddleware'
import { App } from '@entities/app/App'
import { ApiRoute } from '@adapters/spi/server/IServerAdapter'
import { ApiError } from '@entities/errors/ApiError'
import { ResponseDto } from '@adapters/spi/server/dtos/ResponseDto'
import { RecordMapper } from '@adapters/spi/orm/mappers/RecordMapper'
import { OrmSpi } from '@adapters/spi/orm/OrmSpi'
import { TablesSyncMapper } from '../../spi/fetcher/mappers/TablesSyncMapper'
import { StartedState } from '@adapters/spi/server/ServerSpi/StartedState'

export class TableRoutes {
  private readonly tableController: TableController
  private readonly tableMiddleware: TableMiddleware

  constructor(app: App, ormSpi: OrmSpi, instance: StartedState) {
    this.tableMiddleware = new TableMiddleware(app, ormSpi)
    this.tableController = new TableController(app, ormSpi, instance)
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
      const tables = await this.tableController.sync(records, resources)
      const tablesDto = TablesSyncMapper.toDtos(tables)
      return { json: { tables: tablesDto } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async get(request: RequestDto): Promise<ResponseDto> {
    try {
      const table = await this.tableMiddleware.validateTableExist(request)
      if (request.params?.id) {
        const existingRecord = await this.tableMiddleware.validateRecordExist(request)
        const record = await this.tableController.read(table, existingRecord.id)
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
      const createdRecordDto = await this.tableMiddleware.validateRecordBody(table, request.body)
      const record = await this.tableMiddleware.validateRecordValues(
        table,
        createdRecordDto,
        'create'
      )
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
      const persistedRecord = await this.tableMiddleware.validateRecordExist(request)
      const updatedRecordDto = await this.tableMiddleware.validateRecordBody(table, request.body)
      const updatedRecord = await this.tableMiddleware.validateRecordValues(
        table,
        { id: persistedRecord.id, ...updatedRecordDto },
        'update'
      )
      await this.tableMiddleware.validateUpdatePermissions(persistedRecord, updatedRecord)
      await this.tableController.update(table, updatedRecord.id, updatedRecord)
      return { json: { id: updatedRecord.id } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async delete(request: RequestDto): Promise<ResponseDto> {
    try {
      const table = await this.tableMiddleware.validateTableExist(request)
      const record = await this.tableMiddleware.validateRecordExist(request)
      await this.tableController.delete(table, record.id)
      return { json: { id: record.id } }
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
