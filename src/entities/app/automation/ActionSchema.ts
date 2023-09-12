import { JSONSchemaType } from 'ajv'
import { ActionOptions } from './ActionOptions'
import { CreateFileActionSchema } from './actions/CreateFileActionSchema'
import { FindRecordActionSchema } from './actions/FindRecordActionSchema'
import { UpdateRecordActionSchema } from './actions/UpdateRecordActionSchema'
import { LogActionSchema } from './actions/LogActionSchema'

export const ActionSchema: JSONSchemaType<ActionOptions> = {
  oneOf: [
    UpdateRecordActionSchema,
    LogActionSchema,
    CreateFileActionSchema,
    FindRecordActionSchema,
  ],
}
