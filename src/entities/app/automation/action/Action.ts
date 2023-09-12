import { AppDrivers } from '../../App'
import { ActionError } from './ActionError'
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
  const { type, name } = options
  if (type === 'create_file') {
    return new CreateFileAction(options, drivers, config)
  }
  if (type === 'find_record') {
    return new FindRecordAction(options, drivers, config)
  }
  if (type === 'log') {
    return new LogAction(options, drivers, config)
  }
  if (type === 'update_record') {
    return new UpdateRecordAction(options, drivers, config)
  }
  throw new ActionError(name, type, 'Invalid action type', config.automationName)
}
