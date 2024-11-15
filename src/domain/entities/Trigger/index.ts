import type { ApiCalledHttpTrigger } from './http/ApiCalled'
import type { PageCreatedNotionTrigger } from './notion/PageCreated'
import type { RecordCreatedDatabaseTrigger } from './database/RecordCreated'
import type { WebhookCalledHttpTrigger } from './http/WebhookCalled'

export type Trigger =
  | WebhookCalledHttpTrigger
  | RecordCreatedDatabaseTrigger
  | ApiCalledHttpTrigger
  | PageCreatedNotionTrigger
