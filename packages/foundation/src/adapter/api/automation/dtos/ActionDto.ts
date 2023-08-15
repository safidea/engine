import { JSONSchemaType } from 'ajv'
import { LogActionDto, LogActionDtoSchema } from './actions/LogActionDto'
import { UpdateRecordActionDto, UpdateRecordActionDtoSchema } from './actions/UpdateRecordAction'
import { CreateFileActionDto, CreateFileActionDtoSchema } from './actions/CreateFileAction'

export type ActionDto = UpdateRecordActionDto | LogActionDto | CreateFileActionDto

export const ActionDtoSchema: JSONSchemaType<ActionDto> = {
  oneOf: [UpdateRecordActionDtoSchema, LogActionDtoSchema, CreateFileActionDtoSchema],
}
