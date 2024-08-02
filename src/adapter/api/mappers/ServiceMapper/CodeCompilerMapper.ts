import type { Drivers } from '@adapter/spi/Drivers'
import { CodeCompilerSpi } from '@adapter/spi/CodeCompilerSpi'
import { CodeCompiler } from '@domain/services/CodeCompiler'

interface Ressources {
  drivers: Drivers
}

export class CodeCompilerMapper {
  static toService(ressources: Ressources): CodeCompiler {
    const { drivers } = ressources
    const driver = drivers.codeCompiler()
    const spi = new CodeCompilerSpi(driver)
    return new CodeCompiler(spi)
  }
}
