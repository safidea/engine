import { CreateFileActionOptions } from './storage/createFile/CreateFileActionOptions'
import { FindRecordActionOptions } from './database/findRecord/FindRecordActionOptions'
import { LogActionOptions } from './log/LogActionOptions'
import { UpdateRecordActionOptions } from './database/updateRecord/UpdateRecordActionOptions'

export type ActionOptions =
  | CreateFileActionOptions
  | FindRecordActionOptions
  | LogActionOptions
  | UpdateRecordActionOptions
