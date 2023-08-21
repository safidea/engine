import { IStorageSpi } from '@domain/spi/IStorageSpi'
import { BaseAction, ContextAction, ContextDataAction } from './BaseAction'
import { File } from '@domain/entities/storage/File'
import { IConverterSpi } from '@domain/spi/IConverterSpi'
import { ITemplatingSpi } from '@domain/spi/ITemplatingSpi'

export type CreateFileActionInput = 'html'
export type CreateFileActionOutput = 'pdf'
export type CreateFileActionTemplate =
  | string
  | { privatePath: string; data: { [key: string]: string } }

export class CreateFileAction extends BaseAction {
  private _filename: string
  private _filenameCompiled: ITemplatingSpi
  private _template: string
  private _templateCompiled: ITemplatingSpi

  constructor(
    filename: string,
    private _input: CreateFileActionInput,
    private _output: CreateFileActionOutput,
    template: CreateFileActionTemplate,
    private _bucket: string,
    private storage: IStorageSpi,
    private converter: IConverterSpi,
    templating: ITemplatingSpi
  ) {
    super('create_file')
    this._filename = filename.endsWith(`.${_output}`) ? filename : `${filename}.${_output}`
    this._filenameCompiled = templating.compile(this._filename)
    if (_input === 'html') {
      if (typeof template === 'object' && 'privatePath' in template) {
        this._template = storage.readStaticPrivateFile(template.privatePath)
      } else {
        this._template = template
      }
      this._templateCompiled = templating.compile(this._template)
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

  async execute(context: ContextAction): Promise<{ create_file: ContextDataAction }> {
    const filename = this._filenameCompiled.render(context)
    const template = this._templateCompiled.render(context)
    const pdfData = await this.converter.htmlToPdf(template)
    const file = new File(filename, pdfData)
    await this.storage.write(this.bucket, file)
    return { create_file: { [this.filename]: file.filename } }
  }
}
