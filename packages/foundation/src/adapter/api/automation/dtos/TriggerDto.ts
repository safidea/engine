import { JSONSchemaType } from 'ajv'
import {
  ServerStartedTriggerDto,
  ServerStartedTriggerDtoSchema,
} from './triggers/ServerStartedTriggerDto'
import {
  RecordCreatedTriggerDto,
  RecordCreatedTriggerDtoSchema,
} from './triggers/RecordCreatedTriggerDto'
import {
  ServerStoppedTriggerDto,
  ServerStoppedTriggerDtoSchema,
} from './triggers/ServerStoppedTriggerDto'
import {
  RecordUpdatedTriggerDto,
  RecordUpdatedTriggerDtoSchema,
} from './triggers/RecordUpdatedTriggerDto'

export type TriggerDto =
  | RecordCreatedTriggerDto
  | RecordUpdatedTriggerDto
  | ServerStartedTriggerDto
  | ServerStoppedTriggerDto

export const TriggerDtoSchema: JSONSchemaType<TriggerDto> = {
  oneOf: [
    ServerStartedTriggerDtoSchema,
    ServerStoppedTriggerDtoSchema,
    RecordCreatedTriggerDtoSchema,
    RecordUpdatedTriggerDtoSchema,
  ],
}
