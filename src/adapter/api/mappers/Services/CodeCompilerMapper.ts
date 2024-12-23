import type { Drivers } from '@adapter/spi/drivers'
import { CodeCompilerSpi } from '@adapter/spi/drivers/CodeCompilerSpi'
import {
  CodeCompiler,
  type CodeCompilerEntities,
  type CodeCompilerConfig,
  type CodeCompilerIntegrations,
  type CodeCompilerServices,
} from '@domain/services/CodeCompiler'

export class CodeCompilerMapper {
  static toService(
    drivers: Drivers,
    services: CodeCompilerServices,
    entities: CodeCompilerEntities,
    integrations: CodeCompilerIntegrations,
    config: CodeCompilerConfig
  ): CodeCompiler {
    const driver = drivers.codeCompiler(config)
    const spi = new CodeCompilerSpi(driver)
    return new CodeCompiler(spi, services, entities, integrations)
  }
}
