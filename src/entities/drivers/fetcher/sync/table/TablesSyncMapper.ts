import { SyncTables } from '@entities/drivers/fetcher/sync/Sync'
import { TablesSyncDto } from '@adapters/spi/fetcher/dtos/TablesSyncDto'
import { RecordMapper } from '@adapters/spi/orm/mappers/RecordMapper'
import { App } from '@entities/app/App'

export class TablesSyncMapper {
  static toEntities(TablesSyncDto: TablesSyncDto, app: App): SyncTables {
    return Object.entries(TablesSyncDto ?? {}).reduce(
      (acc: SyncTables, [table, recordsDto = []]) => {
        acc[table] = RecordMapper.toEntities(recordsDto, app.getTableByName(table))
        return acc
      },
      {}
    )
  }

  static toDtos(syncTables: SyncTables): TablesSyncDto {
    return Object.entries(syncTables ?? {}).reduce((acc: TablesSyncDto, [table, records = []]) => {
      acc[table] = RecordMapper.toDtos(records)
      return acc
    }, {})
  }
}
