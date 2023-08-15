import { IStorageSpi } from '@domain/spi/IStorageSpi'
import { BaseAction } from './BaseAction'
import { File } from '@domain/entities/storage/File'

export type CreateFileActionInput = 'html'
export type CreateFileActionOutput = 'pdf'

export class CreateFileAction extends BaseAction {
  private _filename: string

  constructor(
    filename: string,
    private _input: CreateFileActionInput,
    private _output: CreateFileActionOutput,
    private _template: string,
    private _bucket: string,
    private storage: IStorageSpi,
    private converter: any
  ) {
    super('create_file')
    this._filename = filename.endsWith(`.${_output}`) ? filename : `${filename}.${_output}`
    if (_input === 'html') {
      this._template = `<html><body>${_template}</body></html>`
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
    const pdfData = await this.converter.htmlToPdf(this._template, this._filename)
    const file = new File(this._filename, pdfData)
    await this.storage.write(this.bucket, file)
  }
}
