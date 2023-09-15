import { AppServices } from '../../App'
import { ActionParams } from './ActionParams'
import { AutomationConfig } from '../Automation'
import { CreateFileAction } from './storage/createFile/CreateFileAction'
import { FindRecordAction } from './database/findRecord/FindRecordAction'
import { LogAction } from './log/LogAction'
import { UpdateRecordAction } from './database/updateRecord/UpdateRecordAction'

export type Action = CreateFileAction | FindRecordAction | LogAction | UpdateRecordAction

export function newAction(
  params: ActionParams,
  services: AppServices,
  config: AutomationConfig
): Action {
  switch (params.type) {
    case 'create_file':
      return new CreateFileAction(params, services, config)
    case 'find_record':
      return new FindRecordAction(params, services, config)
    case 'log':
      return new LogAction(params, services, config)
    case 'update_record':
      return new UpdateRecordAction(params, services, config)
  }
}
