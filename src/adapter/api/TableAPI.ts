import { type Drivers } from '@adapter/spi'
import { TableMapper } from './mappers/TableMapper'
import type { Table } from '@domain/entities/Table'
import { TableError } from '@domain/entities/TableError'
import type { ReactComponents } from '@domain/entities/Component'
import { Api } from './Api'
import type { TableDto } from './dtos/TableDto'

export class TableApi extends Api<TableDto, TableError, Table> {
  constructor(drivers: Drivers, components: ReactComponents) {
    super(drivers, components, TableMapper, 'table')
  }
}
