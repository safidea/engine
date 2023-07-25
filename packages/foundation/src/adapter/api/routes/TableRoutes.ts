import { RequestDto } from '@application/dtos/RequestDto'
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
      const localWithTable = await this.tableMiddleware.validateTableExist(request)
      if (request.params?.id) {
        const localWithTableAndId = await this.tableMiddleware.validateRowExist(
          request,
          localWithTable
        )
        const record = await this.tableController.read(localWithTableAndId)
        return { json: record }
      }
      const localWithTableAndFilters = await this.tableMiddleware.validateAndExtractQuery(
        request,
        localWithTable
      )
      const records = await this.tableController.list(localWithTableAndFilters)
      return { json: records }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async post(request: RequestDto): Promise<Response> {
    try {
      const localWithTable = await this.tableMiddleware.validateTableExist(request)
      const localWithTableAndBody = await this.tableMiddleware.validateBodyExist(
        request,
        localWithTable
      )
      if ('records' in localWithTableAndBody) {
        await this.tableMiddleware.validatePostArrayBody(localWithTableAndBody)
        const ids = await this.tableController.createMany(localWithTableAndBody)
        return { json: { ids } }
      }
      await this.tableMiddleware.validatePostBody(localWithTableAndBody)
      const id = await this.tableController.create(localWithTableAndBody)
      return { json: { id } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async patch(request: RequestDto): Promise<Response> {
    try {
      const localWithTable = await this.tableMiddleware.validateTableExist(request)
      const localWithTableAndBody = await this.tableMiddleware.validateBodyExist(
        request,
        localWithTable
      )
      if ('records' in localWithTableAndBody) {
        throw new ApiError('Method not implemented', 405)
      }
      const localWithTableAndId = await this.tableMiddleware.validateRowExist(
        request,
        localWithTable
      )
      await this.tableMiddleware.validatePatchBody(localWithTableAndBody)
      await this.tableController.update({ ...localWithTableAndBody, ...localWithTableAndId })
      return { json: { success: true } }
    } catch (error) {
      return this.catchError(error)
    }
  }

  async delete(request: RequestDto): Promise<Response> {
    try {
      const localWithTable = await this.tableMiddleware.validateTableExist(request)
      const localWithTableAndId = await this.tableMiddleware.validateRowExist(
        request,
        localWithTable
      )
      await this.tableController.delete(localWithTableAndId)
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
