import { BaseAction } from './BaseAction'

export type CreateFileActionInput = 'html'
export type CreateFileActionOutput = 'pdf'

export class CreateFileAction extends BaseAction {
  constructor(
    private _filename: string,
    private _input: CreateFileActionInput,
    private _output: CreateFileActionOutput,
    private _template: string,
    private storage: any
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

  execute() {
    this.storage.create('invoices', { filename: this._filename, data: this._template })
  }
}
