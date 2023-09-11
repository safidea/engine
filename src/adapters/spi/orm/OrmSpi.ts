import { IOrmSpi } from '@entities/spi/IOrmSpi'
import { IOrmAdapter } from './IOrmAdapter'
import { Record } from '@entities/orm/Record'
import { Filter } from '@entities/orm/Filter'
import { RecordMapper } from '@adapters/spi/orm/mappers/RecordMapper'
import { FilterMapper } from './mappers/FilterMapper'
import { App } from '@entities/app/App'
import { TableMapper } from '@adapters/api/table/mappers/TableMapper'
import { StartedState } from '../server/ServerSpi/StartedState'

export class OrmSpi implements IOrmSpi {
  constructor(
    private ormAdapter: IOrmAdapter,
    private app: App,
    private instance: StartedState
  ) {}

  async configure(): Promise<void> {
    const tablesDto = TableMapper.toDtos(this.app.tables)
    await this.ormAdapter.configure(tablesDto)
  }

  async tableExists(table: string) {
    return this.ormAdapter.tableExists(table)
  }

  async create(table: string, record: Record) {
    const recordDto = RecordMapper.toDto(record)
    return this.ormAdapter.create(table, recordDto)
  }

  async createMany(table: string, records: Record[]) {
    const recordsDto = RecordMapper.toDtos(records)
    return this.ormAdapter.createMany(table, recordsDto)
  }

  async update(table: string, record: Record, id: string) {
    const recordDto = RecordMapper.toDto(record)
    await this.ormAdapter.softUpdateById(table, recordDto, id)
  }

  async updateMany(table: string, records: Record[]) {
    const recordsDto = RecordMapper.toDtos(records)
    await this.ormAdapter.softUpdateMany(table, recordsDto)
  }

  async list(table: string, filters: Filter[]) {
    const filtersDto = FilterMapper.toDtos(filters)
    const recordsDto = await this.ormAdapter.list(table, filtersDto)
    return RecordMapper.toEntities(recordsDto, this.app.getTableByName(table))
  }

  async read(table: string, id: string) {
    const recordDto = await this.ormAdapter.readById(table, id)
    if (!recordDto) return undefined
    return RecordMapper.toEntity(recordDto, this.app.getTableByName(table))
  }
}
