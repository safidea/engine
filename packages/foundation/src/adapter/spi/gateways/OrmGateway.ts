import { Filter } from '@domain/entities/table/Filter'
import { Record } from '@domain/entities/table/Record'
import { Table } from '@domain/entities/table/Table'
import { IOrmGateway } from '@domain/gateways/IOrmGateway'

export class OrmGateway {
  constructor(
    private readonly _orm: IOrmGateway,
    tables: Table[]
  ) {
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

  async list(table: string, filters: Filter[]) {
    return this._orm.list(table, filters)
  }

  async read(table: string, id: string) {
    return this._orm.readById(table, id)
  }
}
