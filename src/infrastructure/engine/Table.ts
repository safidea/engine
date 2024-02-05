import { TableApi } from '@adapter/api/TableApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { TableError } from '@domain/entities/table/TableError'
export type { Table } from '@adapter/api/configs/table/Table'

class Table {
  constructor(private api: TableApi) {}
  getErrors = (config: unknown) => this.api.getConfigErrors(config)
  validate = (config: unknown) => this.api.isValidConfig(config)
}

export default new Table(new TableApi(drivers, components))
