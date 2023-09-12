import { CreateFileActionOptions } from './actions/CreateFileActionOptions'
import { FindRecordActionOptions } from './actions/FindRecordActionOptions'
import { LogActionOptions } from './actions/LogActionOptions'
import { UpdateRecordActionOptions } from './actions/UpdateRecordActionOptions'

export type ActionOptions =
  | CreateFileActionOptions
  | FindRecordActionOptions
  | LogActionOptions
  | UpdateRecordActionOptions
