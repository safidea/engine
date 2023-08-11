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

export type TriggerDto = RecordCreatedTriggerDto | ServerStartedTriggerDto | ServerStoppedTriggerDto

export const TriggerDtoSchema: JSONSchemaType<TriggerDto> = {
  oneOf: [
    ServerStartedTriggerDtoSchema,
    ServerStoppedTriggerDtoSchema,
    RecordCreatedTriggerDtoSchema,
  ],
}
