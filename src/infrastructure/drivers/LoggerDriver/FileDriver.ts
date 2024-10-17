import { createLogger, format, transports } from 'winston'
import { BaseDriver } from './base'
import type { FileConfig } from '@domain/services/Logger'

export class FileDriver extends BaseDriver {
  constructor(config: FileConfig) {
    const logger = createLogger({
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.File(config)],
    })
    super(logger)
  }
}
