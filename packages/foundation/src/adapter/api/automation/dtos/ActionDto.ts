import { JSONSchemaType } from 'ajv'
import { LogActionDto, LogActionDtoSchema } from './actions/LogActionDto'
import { UpdateRecordActionDto, UpdateRecordActionDtoSchema } from './actions/UpdateRecordActionDto'
import { CreateFileActionDto, CreateFileActionDtoSchema } from './actions/CreateFileActionDto'

export type ActionDto = UpdateRecordActionDto | LogActionDto | CreateFileActionDto

export const ActionDtoSchema: JSONSchemaType<ActionDto> = {
  oneOf: [UpdateRecordActionDtoSchema, LogActionDtoSchema, CreateFileActionDtoSchema],
}
