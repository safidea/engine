import type { ILoggerMapper } from '@domain/mappers/ILoggerMapper'
import type { ILoggerDriver } from '../drivers/ILoggerDriver'

export class LoggerMapper implements ILoggerMapper {
  constructor(private driver: ILoggerDriver) {}

  log = (message: string) => this.driver.log(message)
}
