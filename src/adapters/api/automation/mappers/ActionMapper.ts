import { Action } from '@entities/app/automation/Action'
import { ActionDto } from '../dtos/ActionDto'
import { UpdateRecordActionMapper } from './actions/UpdateRecordActionMapper'
import { LogActionMapper } from './actions/LogActionMapper'
import { UpdateRecordAction } from '@entities/app/automation/actions/UpdateRecordAction'
import { LogAction } from '@entities/app/automation/actions/LogAction'
import { ILoggerSpi } from '@entities/spi/ILoggerSpi'
import { Table } from '@entities/app/table/Table'
import { CreateFileActionMapper } from './actions/CreateFileActionMapper'
import { CreateFileAction } from '@entities/app/automation/actions/CreateFileAction'
import { IStorageSpi } from '@entities/spi/IStorageSpi'
import { IConverterSpi } from '@entities/spi/IConverterSpi'
import { ITemplatingSpi } from '@entities/spi/ITemplatingSpi'
import { FindRecordActionMapper } from './actions/FindRecordActionMapper'
import { FindRecordAction } from '@entities/app/automation/actions/FindRecordAction'

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
      if (!templating) throw new Error('TemplatingSpi is required')
      return UpdateRecordActionMapper.toEntity(actionDto, tables, templating)
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
    if (type === 'find_record') {
      if (!templating) throw new Error('TemplatingSpi is required')
      return FindRecordActionMapper.toEntity(actionDto, tables, templating)
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
    if (action instanceof FindRecordAction) {
      return FindRecordActionMapper.toDto(action)
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
