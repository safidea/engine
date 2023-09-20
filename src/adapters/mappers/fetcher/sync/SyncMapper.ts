import { SyncCommandDto, SyncDto, SyncRecordsByTableDto } from '@adapters/dtos/SyncDto'
import { RecordToPersite } from '@entities/services/database/record/Record'
import { RecordToCreate } from '@entities/services/database/record/state/toCreate/RecordToCreate'
import { RecordToDelete } from '@entities/services/database/record/state/toDelete/RecordToDelete'
import { RecordToUpdate } from '@entities/services/database/record/state/toUpdate/RecordToUpdate'
import { Sync, SyncRecordsByTable, SyncResource } from '@entities/services/fetcher/sync/Sync'
import { RecordMapper } from '../../database/record/RecordMapper'
import { App } from '@entities/app/App'
import { FilterMapper } from '@adapters/mappers/database/filter/FilterMapper'

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

  static toSyncDto(sync: Sync): SyncDto {
    const { records = [], resources = [] } = sync
    const commands: SyncCommandDto[] = []
    for (const record of records) {
      if (record instanceof RecordToCreate) {
        commands.push({ action: 'toCreate', table: record.table.name, record: record.data() })
      } else if (record instanceof RecordToUpdate) {
        commands.push({
          action: 'toUpdate',
          table: record.table.name,
          record: record.toUpdateData(),
        })
      } else if (record instanceof RecordToDelete) {
        commands.push({
          action: 'toDelete',
          table: record.table.name,
          record: record.toDeleteData(),
        })
      }
    }
    const resourcesDtos = resources.map(({ table, filters = [] }) => {
      return { table: table.name, filters: FilterMapper.toManyDtos(filters) }
    })
    return { commands, resources: resourcesDtos }
  }

  static toRecordsByTable(
    recordsByTablesDto: SyncRecordsByTableDto,
    resources: SyncResource[]
  ): SyncRecordsByTable {
    const recordsByTables: SyncRecordsByTable = {}
    for (const tableName in recordsByTablesDto) {
      const table = resources.find((r) => r.table.name === tableName)?.table
      if (!table) throw new Error(`Table ${tableName} not found`)
      const recordsDto = recordsByTablesDto[tableName]
      recordsByTables[tableName] = RecordMapper.toManyPersisted(recordsDto, table)
    }
    return recordsByTables
  }

  static toRecordsByTableDto(recordsByTables: SyncRecordsByTable): SyncRecordsByTableDto {
    const recordsByTablesDto: SyncRecordsByTableDto = {}
    for (const tableName in recordsByTables) {
      const records = recordsByTables[tableName]
      recordsByTablesDto[tableName] = RecordMapper.toManyPersistedDtos(records)
    }
    return recordsByTablesDto
  }

  private static getTableByName(name: string, app: App) {
    const table = app.tables.getByName(name)
    if (!table) throw new Error(`Table ${name} not found`)
    return table
  }

  private static async getRecordById(id: string, table: string, app: App) {
    const record = await app.tables.services.database.read(this.getTableByName(table, app), id)
    if (!record) throw new Error(`Record ${id} not found in table ${table}`)
    return record
  }
}
