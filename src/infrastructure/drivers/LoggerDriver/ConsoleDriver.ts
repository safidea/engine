import { createLogger, format, transports } from 'winston'
import { BaseLoggerDriver } from './base'
import type { LoggerConsoleConfig } from '@domain/services/Logger'

export class ConsoleDriver extends BaseLoggerDriver {
  constructor(config: LoggerConsoleConfig) {
    const logger = createLogger({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...res }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(res).length ? JSON.stringify(res, null, 2) : ''}`
        })
      ),
      transports: [new transports.Console(config)],
    })
    super(logger)
  }
}
