import type { CreateRecordDatabaseAction } from './database/CreateRecord'
import type { RunJavascriptCodeAction } from './code/RunJavascript'
import type { RunTypescriptCodeAction } from './code/RunTypescript'
import type { SendEmailMailerAction } from './mailer/SendEmail'
import type { CreateDocxFromTemplateDocumentAction } from './document/CreateDocxFromTemplate'
import type { CreateXlsxFromTemplateSpreadsheetAction } from './spreadsheet/CreateXlsxFromTemplate'
import type { ReadRecordDatabaseAction } from './database/ReadRecord'
import type { CreatePdfFromXlsxSpreadsheetAction } from './spreadsheet/CreatePdfFromXlsx'
import type { GetCompanyPappersAction } from './pappers/GetCompany'

export type Action =
  | CreateRecordDatabaseAction
  | ReadRecordDatabaseAction
  | SendEmailMailerAction
  | RunJavascriptCodeAction
  | RunTypescriptCodeAction
  | CreateDocxFromTemplateDocumentAction
  | CreateXlsxFromTemplateSpreadsheetAction
  | CreatePdfFromXlsxSpreadsheetAction
  | GetCompanyPappersAction
