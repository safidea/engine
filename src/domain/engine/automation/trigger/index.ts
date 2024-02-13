import type { RecordCreated, Result as RecordCreatedResult } from './RecordCreated'
import type { WebhookCalled, Result as WebhookCalledResult } from './WebhookCalled'

export type Result = WebhookCalledResult | RecordCreatedResult

export type Trigger = WebhookCalled | RecordCreated
