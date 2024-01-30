import type { ILoggerMapper } from '../../mappers/ILoggerMapper'

export class Logger {
  constructor(private mapper: ILoggerMapper) {}

  log(message: string) {
    this.mapper.log(message)
  }
}
