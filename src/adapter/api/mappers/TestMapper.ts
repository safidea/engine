import { Test } from '@domain/entities/Test'
import type { ITest } from '@adapter/api/configs/Test'
import { EventMapper } from './Event'
import { ExpectMapper } from './Expect'
import type { Drivers } from '@adapter/spi/drivers'
import { TemplateCompilerMapper } from './Services/TemplateCompilerMapper'

export class TestMapper {
  static toEntity = (drivers: Drivers, config: ITest) => {
    const templateCompiler = TemplateCompilerMapper.toService(drivers)
    const when = EventMapper.toManyEntities(config.when)
    const then = ExpectMapper.toManyEntities(config.then, { templateCompiler })
    return new Test(config, {
      when,
      then,
    })
  }

  static toManyEntities = (drivers: Drivers, configs: ITest[]) => {
    return configs.map((config) => this.toEntity(drivers, config))
  }
}
