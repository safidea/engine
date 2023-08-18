import { IStorageSpi } from '@domain/spi/IStorageSpi'
import { BaseAction } from './BaseAction'
import { File } from '@domain/entities/storage/File'
import { IConverterSpi } from '@domain/spi/IConverterSpi'

export type CreateFileActionInput = 'html'
export type CreateFileActionOutput = 'pdf'
export type CreateFileActionTemplate = string | { privatePath: string }

export class CreateFileAction extends BaseAction {
  private _filename: string
  private _template: string

  constructor(
    filename: string,
    private _input: CreateFileActionInput,
    private _output: CreateFileActionOutput,
    template: CreateFileActionTemplate,
    private _bucket: string,
    private storage: IStorageSpi,
    private converter: IConverterSpi
  ) {
    super('create_file')
    this._filename = filename.endsWith(`.${_output}`) ? filename : `${filename}.${_output}`
    if (_input === 'html') {
      if (typeof template === 'object' && 'privatePath' in template) {
        this._template = storage.readStaticPrivateFile(template.privatePath)
      } else {
        this._template = template
      }
    } else {
      throw new Error(`Input "${_input}" not supported`)
    }
  }

  get filename(): string {
    return this._filename
  }

  get input(): CreateFileActionInput {
    return this._input
  }

  get output(): CreateFileActionOutput {
    return this._output
  }

  get template(): string {
    return this._template
  }

  get bucket(): string {
    return this._bucket
  }

  async execute() {
    const pdfData = await this.converter.htmlToPdf(this._template)
    const file = new File(this._filename, pdfData)
    await this.storage.write(this.bucket, file)
  }
}
