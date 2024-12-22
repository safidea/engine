import type { Drivers } from '@adapter/spi/drivers'
import { FileSystemSpi } from '@adapter/spi/drivers/FileSystemSpi'
import { FileSystem } from '@domain/services/FileSystem'

export class FileSystemMapper {
  static toService(drivers: Drivers): FileSystem {
    const driver = drivers.fileSystem()
    const spi = new FileSystemSpi(driver)
    return new FileSystem(spi)
  }
}
