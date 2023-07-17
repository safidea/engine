import { RequestDto } from '@application/dtos/RequestDto'
import { AppController } from '../controllers/AppController'
import { TableController } from '../controllers/TableController'

export class TableRoutes {
  private tableController: TableController

  constructor(appController: AppController) {
    this.tableController = new TableController(appController)
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
