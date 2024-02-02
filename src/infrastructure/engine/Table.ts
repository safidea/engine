import type { ApiOptions } from '@adapter/api/Api'
import { TableApi } from '@adapter/api/TableApi'
import type { TableDto } from '@adapter/api/dtos/TableDto'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { TableError } from '@domain/entities/table/TableError'
export type { TableDto as TableConfig } from '@adapter/api/dtos/TableDto'

export default class Table {
  api: TableApi

  constructor(options?: ApiOptions) {
    this.api = new TableApi(
      { ...drivers, ...options?.drivers },
      { ...components, ...options?.components }
    )
  }

  getConfigErrors = (config: unknown) => this.api.getConfigErrors(config)
  isValidConfig = (config: unknown) => this.api.isValidConfig(config)
  createFromConfig = (config: TableDto) => this.api.createFromConfig(config)
}
