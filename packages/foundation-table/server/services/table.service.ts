import { ConfigService } from 'foundation-common/server'
import { DatabaseService } from 'foundation-database/server'
import { DEFAULT_FIELDS } from '../constants/table.constants'

import type { Tables, Table } from '../../types/config.type'

class TableService {
  private tables: Tables = {}

  constructor() {
    this.tables = ConfigService.get('tables') as Tables
  }

  get(name: string): Table {
    const table = this.tables[name]
    if (!table) {
      throw new Error(`Table ${name} does not exist`)
    }
    table.fields = { ...DEFAULT_FIELDS, ...table.fields }
    return table
  }

  getNames(): string[] {
    return Object.keys(this.tables)
  }

  async create(name: string, data: Record<string, any>): Promise<Record<string, any>> {
    return DatabaseService.create(name, data)
  }

  async read(name: string, id: string): Promise<Record<string, any>> {
    return DatabaseService.read(name, id)
  }

  async update(name: string, id: string, data: Record<string, any>): Promise<Record<string, any>> {
    return DatabaseService.update(name, id, data)
  }

  async delete(name: string, id: string): Promise<Record<string, any>> {
    return DatabaseService.delete(name, id)
  }

  async list(name: string, query: Record<string, any>): Promise<Record<string, any>> {
    return DatabaseService.list(name, query)
  }
}

const service = new TableService()

export default service
