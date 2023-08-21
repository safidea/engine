import { Action } from '@domain/entities/automation/Action'
import { ActionDto } from '../dtos/ActionDto'
import { UpdateRecordActionMapper } from './actions/UpdateRecordActionMapper'
import { LogActionMapper } from './actions/LogActionMapper'
import { UpdateRecordAction } from '@domain/entities/automation/actions/UpdateRecordAction'
import { LogAction } from '@domain/entities/automation/actions/LogAction'
import { ILoggerSpi } from '@domain/spi/ILoggerSpi'
import { Table } from '@domain/entities/table/Table'
import { CreateFileActionMapper } from './actions/CreateFileActionMapper'
import { CreateFileAction } from '@domain/entities/automation/actions/CreateFileAction'
import { IStorageSpi } from '@domain/spi/IStorageSpi'
import { IConverterSpi } from '@domain/spi/IConverterSpi'
import { ITemplatingSpi } from '@domain/spi/ITemplatingSpi'

export interface ActionMapperSpis {
  logger?: ILoggerSpi
  storage?: IStorageSpi
  converter?: IConverterSpi
  templating?: ITemplatingSpi
}

export class ActionMapper {
  static toEntity(actionDto: ActionDto, tables: Table[], spis: ActionMapperSpis): Action {
    const { logger, storage, converter, templating } = spis
    const { type } = actionDto
    if (type === 'update_record') {
      return UpdateRecordActionMapper.toEntity(actionDto, tables)
    }
    if (type === 'log') {
      if (!logger) throw new Error('LoggerSpi is required')
      return LogActionMapper.toEntity(actionDto, logger)
    }
    if (type === 'create_file') {
      if (!storage) throw new Error('StorageSpi is required')
      if (!converter) throw new Error('ConverterSpi is required')
      if (!templating) throw new Error('TemplatingSpi is required')
      return CreateFileActionMapper.toEntity(actionDto, storage, converter, templating)
    }
    throw new Error(`Invalid action type ${type}`)
  }

  static toDto(action: Action): ActionDto {
    if (action instanceof UpdateRecordAction) {
      return UpdateRecordActionMapper.toDto(action)
    }
    if (action instanceof LogAction) {
      return LogActionMapper.toDto(action)
    }
    if (action instanceof CreateFileAction) {
      return CreateFileActionMapper.toDto(action)
    }
    throw new Error(`Invalid action instance ${action}`)
  }

  static toEntities(actionDtos: ActionDto[], tables: Table[], spis: ActionMapperSpis): Action[] {
    return actionDtos.map((actionDto) => this.toEntity(actionDto, tables, spis))
  }

  static toDtos(actions: Action[]): ActionDto[] {
    return actions.map((action) => this.toDto(action))
  }
}
