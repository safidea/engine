import type { ICreateDocxFromTemplateDocumentAction } from './document/CreateDocxFromTemplate'
import type { ICreateXlsxFromTemplateSpreadsheetAction } from './spreadsheet/CreateXlsxFromTemplate'
import type { ICreateRecordDatabaseAction } from './database/CreateRecord'
import type { IRunJavascriptCodeAction } from './code/RunJavascript'
import type { IRunTypescriptCodeAction } from './code/RunTypescript'
import type { ISendEmailMailerAction } from './mailer/SendEmail'
import type { IReadRecordDatabaseAction } from './database/ReadRecord'
import type { ICreatePdfFromXlsxSpreadsheetAction } from './spreadsheet/CreatePdfFromXlsx'
import type { IGetCompanyPappersAction } from './pappers/GetCompany'
import type { ICreateClientQontoAction } from './qonto/CreateClient'

export type IAction =
  | IRunJavascriptCodeAction
  | IRunTypescriptCodeAction
  | ICreateDocxFromTemplateDocumentAction
  | ICreateXlsxFromTemplateSpreadsheetAction
  | ICreateRecordDatabaseAction
  | ISendEmailMailerAction
  | IReadRecordDatabaseAction
  | ICreatePdfFromXlsxSpreadsheetAction
  | IGetCompanyPappersAction
  | ICreateClientQontoAction
