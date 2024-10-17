import { Test } from '@domain/entities/Test'
import type { Test as TestConfig } from '@adapter/api/configs/Test'
import { EventMapper } from './EventMapper'
import { ExpectMapper } from './ExpectMapper'
import type { Drivers } from '@adapter/spi/Drivers'
import { TemplateCompilerMapper } from './ServiceMapper/TemplateCompilerMapper'

export class TestMapper {
  static toEntity = (drivers: Drivers, config: TestConfig) => {
    const templateCompiler = TemplateCompilerMapper.toService(drivers)
    const when = EventMapper.toManyEntities(config.when)
    const then = ExpectMapper.toManyEntities(config.then, { templateCompiler })
    return new Test(config, {
      when,
      then,
    })
  }

  static toManyEntities = (drivers: Drivers, configs: TestConfig[]) => {
    return configs.map((config) => this.toEntity(drivers, config))
  }
}
