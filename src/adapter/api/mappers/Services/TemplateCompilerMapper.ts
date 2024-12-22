import type { Drivers } from '@adapter/spi/drivers'
import { TemplateCompilerSpi } from '@adapter/spi/drivers/TemplateCompilerSpi'
import { TemplateCompiler } from '@domain/services/TemplateCompiler'

export class TemplateCompilerMapper {
  static toService(drivers: Drivers): TemplateCompiler {
    const driver = drivers.templateCompiler()
    const spi = new TemplateCompilerSpi(driver)
    return new TemplateCompiler(spi)
  }
}
