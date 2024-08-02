import type { Drivers } from '@adapter/spi/Drivers'
import { CodeCompilerSpi } from '@adapter/spi/CodeCompilerSpi'
import { CodeCompiler } from '@domain/services/CodeCompiler'
import type { Table } from '@domain/entities/Table'

interface Ressources {
  drivers: Drivers
  tables: Table[]
}

export class CodeCompilerMapper {
  static toService(ressources: Ressources): CodeCompiler {
    const { drivers, tables } = ressources
    const driver = drivers.codeCompiler()
    const spi = new CodeCompilerSpi(driver)
    return new CodeCompiler(spi, { tables })
  }
}
