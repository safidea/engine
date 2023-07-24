import { App } from '@domain/entities/App'
import { Filter } from '@domain/entities/Filter'
import { Record } from '@domain/entities/Record'
import { ICodegenRepository } from '@domain/repositories/ICodegenRepository'
import { IOrmRepository } from '@domain/repositories/IOrmRepository'

export class TableRepository {
  constructor(
    private readonly _app: App,
    private readonly _orm: IOrmRepository,
    private readonly _codegen: ICodegenRepository
  ) {
    const { tables } = this._app
    if (!tables) throw new Error('Tables not found in app')
    this._orm.configure(tables)
  }

  async create(table: string, record: Record) {
    return this._orm.create(table, record)
  }

  async createMany(table: string, record: Record[]) {
    return this._orm.createMany(table, record)
  }

  async update(table: string, record: Record, id: string) {
    return this._orm.softUpdateById(table, record, id)
  }

  async list(table: string, filters?: Filter[]) {
    return this._orm.list(table, filters)
  }

  async read(table: string, id: string) {
    return this._orm.readById(table, id)
  }

  async runFormula(
    formula: string,
    context: {
      [key: string]: string | number | boolean | undefined | string[] | number[] | boolean[]
    },
    functions: { [key: string]: string }
  ) {
    return this._codegen.runScript(formula, context, functions)
  }

  async getTableFields(tableName: string) {
    const { tables } = this._app
    if (!tables) throw new Error('Tables not found in app')
    const table = tables.find((t) => t.name === tableName)
    if (!table) throw new Error(`Table ${tableName} not found`)
    return table.fields
  }
}