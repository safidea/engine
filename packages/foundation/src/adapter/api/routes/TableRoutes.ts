import { RequestDto } from '@application/dtos/RequestDto'
import { TableController } from '../controllers/TableController'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'
import { ICodegenRepository } from '@domain/repositories/ICodegenRepository'
import { App } from '@domain/entities/App'

export class TableRoutes {
  private tableController: TableController

  constructor(app: App, orm: IOrmRepository, codegen: ICodegenRepository) {
    this.tableController = new TableController(app, orm, codegen)
  }

  get routes() {
    return [
      {
        path: '/api/table/:table/:id',
        method: 'GET',
        handler: async (request: RequestDto) => this.get(request),
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

  async get(request: RequestDto) {
    if (request.params?.id) {
      return this.tableController.read(request)
    }
    return this.tableController.list(request)
  }

  async post(request: RequestDto) {
    return this.tableController.create(request)
  }
}
