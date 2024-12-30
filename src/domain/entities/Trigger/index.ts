import type { ApiCalledHttpTrigger } from './http/ApiCalled'
import type { TablePageCreatedNotionTrigger } from './notion/TablePageCreated'
import type { RecordCreatedDatabaseTrigger } from './database/RecordCreated'
import type { WebhookCalledHttpTrigger } from './http/WebhookCalled'

export type Trigger =
  | WebhookCalledHttpTrigger
  | RecordCreatedDatabaseTrigger
  | ApiCalledHttpTrigger
  | TablePageCreatedNotionTrigger
