import { Base, type BaseConfig } from '../base'
import type { Context } from '../../Automation/Context'
import type { Template } from '@domain/services/Template'
import type { Browser } from '@domain/services/Browser'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import { CreatedFile } from '@domain/entities/File/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Bucket } from '@domain/entities/Bucket'
import type { SpreadsheetLoader } from '@domain/services/SpreadsheetLoader'

export interface Config extends BaseConfig {
  xlsxBucket: string
  xlsxFileId: string
  pdfFileName: string
  pdfBucket: string
}

export interface Services {
  browser: Browser
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  spreadsheetLoader: SpreadsheetLoader
}

export interface Entities {
  buckets: Bucket[]
}

export class CreatePdfFromXlsx extends Base {
  private _xlsxBucket: Bucket
  private _xlsxFileId: Template
  private _pdfFileName: Template
  private _pdfBucket: Bucket

  constructor(
    config: Config,
    private _services: Services,
    entities: Entities
  ) {
    super(config)
    const { xlsxBucket, xlsxFileId, pdfFileName, pdfBucket } = config
    const { templateCompiler } = _services
    const { buckets } = entities
    this._xlsxBucket = this._findBucketByName(xlsxBucket, buckets)
    this._xlsxFileId = templateCompiler.compile(xlsxFileId)
    this._pdfFileName = templateCompiler.compile(pdfFileName)
    this._pdfBucket = this._findBucketByName(pdfBucket, buckets)
  }

  execute = async (context: Context) => {
    const { browser, idGenerator, spreadsheetLoader } = this._services
    const fileId = context.fillTemplateAsString(this._xlsxFileId)
    const xlsxFile = await this._xlsxBucket.storage.readByIdOrThrow(fileId)
    const spreadsheet = await spreadsheetLoader.fromXlsxBuffer(xlsxFile.data)
    const page = await browser.launch()
    const data = await page.createPdfFromHtml(spreadsheet.toHtml())
    await page.close()
    const fileName = context.fillTemplateAsString(this._pdfFileName)
    const name = fileName.includes('.pdf') ? fileName : `${fileName}.pdf`
    const pdfFile = new CreatedFile({ name, data }, { idGenerator })
    await this._pdfBucket.storage.save(pdfFile)
    context.set(this.name, { file: pdfFile.toJson() })
  }
}
