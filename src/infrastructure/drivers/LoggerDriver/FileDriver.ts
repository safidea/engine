import { createLogger, format, transports } from 'winston'
import { BaseLoggerDriver } from './base'
import type { LoggerFileConfig } from '@domain/services/Logger'

export class FileDriver extends BaseLoggerDriver {
  constructor(config: LoggerFileConfig) {
    const logger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.File(config)],
    })
    super(logger)
  }
}
