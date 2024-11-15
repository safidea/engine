import type { Drivers } from '@adapter/spi/drivers'
import { CodeCompilerSpi } from '@adapter/spi/drivers/CodeCompilerSpi'
import {
  CodeCompiler,
  type CodeCompilerEntities,
  type CodeCompilerConfig,
} from '@domain/services/CodeCompiler'

export class CodeCompilerMapper {
  static toService(
    drivers: Drivers,
    entities: CodeCompilerEntities,
    config: CodeCompilerConfig
  ): CodeCompiler {
    const driver = drivers.codeCompiler(config)
    const spi = new CodeCompilerSpi(driver)
    return new CodeCompiler(spi, entities)
  }
}
