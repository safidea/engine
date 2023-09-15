import { ILoggerService } from '@entities/services/logger/ILoggerService'
import { ILoggerDriver } from './ILoggerDriver'

export class LoggerService implements ILoggerService {
  constructor(private readonly driver: ILoggerDriver) {}

  log(message: string): void {
    this.driver.log(message)
  }
}
