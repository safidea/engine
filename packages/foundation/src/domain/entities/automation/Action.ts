import { LogAction } from './actions/LogAction'
import { UpdateRecordAction } from './actions/UpdateRecordAction'

export type Action = UpdateRecordAction | LogAction
