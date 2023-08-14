import { SyncCommand } from '@domain/entities/app/Sync'
import { CommandSyncDto } from '../../dtos/sync/CommandSyncDto'
import { RecordMapper } from '../RecordMapper'
import { Record } from '@domain/entities/app/Record'
import { App } from '@domain/entities/app/App'

export class CommandSyncMapper {
  static toEntity(CommandSyncDto: CommandSyncDto, app: App): SyncCommand {
    const { type, table, record } = CommandSyncDto
    return {
      type,
      table,
      record: RecordMapper.toEntity(record, app.getTableByName(table)),
    }
  }

  static toDto(record: Record): CommandSyncDto | undefined {
    const state = record.getCurrentState()
    if (state === 'read') return undefined
    return {
      type: state,
      table: record.tableName,
      record: RecordMapper.toDto(record),
    }
  }

  static toEntities(CommandSyncDtos: CommandSyncDto[], app: App): SyncCommand[] {
    return CommandSyncDtos.map((CommandSyncDto) => this.toEntity(CommandSyncDto, app))
  }

  static toDtos(records: Record[]): CommandSyncDto[] {
    const commands: CommandSyncDto[] = []
    for (const record of records) {
      const commandDto = this.toDto(record)
      if (commandDto) commands.push(commandDto)
    }
    return commands
  }
}
