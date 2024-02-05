import type { ApiOptions } from '@adapter/api/Api'
import { TableApi } from '@adapter/api/TableApi'
import type { Table } from '@adapter/api/configs/table/Table'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { TableError } from '@domain/entities/table/TableError'
export type { Table } from '@adapter/api/configs/table/Table'

export default class {
  api: TableApi

  constructor(options?: ApiOptions) {
    this.api = new TableApi(
      { ...drivers, ...options?.drivers },
      { ...components, ...options?.components }
    )
  }

  getConfigErrors = (config: unknown) => this.api.getConfigErrors(config)
  isValidConfig = (config: unknown) => this.api.isValidConfig(config)
  createFromConfig = (config: Table) => this.api.createFromConfig(config)
}
