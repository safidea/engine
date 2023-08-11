import { ILogSpi } from '@domain/spi/ILogSpi'
import { BaseAction } from './BaseAction'

export class LogAction extends BaseAction {
  constructor(
    private _message: string,
    private log: ILogSpi
  ) {
    super('log')
  }

  get message(): string {
    return this._message
  }

  execute() {
    this.log(this._message)
  }
}
