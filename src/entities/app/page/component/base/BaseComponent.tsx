import { AppDrivers } from '@entities/app/App'
import { PageConfig } from '../../Page'
import { BaseComponentOptions } from './BaseComponentOptions'
import { ComponentError } from '../ComponentError'
import { Table } from '@entities/app/table/Table'

export class BaseComponent {
  readonly type: string

  constructor(
    options: BaseComponentOptions,
    readonly drivers: AppDrivers,
    readonly config: PageConfig
  ) {
    this.type = options.type
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
