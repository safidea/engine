import { IOrmSpi } from '@domain/spi/IOrmSpi'
import { IOrmAdapter } from './IOrmAdapter'
import { Record } from '@domain/entities/app/Record'
import { Filter } from '@domain/entities/app/Filter'
import { RecordMapper } from '../../api/app/mappers/RecordMapper'
import { FilterMapper } from '../../api/app/mappers/FilterMapper'
import { App } from '@domain/entities/app/App'
import { TableMapper } from '@adapter/api/table/mappers/TableMapper'
import { StartedState } from '../server/ServerSpi/StartedState'

export class OrmSpi implements IOrmSpi {
  constructor(
    private ormAdapter: IOrmAdapter,
    private app: App,
    private instance: StartedState
  ) {
    const tablesDto = TableMapper.toDtos(app.tables)
    this.ormAdapter.configure(tablesDto)
  }

  async tableExists(table: string) {
    return this.ormAdapter.tableExists(table)
  }

  async create(table: string, record: Record) {
    const recordDto = RecordMapper.toDto(record)
    const id = await this.ormAdapter.create(table, recordDto)
    this.instance.emit('record_created')
    return id
  }

  async createMany(table: string, records: Record[]) {
    const recordsDto = RecordMapper.toDtos(records)
    return this.ormAdapter.createMany(table, recordsDto)
  }

  async update(table: string, record: Record, id: string) {
    const recordDto = RecordMapper.toDto(record)
    return this.ormAdapter.softUpdateById(table, recordDto, id)
  }

  async updateMany(table: string, records: Record[]) {
    const recordsDto = RecordMapper.toDtos(records)
    return this.ormAdapter.softUpdateMany(table, recordsDto)
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
