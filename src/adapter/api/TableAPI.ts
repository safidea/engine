import { type Drivers } from '@adapter/spi'
import { TableMapper } from './mappers/table/TableMapper'
import type { Table } from '@domain/entities/table/Table'
import { TableError } from '@domain/entities/table/TableError'
import type { ReactComponents } from '@domain/entities/page/Component'
import { Api } from './Api'
import type { Table as TableConfig } from './configs/table/Table'

export class TableApi extends Api<TableConfig, TableError, Table> {
  constructor(drivers: Drivers, components: ReactComponents) {
    super(drivers, components, TableMapper, 'table')
  }
}
