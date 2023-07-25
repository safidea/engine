import { RequestDto, RequestWithLocalDto } from '@application/dtos/RequestDto'
import { TableController } from '../controllers/TableController'
import { TableMiddleware } from '../middlewares/TableMiddleware'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { ICodegenRepository } from '@domain/repositories/ICodegenRepository'
import { App } from '@domain/entities/App'
import { TableRoute } from '@domain/repositories/IServerRepository'
import { ApiError } from '@domain/entities/errors/ApiError'
import { Response } from '@domain/entities/Response'

export class TableRoutes {
  private readonly tableController: TableController
  private readonly tableMiddleware: TableMiddleware

  constructor(app: App, orm: IOrmRepository, codegen: ICodegenRepository) {
    this.tableMiddleware = new TableMiddleware(app, orm)
    this.tableController = new TableController(app, orm, codegen)
  }

  get routes(): TableRoute[] {
    return [
      {
        path: '/api/table/:table/:id',
        method: 'GET',
        handler: async (request: RequestDto) => this.get({ ...request, local: {} }),
      },
      {
        path: '/api/table/:table/:id',
        method: 'PATCH',
        handler: async (request: RequestDto) => this.patch({ ...request, local: {} }),
      },
      {
        path: '/api/table/:table/:id',
        method: 'DELETE',
        handler: async (request: RequestDto) => this.delete({ ...request, local: {} }),
      },
      {
        path: '/api/table/:table',
        method: 'GET',
        handler: async (request: RequestDto) => this.get({ ...request, local: {} }),
      },
      {
        path: '/api/table/:table',
        method: 'POST',
        handler: async (request: RequestDto) => this.post({ ...request, local: {} }),
      },
    ]
  }

  async get(request: RequestWithLocalDto): Promise<Response> {
    try {
      await this.tableMiddleware.validateTableExist(request)
      if (request.params?.id) {
        await this.tableMiddleware.validateRowExist(request)
        const record = await this.tableController.read(request)
        return { json: record }
      }
      await this.tableMiddleware.validateAndExtractQuery(request)
      const records = await this.tableController.list(request)
      return { json: records }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async post(request: RequestWithLocalDto): Promise<Response> {
    try {
      await this.tableMiddleware.validateTableExist(request)
      const id = await this.tableController.create(request)
      return { json: { id } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async patch(request: RequestWithLocalDto): Promise<Response> {
    try {
      await this.tableMiddleware.validateTableExist(request)
      await this.tableController.update(request)
      return { json: { success: true } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async delete(request: RequestWithLocalDto): Promise<Response> {
    try {
      await this.tableMiddleware.validateTableExist(request)
      await this.tableController.delete(request)
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
