import { ConfigService } from 'foundation-common/server'
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
}

const service = new TableService()

export default service
