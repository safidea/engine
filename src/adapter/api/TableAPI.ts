import { TableMapper, type Params } from './mappers/table/TableMapper'
import type { Table } from '@domain/engine/table/Table'
import type { Params as SpisParams } from '@adapter/spi'
import { Base } from './base'
import type { Table as Config } from './configs/table/Table'

export class TableApi extends Base<Config, Table, Params> {
  constructor(params: SpisParams) {
    super(params, TableMapper, 'table')
  }
}
