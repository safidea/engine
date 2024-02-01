import { TableAPI } from '@adapter/api/TableAPI'
import { drivers } from '@infrastructure/drivers'

export { TableError } from '@domain/entities/TableError'
export type { TableConfig } from '@domain/entities/Table'
export default new TableAPI(drivers)
