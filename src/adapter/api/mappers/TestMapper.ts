import { Test } from '@domain/entities/Test'
import type { Test as TestConfig } from '@adapter/api/configs/Test'
import { EventMapper } from './EventMapper'
import { ExpectMapper } from './ExpectMapper'
import type { Drivers } from '@adapter/spi/Drivers'
import { LoggerMapper } from './ServiceMapper/LoggerMapper'
import { MonitorMapper } from './ServiceMapper/MonitorMapper'

export class TestMapper {
  static toEntity = (drivers: Drivers, config: TestConfig) => {
    const logger = LoggerMapper.toService(drivers, { driver: 'Console', level: 'error' })
    const monitor = MonitorMapper.toService(drivers, { driver: 'Console' })
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

  static toManyEntities = (drivers: Drivers, configs: TestConfig[]) => {
    return configs.map((config) => this.toEntity(drivers, config))
  }
}
