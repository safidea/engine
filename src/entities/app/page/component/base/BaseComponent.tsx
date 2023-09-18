import { PageConfig } from '../../Page'
import { BaseComponentParams } from './BaseComponentParams'
import { ComponentError } from '../ComponentError'
import { Table } from '@entities/app/table/Table'
import { PageServices } from '../../PageServices'

export class BaseComponent {
  readonly type: string

  constructor(
    params: BaseComponentParams,
    readonly services: PageServices,
    readonly config: PageConfig
  ) {
    this.type = params.type
  }

  throwError(message: string): never {
    throw new ComponentError(this.type, message)
  }

  getTableByName(tableName: string): Table {
    const table = this.config.tables.getByName(tableName)
    if (!table) this.throwError(`table ${tableName} not found`)
    return table
  }
}
