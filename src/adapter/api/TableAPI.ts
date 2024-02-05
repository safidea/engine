import { TableMapper, type Params } from './mappers/table/TableMapper'
import type { Table } from '@domain/entities/table/Table'
import { TableError } from '@domain/entities/table/TableError'
import type { Params as SpisParams } from '@adapter/spi'
import { Api } from './Api'
import type { Table as TableConfig } from './configs/table/Table'

export class TableApi extends Api<TableConfig, TableError, Table, Params> {
  constructor(params: SpisParams) {
    super(params, TableMapper, 'table')
  }
}
