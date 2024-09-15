import type { Drivers } from '@adapter/spi/Drivers'
import { TemplateCompilerSpi } from '@adapter/spi/TemplateCompilerSpi'
import { TemplateCompiler } from '@domain/services/TemplateCompiler'

export class TemplateCompilerMapper {
  static toService(drivers: Drivers): TemplateCompiler {
    const driver = drivers.templateCompiler()
    const spi = new TemplateCompilerSpi(driver)
    return new TemplateCompiler(spi)
  }
}
