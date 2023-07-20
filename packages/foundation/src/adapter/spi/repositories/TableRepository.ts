import { AppController } from '@adapter/api/controllers/AppController'
import { App } from '@domain/entities/App'
import { Filter } from '@domain/entities/Filter'
import { Record } from '@domain/entities/Record'
import { ICodegenRepository } from '@domain/repositories/ICodegenRepository'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'

export class TableRepository {
  private orm: IOrmRepository
  private codegen: ICodegenRepository
  private app: App

  constructor(appController: AppController) {
    this.orm = appController.orm
    this.codegen = appController.codegen
    this.app = appController.get()
    const { tables } = this.app
    if (!tables) throw new Error('Tables not found in app')
    this.orm.configure(tables)
  }

  async create(table: string, record: Record) {
    return this.orm.create(table, record)
  }

  async createMany(table: string, record: Record[]) {
    return this.orm.createMany(table, record)
  }

  async list(table: string, filters?: Filter[]) {
    return this.orm.list(table, filters)
  }

  async read(table: string, id: string) {
    return this.orm.readById(table, id)
  }

  async runFormula(
    formula: string,
    context: {
      [key: string]: string | number | boolean | undefined | string[] | number[] | boolean[]
    },
    functions: { [key: string]: string }
  ) {
    return this.codegen.runScript(formula, context, functions)
  }

  async getTableFields(tableName: string) {
    const { tables } = this.app
    if (!tables) throw new Error('Tables not found in app')
    const table = tables.find((t) => t.name === tableName)
    if (!table) throw new Error(`Table ${tableName} not found`)
    return table.fields
  }
}
