import type { Drivers } from '@adapter/spi/Drivers'
import { JavascriptCompilerSpi } from '@adapter/spi/JavascriptCompilerSpi'
import { JavascriptCompiler, type Entities } from '@domain/services/JavascriptCompiler'

export class JavascriptCompilerMapper {
  static toService(drivers: Drivers, entities: Entities): JavascriptCompiler {
    const driver = drivers.javascriptCompiler()
    const spi = new JavascriptCompilerSpi(driver)
    return new JavascriptCompiler(spi, entities)
  }
}
