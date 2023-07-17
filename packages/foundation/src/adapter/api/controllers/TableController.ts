import { RequestDto } from '@application/dtos/RequestDto'
import { AppController } from './AppController'

export class TableController {
  private appController: AppController

  constructor(appController: AppController) {
    this.appController = appController
  }

  async get(request: RequestDto) {}

  async post(request: RequestDto) {}
}
