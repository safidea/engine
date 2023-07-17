import { AppController } from '@adapter/api/controllers/AppController'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'

export class TableRepository {
  private orm: IOrmRepository

  constructor(appController: AppController) {
    this.orm = appController.orm
  }

  async create(table: string, body: any) {
    return this.orm.create(table, body)
  }
  async list(table: string) {
    return this.orm.list(table)
  }
  async read(table: string, id: string) {
    return this.orm.readById(table, id)
  }
}
