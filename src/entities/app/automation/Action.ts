import { AppDrivers } from '../App'
import { ActionError } from './ActionError'
import { ActionOptions } from './ActionOptions'
import { AutomationConfig } from './Automation'
import { CreateFileAction } from './actions/CreateFileAction'
import { FindRecordAction } from './actions/FindRecordAction'
import { LogAction } from './actions/LogAction'
import { UpdateRecordAction } from './actions/UpdateRecordAction'

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
  throw new ActionError(name, type, 'Invalid action type')
}
