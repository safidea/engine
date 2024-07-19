import { Test } from '@domain/entities/Test'
import type { Test as TestConfig } from '@adapter/api/configs/Test'
import { EventMapper } from './EventMapper'
import { ExpectMapper } from './ExpectMapper'
import type { Drivers } from '@adapter/spi/Drivers'
import { BrowserMapper } from './ServiceMapper/BrowserMapper'
import { LoggerMapper } from './ServiceMapper/LoggerMapper'
import { IdGeneratorMapper } from './ServiceMapper/IdGeneratorMapper'

export interface Services {
  drivers: Drivers
}

export class TestMapper {
  static toEntity = (config: TestConfig, services: Services) => {
    const { drivers } = services
    const idGenerator = IdGeneratorMapper.toService({ drivers })
    const browser = BrowserMapper.toService({ drivers, idGenerator })
    const logger = LoggerMapper.toService({ drivers })
    const when = EventMapper.toManyEntities(config.when, { logger })
    const then = ExpectMapper.toManyEntities(config.then, { logger })
    return new Test({
      ...config,
      when,
      then,
      browser,
      logger,
    })
  }

  static toManyEntities = (configs: TestConfig[], services: Services) => {
    return configs.map((config) => this.toEntity(config, services))
  }
}
