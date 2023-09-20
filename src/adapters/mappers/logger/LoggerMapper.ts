import { ILoggerMapper } from '@entities/services/logger/ILoggerMapper'
import { ILoggerDriver } from './ILoggerDriver'

export class LoggerMapper implements ILoggerMapper {
  constructor(private readonly driver: ILoggerDriver) {}

  log(message: string): void {
    this.driver.log(message)
  }
}
