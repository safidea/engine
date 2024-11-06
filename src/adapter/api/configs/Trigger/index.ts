import type { ApiCalled } from './http/ApiCalled'
import type { RecordCreated } from './database/RecordCreated'
import type { WebhookCalled } from './http/WebhookCalled'
import type { PageCreated } from './notion/PageCreated'

export type Trigger = ApiCalled | RecordCreated | WebhookCalled | PageCreated
