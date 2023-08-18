import { IOrmSpi } from '@domain/spi/IOrmSpi'
import { IOrmAdapter } from './IOrmAdapter'
import { Record } from '@domain/entities/orm/Record'
import { Filter } from '@domain/entities/orm/Filter'
import { RecordMapper } from '@adapter/spi/orm/mappers/RecordMapper'
import { FilterMapper } from './mappers/FilterMapper'
import { App } from '@domain/entities/app/App'
import { TableMapper } from '@adapter/api/table/mappers/TableMapper'
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
    const id = await this.ormAdapter.create(table, recordDto)
    await this.instance.emit('record_created')
    return id
  }

  async createMany(table: string, records: Record[]) {
    const recordsDto = RecordMapper.toDtos(records)
    const ids = await this.ormAdapter.createMany(table, recordsDto)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const record of records) await this.instance.emit('record_created')
    return ids
  }

  async update(table: string, record: Record, id: string) {
    const recordDto = RecordMapper.toDto(record)
    await this.ormAdapter.softUpdateById(table, recordDto, id)
    await this.instance.emit('record_updated')
  }

  async updateMany(table: string, records: Record[]) {
    const recordsDto = RecordMapper.toDtos(records)
    await this.ormAdapter.softUpdateMany(table, recordsDto)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const record of records) await this.instance.emit('record_updated')
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
