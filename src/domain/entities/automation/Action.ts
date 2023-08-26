import { CreateFileAction } from './actions/CreateFileAction'
import { FindRecordAction } from './actions/FindRecordAction'
import { LogAction } from './actions/LogAction'
import { UpdateRecordAction } from './actions/UpdateRecordAction'

export type Action = UpdateRecordAction | LogAction | CreateFileAction | FindRecordAction
