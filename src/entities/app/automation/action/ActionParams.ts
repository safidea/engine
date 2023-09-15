import * as t from 'io-ts'
import { CreateFileActionParams } from './storage/createFile/CreateFileActionParams'
import { FindRecordActionParams } from './database/findRecord/FindRecordActionParams'
import { LogActionParams } from './log/LogActionParams'
import { UpdateRecordActionParams } from './database/updateRecord/UpdateRecordActionParams'

export const ActionParams = t.union([
  CreateFileActionParams,
  FindRecordActionParams,
  LogActionParams,
  UpdateRecordActionParams,
])

export type ActionParams = t.TypeOf<typeof ActionParams>
