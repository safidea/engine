import { join } from 'path'
import { ConfigService } from 'foundation-common/server'

import type { Tables, Table } from '../../types/config.type'

class TableService {
  private tables: Tables = {}

  constructor() {
    this.tables = ConfigService.get('tables') as Tables
  }

  get(name: string): Table {
    return this.tables[name]
  }

  getNames(): string[] {
    return Object.keys(this.tables)
  }

  updateSchema(name: string) {
    const { unique, model, fields } = this.get(name)
    const modelName = model ?? PrismaService.getModelName(name)
    const modelData = { fields, unique, map: name }
    PrismaService.updateModelSchema(modelName, modelData)
  }
}

const service = new TableService()

export default service
