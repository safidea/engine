import type { IApiCalledHttpTrigger } from './http/ApiCalled'
import type { IRecordCreatedDatabaseTrigger } from './database/RecordCreated'
import type { IWebhookCalledHttpTrigger } from './http/WebhookCalled'
import type { IPageCreatedNotionTrigger } from './notion/PageCreated'

export type ITrigger =
  | IApiCalledHttpTrigger
  | IRecordCreatedDatabaseTrigger
  | IWebhookCalledHttpTrigger
  | IPageCreatedNotionTrigger
