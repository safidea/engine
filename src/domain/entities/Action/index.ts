import type { CreatePdfFromHtmlTemplate } from './browser/CreatePdfFromHtmlTemplate'
import type { CreateRecord } from './database/CreateRecord'
import type { RunJavascript } from './code/RunJavascript'
import type { SendEmail } from './mailer/SendEmail'

export type Action = CreateRecord | SendEmail | RunJavascript | CreatePdfFromHtmlTemplate
