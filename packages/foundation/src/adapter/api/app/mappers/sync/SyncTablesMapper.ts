import { SyncTables } from '@domain/entities/app/Sync'
import { SyncTablesDto } from '../../dtos/sync/SyncTablesDto'
import { App } from '@domain/entities/app/App'
import { RecordMapper } from '../RecordMapper'

export class SyncTablesMapper {
  static toEntities(syncTablesDto: SyncTablesDto, app: App): SyncTables {
    return Object.entries(syncTablesDto ?? {}).reduce(
      (acc: SyncTables, [table, recordsDto = []]) => {
        acc[table] = RecordMapper.toEntities(recordsDto, app.getTableByName(table))
        return acc
      },
      {}
    )
  }

  static toDtos(syncTables: SyncTables): SyncTablesDto {
    return Object.entries(syncTables ?? {}).reduce((acc: SyncTablesDto, [table, records = []]) => {
      acc[table] = RecordMapper.toDtos(records)
      return acc
    }, {})
  }
}
