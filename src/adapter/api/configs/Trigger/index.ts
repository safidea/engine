import type { ApiCalled } from './ApiCalled'
import type { RecordCreated } from './RecordCreated'
import type { WebhookCalled } from './WebhookCalled'

export type Trigger = RecordCreated | WebhookCalled | ApiCalled
