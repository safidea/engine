import { createLogger, format, transports } from 'winston'
import { BaseDriver } from './base'
import type { FileConfig } from '@domain/services/Logger'

export class FileDriver extends BaseDriver {
  constructor(config: FileConfig) {
    const { level, silent, ...options } = config
    const logger = createLogger({
      level,
      silent,
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.Console(), new transports.File(options)],
    })
    super(logger)
  }
}
