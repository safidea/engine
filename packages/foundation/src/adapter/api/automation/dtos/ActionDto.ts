import { JSONSchemaType } from 'ajv'
import { LogActionDto, LogActionDtoSchema } from './actions/LogActionDto'
import { UpdateRecordActionDto, UpdateRecordActionDtoSchema } from './actions/UpdateRecordActionDto'
import { CreateFileActionDto, CreateFileActionDtoSchema } from './actions/CreateFileActionDto'
import { FindRecordActionDto, FindRecordActionDtoSchema } from './actions/FindRecordActionDto'

export type ActionDto =
  | UpdateRecordActionDto
  | LogActionDto
  | CreateFileActionDto
  | FindRecordActionDto

export const ActionDtoSchema: JSONSchemaType<ActionDto> = {
  oneOf: [
    UpdateRecordActionDtoSchema,
    LogActionDtoSchema,
    CreateFileActionDtoSchema,
    FindRecordActionDtoSchema,
  ],
}
