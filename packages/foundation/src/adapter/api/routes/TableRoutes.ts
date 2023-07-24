import { RequestDto, RequestWithLocalDto } from '@application/dtos/RequestDto'
import { TableController } from '../controllers/TableController'
import { TableMiddleware } from '../middlewares/TableMiddleware'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { ICodegenRepository } from '@domain/repositories/ICodegenRepository'
import { App } from '@domain/entities/App'
import { TableRoute } from '@domain/repositories/IServerRepository'

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

  async get(request: RequestWithLocalDto) {
    if (request.params?.id) {
      return this.tableController.read(request)
    }
    await this.tableMiddleware.validateAndExtractQuery(request)
    return this.tableController.list(request)
  }

  async post(request: RequestWithLocalDto) {
    return this.tableController.create(request)
  }

  async patch(request: RequestWithLocalDto) {
    return this.tableController.update(request)
  }

  async delete(request: RequestWithLocalDto) {
    return this.tableController.delete(request)
  }
}
