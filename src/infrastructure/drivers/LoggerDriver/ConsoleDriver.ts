import { createLogger, format, transports } from 'winston'
import { BaseDriver } from './base'
import type { ConsoleConfig } from '@domain/services/Logger'

export class ConsoleDriver extends BaseDriver {
  constructor(config: ConsoleConfig) {
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
