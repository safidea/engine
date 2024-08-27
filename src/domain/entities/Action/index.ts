import type { CreatePdfFromHtmlTemplate } from './browser/CreatePdfFromHtmlTemplate'
import type { CreateRecord } from './database/CreateRecord'
import type { RunJavascript } from './code/RunJavascript'
import type { SendEmail } from './mailer/SendEmail'
import type { CreateDocxFromTemplate } from './document/CreateDocxFromTemplate'
import type { CreateXlsxFromTemplate } from './spreadsheet/CreateXlsxFromTemplate'
import type { ReadRecord } from './database/ReadRecord'

export type Action =
  | CreateRecord
  | ReadRecord
  | SendEmail
  | RunJavascript
  | CreatePdfFromHtmlTemplate
  | CreateDocxFromTemplate
  | CreateXlsxFromTemplate
