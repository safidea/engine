import { Base, type BaseConfig, type BaseServices } from '../base'
import type { Context } from '../../Automation/Context'
import type { Template } from '@domain/services/Template'
import type { Browser } from '@domain/services/Browser'
import type { TemplateCompiler } from '@domain/services/TemplateCompiler'
import { CreatedFile } from '@domain/entities/File/Created'
import type { IdGenerator } from '@domain/services/IdGenerator'
import type { Bucket } from '@domain/entities/Bucket'
import type { SpreadsheetLoader } from '@domain/services/SpreadsheetLoader'
import type { FileJson } from '@domain/entities/File/base'

export interface Config extends BaseConfig {
  xlsxBucket: string
  xlsxFileId: string
  pdfFileName: string
  pdfBucket: string
}

export interface Services extends BaseServices {
  browser: Browser
  idGenerator: IdGenerator
  templateCompiler: TemplateCompiler
  spreadsheetLoader: SpreadsheetLoader
}

export interface Entities {
  buckets: Bucket[]
}

type Input = {
  xlsxFileId: string
  pdfFileName: string
}
type Output = FileJson

export class CreatePdfFromXlsx extends Base<Input, Output> {
  private _xlsxBucket: Bucket
  private _xlsxFileId: Template
  private _pdfFileName: Template
  private _pdfBucket: Bucket

  constructor(
    config: Config,
    private _services: Services,
    entities: Entities
  ) {
    super(config, _services)
    const { xlsxBucket, xlsxFileId, pdfFileName, pdfBucket } = config
    const { templateCompiler } = _services
    const { buckets } = entities
    this._xlsxBucket = this._findBucketByName(xlsxBucket, buckets)
    this._xlsxFileId = templateCompiler.compile(xlsxFileId)
    this._pdfFileName = templateCompiler.compile(pdfFileName)
    this._pdfBucket = this._findBucketByName(pdfBucket, buckets)
  }

  protected _prepare = async (context: Context) => {
    return {
      xlsxFileId: context.fillTemplateAsString(this._xlsxFileId),
      pdfFileName: context.fillTemplateAsString(this._pdfFileName),
    }
  }

  protected _process = async (input: Input) => {
    const { browser, idGenerator, spreadsheetLoader } = this._services
    const { xlsxFileId, pdfFileName } = input
    const xlsxFile = await this._xlsxBucket.storage.readByIdOrThrow(xlsxFileId)
    const spreadsheet = await spreadsheetLoader.fromXlsxBuffer(xlsxFile.data)
    const page = await browser.launch()
    const data = await page.createPdfFromHtml(spreadsheet.toHtml())
    await page.close()
    const name = pdfFileName.includes('.pdf') ? pdfFileName : `${pdfFileName}.pdf`
    const pdfFile = new CreatedFile({ name, data }, { idGenerator })
    await this._pdfBucket.storage.save(pdfFile)
    return pdfFile.toJson()
  }
}
