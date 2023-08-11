import { JSONSchemaType } from 'ajv'
import { LogActionDto, LogActionDtoSchema } from './actions/LogActionDto'
import { UpdateRecordActionDto, UpdateRecordActionDtoSchema } from './actions/UpdateRecordAction'

export type ActionDto = UpdateRecordActionDto | LogActionDto

export const ActionDtoSchema: JSONSchemaType<ActionDto> = {
  oneOf: [UpdateRecordActionDtoSchema, LogActionDtoSchema],
}
