import type { Drivers } from '@adapter/spi/Drivers'
import { JavascriptCompilerSpi } from '@adapter/spi/JavascriptCompilerSpi'
import { JavascriptCompiler } from '@domain/services/JavascriptCompiler'
import type { Table } from '@domain/entities/Table'

interface Ressources {
  drivers: Drivers
  tables: Table[]
}

export class JavascriptCompilerMapper {
  static toService(ressources: Ressources): JavascriptCompiler {
    const { drivers, tables } = ressources
    const driver = drivers.javascriptCompiler()
    const spi = new JavascriptCompilerSpi(driver)
    return new JavascriptCompiler(spi, { tables })
  }
}
