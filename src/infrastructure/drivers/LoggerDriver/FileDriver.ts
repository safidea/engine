import { createLogger, format, transports } from 'winston'
import { BaseDriver } from './base'
import type { FileConfig } from '@domain/services/Logger'

export class FileDriver extends BaseDriver {
  constructor(config: FileConfig) {
    const { level, silent, ...options } = config
    const fileTransports = []
    fileTransports.push(new transports.File(options))
    if (!silent) fileTransports.push(new transports.Console())
    const logger = createLogger({
      level,
      format: format.combine(format.timestamp(), format.json()),
      transports: fileTransports,
    })
    super(logger)
  }
}
