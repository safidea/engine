import debug from 'debug'
import TableService from '../services/table.service'

import type {
  RequestInterface,
  RequestBodyInterface,
  RequestArrayBodyInterface,
  ResponseInterface,
} from 'shared-app'

const log: debug.IDebugger = debug('controller:table')

class TableController {
  private tableService: TableService

  constructor({ tableService }: { tableService: TableService }) {
    this.tableService = tableService
  }

  public async create(req: RequestBodyInterface): Promise<ResponseInterface> {
    const { table } = req.params
    const row = await this.tableService.create(table, req.body)
    log(`Created new row in ${table} with ID ${row.id}`)
    return { json: row }
  }

  public async createMany(req: RequestArrayBodyInterface): Promise<ResponseInterface> {
    const { table } = req.params
    const rows = await this.tableService.createMany(table, req.body)
    log(`Created ${rows.length} rows in ${table}`)
    return { json: rows }
  }

  public async update(req: RequestBodyInterface): Promise<ResponseInterface> {
    const { table, id } = req.params
    const row = await this.tableService.update(table, id, req.body)
    log(`Updated row in ${table} with ID ${row.id}`)
    return { json: row }
  }

  public async read(req: RequestInterface): Promise<ResponseInterface> {
    const { table, id } = req.params
    const row = await this.tableService.read(table, id)
    if (row) log(`Got row in ${table} with ID ${row.id}`)
    return { json: row }
  }

  public async list(req: RequestInterface): Promise<ResponseInterface> {
    const { table } = req.params
    const rows = await this.tableService.list(table)
    log(`Got all rows in ${table}`)
    return { json: rows }
  }

  public async delete(req: RequestInterface): Promise<ResponseInterface> {
    const { table, id } = req.params
    const row = await this.tableService.delete(table, id)
    log(`Deleted row in ${table} with ID ${row.id}`)
    return { json: row }
  }
}

export default TableController
