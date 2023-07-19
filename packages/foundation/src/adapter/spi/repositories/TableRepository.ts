import { AppController } from '@adapter/api/controllers/AppController'
import { AppDto } from '@application/dtos/AppDto'
import { DataDto } from '@application/dtos/DataDto'
import { ICodegenRepository } from '@domain/repositories/ICodegenRepository'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'

export class TableRepository {
  private orm: IOrmRepository
  private codegen: ICodegenRepository
  private app: AppDto

  constructor(appController: AppController) {
    this.orm = appController.orm
    this.codegen = appController.codegen
    this.app = appController.get()
    const { tables } = this.app
    if (!tables) throw new Error('Tables not found in app')
    this.orm.configure(tables)
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

  async runFormula(
    formula: string,
    context: { [key: string]: string | number | boolean | undefined }
  ) {
    return this.codegen.runScript(formula, context)
  }

  async getTableFields(tableName: string) {
    const { tables } = this.app
    if (!tables) throw new Error('Tables not found in app')
    const table = tables.find((t) => t.name === tableName)
    if (!table) throw new Error(`Table ${tableName} not found`)
    return table.fields
  }
}
