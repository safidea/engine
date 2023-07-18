import { AppController } from '@adapter/api/controllers/AppController'
import { DataDto } from '@application/dtos/DataDto'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'

export class TableRepository {
  private orm: IOrmRepository

  constructor(appController: AppController) {
    this.orm = appController.orm
  }

  async create(table: string, body: DataDto) {
    return this.orm.create(table, body)
  }

  async createMany(table: string, body: DataDto[]) {
    return this.orm.createMany(table, body)
  }

  async list(table: string) {
    return this.orm.list(table)
  }
  async read(table: string, id: string) {
    return this.orm.readById(table, id)
  }
}
