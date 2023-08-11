import { SyncTables } from '@domain/entities/app/Sync'
import { TablesSyncDto } from '../../dtos/sync/TablesSyncDto'
import { App } from '@domain/entities/app/App'
import { RecordMapper } from '../RecordMapper'

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
