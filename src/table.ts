import { TableApi } from '@adapter/api/TableApi'
import { components } from '@infrastructure/components'
import { drivers } from '@infrastructure/drivers'

export { TableError } from '@domain/entities/TableError'
export type { TableDto as TableConfig } from '@adapter/api/dtos/TableDto'
export default new TableApi(drivers, components)
