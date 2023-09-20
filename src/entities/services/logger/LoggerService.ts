import { ILoggerMapper } from '@entities/services/logger/ILoggerMapper'

export class LoggerService {
  constructor(private readonly mapper: ILoggerMapper) {}

  log(message: string): void {
    this.mapper.log(message)
  }
}
