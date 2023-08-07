import { SyncCommand } from '@domain/entities/app/Sync'
import { SyncCommandDto } from '../../dtos/sync/SyncCommandDto'
import { RecordMapper } from '../RecordMapper'
import { Record } from '@domain/entities/app/Record'
import { App } from '@domain/entities/app/App'

export class SyncCommandMapper {
  static toEntity(syncCommandDto: SyncCommandDto, app: App): SyncCommand {
    const { type, table, record } = syncCommandDto
    return {
      type,
      table,
      record: RecordMapper.toEntity(record, app.getTableByName(table)),
    }
  }

  static toDto(record: Record): SyncCommandDto | undefined {
    if (record.state === 'read') return undefined
    return {
      type: record.state,
      table: record.tableName,
      record: RecordMapper.toDto(record),
    }
  }

  static toEntities(syncCommandDtos: SyncCommandDto[], app: App): SyncCommand[] {
    return syncCommandDtos.map((syncCommandDto) => this.toEntity(syncCommandDto, app))
  }

  static toDtos(records: Record[]): SyncCommandDto[] {
    const commands: SyncCommandDto[] = []
    for (const record of records) {
      const commandDto = this.toDto(record)
      if (commandDto) commands.push(commandDto)
    }
    return commands
  }
}
