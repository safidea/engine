import type { ApiCalled } from './http/ApiCalled'
import type { PageCreated } from './notion/PageCreated'
import type { RecordCreated } from './database/RecordCreated'
import type { WebhookCalled } from './http/WebhookCalled'

export type Trigger = WebhookCalled | RecordCreated | ApiCalled | PageCreated
