import { IStorageSpi } from '@domain/spi/IStorageSpi'
import { BaseAction } from './BaseAction'
import { File } from '@domain/entities/storage/File'

export type CreateFileActionInput = 'html'
export type CreateFileActionOutput = 'pdf'

export class CreateFileAction extends BaseAction {
  constructor(
    private _filename: string,
    private _input: CreateFileActionInput,
    private _output: CreateFileActionOutput,
    private _template: string,
    private storage: IStorageSpi
  ) {
    super('create_file')
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

  async execute() {
    await this.storage.write('invoices', new File(this._filename, this._template))
  }
}
