import type { CreateRecord } from './database/CreateRecord'
import type { RunJavascript } from './code/RunJavascript'
import type { RunTypescript } from './code/RunTypescript'
import type { SendEmail } from './mailer/SendEmail'
import type { CreateDocxFromTemplate } from './document/CreateDocxFromTemplate'
import type { CreateXlsxFromTemplate } from './spreadsheet/CreateXlsxFromTemplate'
import type { ReadRecord } from './database/ReadRecord'
import type { CreatePdfFromXlsx } from './spreadsheet/CreatePdfFromXlsx'

export type Action =
  | CreateRecord
  | ReadRecord
  | SendEmail
  | RunJavascript
  | RunTypescript
  | CreateDocxFromTemplate
  | CreateXlsxFromTemplate
  | CreatePdfFromXlsx
