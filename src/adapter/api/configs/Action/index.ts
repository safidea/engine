import type { CreateDocxFromTemplate } from './document/CreateDocxFromTemplate'
import type { CreateXlsxFromTemplate } from './spreadsheet/CreateXlsxFromTemplate'
import type { CreateRecord } from './database/CreateRecord'
import type { RunJavascript } from './code/RunJavascript'
import type { CreatePdfFromHtmlTemplate } from './browser/CreatePdfFromHtmlTemplate'
import type { SendEmail } from './mailer/SendEmail'
import type { ReadRecord } from './database/ReadRecord'

export type Action =
  | CreateRecord
  | ReadRecord
  | SendEmail
  | RunJavascript
  | CreateDocxFromTemplate
  | CreateXlsxFromTemplate
  | CreatePdfFromHtmlTemplate
