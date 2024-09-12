import { Test } from '@domain/entities/Test'
import type { Test as TestConfig } from '@adapter/api/configs/Test'
import { EventMapper } from './EventMapper'
import { ExpectMapper } from './ExpectMapper'
import type { Drivers } from '@adapter/spi/Drivers'
import { LoggerMapper } from './ServiceMapper/LoggerMapper'
import { MonitorMapper } from './ServiceMapper/MonitorMapper'

export interface Ressources {
  drivers: Drivers
}

export class TestMapper {
  static toEntity = (config: TestConfig, ressources: Ressources) => {
    const { drivers } = ressources
    const logger = LoggerMapper.toService({ drivers })
    const monitor = MonitorMapper.toService({ drivers }, { driver: 'Console' })
    const when = EventMapper.toManyEntities(config.when, { logger })
    const then = ExpectMapper.toManyEntities(config.then, { logger })
    return new Test(
      config,
      { logger, monitor },
      {
        when,
        then,
      }
    )
  }

  static toManyEntities = (configs: TestConfig[], ressources: Ressources) => {
    return configs.map((config) => this.toEntity(config, ressources))
  }
}
