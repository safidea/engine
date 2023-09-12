import { JSONSchemaType } from 'ajv'
import { TriggerOptions } from './TriggerOptions'
import { RecordCreatedTriggerSchema } from './triggers/RecordCreatedTriggerSchema'
import { RecordUpdatedTriggerSchema } from './triggers/RecordUpdatedTriggerSchema'
import { ServerStartedTriggerSchema } from './triggers/ServerStartedTriggerSchema'
import { ServerStoppedTriggerSchema } from './triggers/ServerStoppedTriggerSchema'

export const TriggerSchema: JSONSchemaType<TriggerOptions> = {
  oneOf: [
    ServerStartedTriggerSchema,
    ServerStoppedTriggerSchema,
    RecordCreatedTriggerSchema,
    RecordUpdatedTriggerSchema,
  ],
}
