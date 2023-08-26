import { ILoggerSpi } from '@domain/spi/ILoggerSpi'
import { BaseAction } from './BaseAction'

export class LogAction extends BaseAction {
  constructor(
    name: string,
    private _message: string,
    private logger: ILoggerSpi
  ) {
    super(name, 'log')
  }

  get message(): string {
    return this._message
  }

  execute() {
    this.logger(this._message)
  }
}
