import { SyncCommand } from '@entities/drivers/database/Sync'
import { CommandSyncDto } from '@entities/drivers/fetcher/CommandSyncDto'
import { RecordMapper } from '@adapters/spi/orm/mappers/RecordMapper'
import { Record } from '@entities/drivers/database/Record'
import { App } from '@entities/app/App'

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
