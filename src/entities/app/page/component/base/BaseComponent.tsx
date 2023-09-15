import { AppDrivers } from '@entities/app/App'
import { PageConfig } from '../../Page'
import { BaseComponentParams } from './BaseComponentParams'
import { ComponentError } from '../ComponentError'
import { Table } from '@entities/app/table/Table'

export class BaseComponent {
  readonly type: string

  constructor(
    params: BaseComponentParams,
    readonly drivers: AppDrivers,
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
