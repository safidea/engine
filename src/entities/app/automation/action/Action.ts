import { AppDrivers } from '../../App'
import { ActionOptions } from './ActionOptions'
import { AutomationConfig } from '../Automation'
import { CreateFileAction } from './storage/createFile/CreateFileAction'
import { FindRecordAction } from './database/findRecord/FindRecordAction'
import { LogAction } from './log/LogAction'
import { UpdateRecordAction } from './database/updateRecord/UpdateRecordAction'

export type Action = CreateFileAction | FindRecordAction | LogAction | UpdateRecordAction

export function newAction(
  options: ActionOptions,
  drivers: AppDrivers,
  config: AutomationConfig
): Action {
  switch (options.type) {
    case 'create_file':
      return new CreateFileAction(options, drivers, config)
    case 'find_record':
      return new FindRecordAction(options, drivers, config)
    case 'log':
      return new LogAction(options, drivers, config)
    case 'update_record':
      return new UpdateRecordAction(options, drivers, config)
  }
}
