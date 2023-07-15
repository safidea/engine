import { DatabaseService } from 'server-database'
import { ConfigUtils } from 'server-common'

import type { DatabaseDataType, DatabaseListParamsInterface } from 'shared-database'
import type { TableFieldsInterface } from 'shared-table'

class TableService {
  private databaseService: DatabaseService
  private configUtils: ConfigUtils

  constructor({
    databaseService,
    configUtils,
  }: {
    databaseService: DatabaseService
    configUtils: ConfigUtils
  }) {
    this.databaseService = databaseService
    this.configUtils = configUtils
  }

  public async create(table: string, data: DatabaseDataType) {
    const fields = this.configUtils.get(`tables.${table}.fields`) as TableFieldsInterface
    for (const [field, config] of Object.entries(fields)) {
      const value = data[field]
      if (config.type === 'Link' && value) {
        data[field] = {
          // eslint-disable-next-line
          // @ts-ignore
          create: value,
        }
      }
    }
    return this.databaseService.create(table, data)
  }

  public async createMany(table: string, data: DatabaseDataType[]) {
    const fields = this.configUtils.get(`tables.${table}.fields`) as TableFieldsInterface
    for (const [field, config] of Object.entries(fields)) {
      for (const row of data) {
        const value = row[field]
        if (config.type === 'Link' && value) {
          row[field] = {
            // eslint-disable-next-line
            // @ts-ignore
            create: value,
          }
        }
      }
    }
    return this.databaseService.createMany(table, data)
  }

  public async read(table: string, id: string) {
    return this.databaseService.readById(table, id)
  }

  public async update(table: string, id: string, data: DatabaseDataType) {
    const fields = this.configUtils.get(`tables.${table}.fields`) as TableFieldsInterface
    for (const [field, config] of Object.entries(fields)) {
      const value = data[field]
      if (config.type === 'Link' && value) {
        data[field] = {
          // eslint-disable-next-line
          // @ts-ignore
          update: value,
        }
      }
    }
    data.updated_at = new Date().toISOString()
    return this.databaseService.updateById(table, id, data)
  }

  public async delete(table: string, id: string) {
    const data = { deleted_at: new Date().toISOString() }
    return this.databaseService.updateById(table, id, data)
  }

  public async list(table: string, params: DatabaseListParamsInterface) {
    return this.databaseService.list(table, params)
  }
}

export default TableService
