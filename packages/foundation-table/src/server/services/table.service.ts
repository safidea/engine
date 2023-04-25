import { DatabaseService } from '@database/server'

import type {
  DatabaseServiceFunctionType,
  DatabaseServiceFunctionDataType,
  DatabaseServiceFunctionIdType,
  DatabaseServiceFunctionListType,
} from '@database'

class TableService {
  public create: DatabaseServiceFunctionDataType = async (baseName, tableName, params) => {
    return DatabaseService.create(baseName, tableName, params)
  }

  public read: DatabaseServiceFunctionIdType = async (baseName, tableName, params) => {
    return DatabaseService.readById(baseName, tableName, params)
  }

  public update: DatabaseServiceFunctionType = async (baseName, tableName, params) => {
    return DatabaseService.patchById(baseName, tableName, params)
  }

  public delete: DatabaseServiceFunctionIdType = async (baseName, tableName, params) => {
    return DatabaseService.deleteById(baseName, tableName, params)
  }

  public list: DatabaseServiceFunctionListType = async (baseName, tableName) => {
    return DatabaseService.list(baseName, tableName)
  }
}

export default new TableService()
