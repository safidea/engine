import { RequestDto } from '@application/dtos/table/RequestDto'
import { TableController } from '../controllers/TableController'
import { TableMiddleware } from '../middlewares/TableMiddleware'
import { IOrmGateway } from '@domain/gateways/IOrmGateway'
import { App } from '@domain/entities/App'
import { TableRoute } from '@domain/gateways/IServerGateway'
import { ApiError } from '@domain/entities/errors/ApiError'
import { Response } from '@domain/entities/table/Response'

export class TableRoutes {
  private readonly tableController: TableController
  private readonly tableMiddleware: TableMiddleware

  constructor(app: App, orm: IOrmGateway) {
    this.tableMiddleware = new TableMiddleware(app, orm)
    this.tableController = new TableController(app, orm)
  }

  get routes(): TableRoute[] {
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

  async get(request: RequestDto): Promise<Response> {
    try {
      const table = await this.tableMiddleware.validateTableExist(request)
      if (request.params?.id) {
        const id = await this.tableMiddleware.validateRowExist(request)
        if (request.query?.enriched) {
          const record = await this.tableController.readAndEnrich(table, id)
          return { json: record }
        }
        const record = await this.tableController.read(table, id)
        return { json: record }
      }
      const filters = await this.tableMiddleware.validateAndExtractQuery(request)
      const records = await this.tableController.list(table, filters)
      return { json: records }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async post(request: RequestDto): Promise<Response> {
    try {
      const table = await this.tableMiddleware.validateTableExist(request)
      const body = await this.tableMiddleware.validateBodyExist(request)
      if (Array.isArray(body)) {
        await this.tableMiddleware.validatePostArrayBody(table, body)
        const ids = await this.tableController.createMany(table, body)
        return { json: { ids } }
      }
      await this.tableMiddleware.validatePostBody(table, body)
      const id = await this.tableController.create(table, body)
      return { json: { id } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async patch(request: RequestDto): Promise<Response> {
    try {
      const table = await this.tableMiddleware.validateTableExist(request)
      const body = await this.tableMiddleware.validateBodyExist(request)
      if (Array.isArray(body)) {
        throw new ApiError('Method not implemented', 405)
      }
      const id = await this.tableMiddleware.validateRowExist(request)
      await this.tableMiddleware.validatePatchBody(table, body)
      await this.tableController.update(table, id, body)
      return { json: { success: true } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async delete(request: RequestDto): Promise<Response> {
    try {
      const table = await this.tableMiddleware.validateTableExist(request)
      const id = await this.tableMiddleware.validateRowExist(request)
      await this.tableController.delete(table, id)
      return { json: { success: true } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  catchError(error: unknown): Response {
    if (error instanceof ApiError) {
      return { status: error.status, json: { error: error.message } }
    } else if (error instanceof Error) {
      return { status: 500, json: { error: error.message } }
    } else {
      return { status: 500, json: { error: 'Internal server error' } }
    }
  }
}
