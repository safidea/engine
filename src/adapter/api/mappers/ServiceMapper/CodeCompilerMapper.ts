import type { Drivers } from '@adapter/spi/Drivers'
import { CodeCompilerSpi } from '@adapter/spi/CodeCompilerSpi'
import { CodeCompiler, type Entities, type Config } from '@domain/services/CodeCompiler'

export class CodeCompilerMapper {
  static toService(drivers: Drivers, entities: Entities, config: Config): CodeCompiler {
    const driver = drivers.codeCompiler(config)
    const spi = new CodeCompilerSpi(driver)
    return new CodeCompiler(spi, entities)
  }
}
