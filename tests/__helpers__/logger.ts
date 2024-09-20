import { LoggerSpi } from '@adapter/spi/LoggerSpi'
import { Logger } from '@domain/services/Logger'
import { LoggerDriver } from '@infrastructure/drivers/LoggerDriver'

export default class extends Logger {
  constructor() {
    super(
      new LoggerSpi(
        new LoggerDriver({
          level: 'error',
          driver: 'Console',
        })
      )
    )
  }
}
