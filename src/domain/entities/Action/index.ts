import type { CreatePdf } from './CreatePdf'
import type { CreateRecord } from './CreateRecord'
import type { RunJavascriptCode } from './RunJavascriptCode'
import type { SendEmail } from './SendEmail'

export type Action = CreateRecord | SendEmail | RunJavascriptCode | CreatePdf
