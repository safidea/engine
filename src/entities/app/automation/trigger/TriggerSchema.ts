import { JSONSchemaType } from 'ajv'
import { TriggerOptions } from './TriggerOptions'
import { RecordCreatedTriggerSchema } from './database/recordCreated/RecordCreatedTriggerSchema'
import { RecordUpdatedTriggerSchema } from './database/recordUpdated/RecordUpdatedTriggerSchema'
import { ServerStartedTriggerSchema } from './server/serverStarted/ServerStartedTriggerSchema'
import { ServerStoppedTriggerSchema } from './server/serverStopped/ServerStoppedTriggerSchema'

export const TriggerSchema: JSONSchemaType<TriggerOptions> = {
  oneOf: [
    ServerStartedTriggerSchema,
    ServerStoppedTriggerSchema,
    RecordCreatedTriggerSchema,
    RecordUpdatedTriggerSchema,
  ],
}
