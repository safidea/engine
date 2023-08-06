import { RequestDto } from '@adapter/spi/server/dtos/RequestDto'
import { TableController } from './TableController'
import { TableMiddleware } from './TableMiddleware'
import { Orm } from '@adapter/spi/orm/Orm'
import { App } from '@domain/entities/app/App'
import { ApiRoute } from '@adapter/spi/server/Server'
import { ApiError } from '@domain/entities/app/errors/ApiError'
import { ResponseDto } from '@adapter/spi/server/dtos/ResponseDto'
import { RecordMapper } from '@adapter/spi/orm/mappers/RecordMapper'
import { OrmGateway } from '@adapter/spi/orm/OrmGateway'

export class TableRoutes {
  private readonly tableController: TableController
  private readonly tableMiddleware: TableMiddleware

  constructor(app: App, orm: Orm) {
    const ormGateway = new OrmGateway(orm, app)
    this.tableMiddleware = new TableMiddleware(app, ormGateway)
    this.tableController = new TableController(app, ormGateway)
  }

  get routes(): ApiRoute[] {
    return [
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

  async get(request: RequestDto): Promise<ResponseDto> {
    try {
      const table = await this.tableMiddleware.validateTableExist(request)
      if (request.params?.id) {
        const id = await this.tableMiddleware.validateRecordExist(request)
        const record = await this.tableController.read(table, id)
        return { json: { record: RecordMapper.toDto(record) } }
      }
      const filters = await this.tableMiddleware.validateAndExtractQuery(request)
      const records = await this.tableController.list(table, filters)
      return { json: { records: RecordMapper.toDtos(records) } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async post(request: RequestDto): Promise<ResponseDto> {
    try {
      const table = await this.tableMiddleware.validateTableExist(request)
      const body = await this.tableMiddleware.validateBodyExist(request)
      if (Array.isArray(body)) {
        const record = await this.tableMiddleware.validatePostArrayBody(table, body)
        const ids = await this.tableController.createMany(table, record)
        return { json: { ids } }
      }
      const record = await this.tableMiddleware.validatePostBody(table, body)
      const id = await this.tableController.create(table, record)
      return { json: { id } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async patch(request: RequestDto): Promise<ResponseDto> {
    try {
      const table = await this.tableMiddleware.validateTableExist(request)
      const body = await this.tableMiddleware.validateBodyExist(request)
      if (Array.isArray(body)) {
        throw new ApiError('Method not implemented', 405)
      }
      const id = await this.tableMiddleware.validateRecordExist(request)
      const record = await this.tableMiddleware.validatePatchBody(table, body)
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
