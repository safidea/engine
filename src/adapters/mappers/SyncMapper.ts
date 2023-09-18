import { SyncDto, SyncRecordsByTableDto } from '@adapters/dtos/SyncDto'
import { RecordToPersite } from '@entities/services/database/record/Record'
import { RecordToCreate } from '@entities/services/database/record/state/toCreate/RecordToCreate'
import { RecordToDelete } from '@entities/services/database/record/state/toDelete/RecordToDelete'
import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'
import { Sync, SyncRecordsByTable, SyncResource } from '@entities/services/fetcher/sync/Sync'
import { FilterMapper } from './FilterMapper'
import { RecordMapper } from './RecordMapper'
import { App } from '@entities/app/App'

export class SyncMapper {
  static async toSync(dto: SyncDto, app: App): Promise<Sync> {
    const { commands = [], resources: resourcesDtos = [] } = dto
    const records: RecordToPersite[] = await Promise.all(
      commands.map(async (command) => {
        const { action, table: tableName, record } = command
        const table = this.getTableByName(tableName, app)
        if (action === 'toCreate') {
          return new RecordToCreate(record, table)
        } else if (action === 'toUpdate') {
          const persistedRecord = await this.getRecordById(record.id, table.name, app)
          return new RecordToUpdate(persistedRecord.data(), table, record)
        } else if (action === 'toDelete') {
          const persistedRecord = await this.getRecordById(record.id, table.name, app)
          return new RecordToDelete(persistedRecord.data(), table)
        } else {
          throw new Error(`Command action "${action}" not supported`)
        }
      })
    )
    const resources: SyncResource[] = resourcesDtos.map(
      ({ table: tableName, filters: filtersDtos }) => {
        const table = this.getTableByName(tableName, app)
        const filters = FilterMapper.toManyFilters(filtersDtos)
        return { table, filters }
      }
    )
    return { records, resources }
  }

  static toRecordsByTable(recordsByTables: SyncRecordsByTable): SyncRecordsByTableDto {
    const recordsByTablesDto: SyncRecordsByTableDto = {}
    for (const tableName in recordsByTables) {
      const records = recordsByTables[tableName]
      recordsByTablesDto[tableName] = RecordMapper.toManyDtos(records)
    }
    return recordsByTablesDto
  }

  private static getTableByName(name: string, app: App) {
    const table = app.tables.getByName(name)
    if (!table) throw new Error(`Table ${name} not found`)
    return table
  }

  private static async getRecordById(id: string, table: string, app: App) {
    const record = await app.services.database.read(this.getTableByName(table, app), id)
    if (!record) throw new Error(`Record ${id} not found in table ${table}`)
    return record
  }
}
