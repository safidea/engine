import { LoggerDriver } from './LoggerDriver'

export class Logger {
  constructor(private readonly driver: LoggerDriver) {}

  log(message: string): void {
    this.driver.log(message)
  }
}
