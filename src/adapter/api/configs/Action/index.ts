import type { CreateRecord } from './CreateRecord'
import type { RunJavascriptCode } from './RunJavascriptCode'
import type { SendEmail } from './SendEmail'
import type { WebhookResponse } from './WebhookResponse'

export type Action = CreateRecord | SendEmail | RunJavascriptCode | WebhookResponse
