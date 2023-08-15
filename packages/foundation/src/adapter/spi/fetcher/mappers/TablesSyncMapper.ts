import { SyncTables } from '@domain/entities/orm/Sync'
import { TablesSyncDto } from '@adapter/spi/fetcher/dtos/TablesSyncDto'
import { RecordMapper } from '@adapter/spi/orm/mappers/RecordMapper'
import { App } from '@domain/entities/app/App'

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
