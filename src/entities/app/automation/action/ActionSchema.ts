import { JSONSchemaType } from 'ajv'
import { ActionOptions } from './ActionOptions'
import { CreateFileActionSchema } from './storage/createFile/CreateFileActionSchema'
import { FindRecordActionSchema } from './database/findRecord/FindRecordActionSchema'
import { UpdateRecordActionSchema } from './database/updateRecord/UpdateRecordActionSchema'
import { LogActionSchema } from './log/LogActionSchema'

export const ActionSchema: JSONSchemaType<ActionOptions> = {
  oneOf: [
    UpdateRecordActionSchema,
    LogActionSchema,
    CreateFileActionSchema,
    FindRecordActionSchema,
  ],
}
