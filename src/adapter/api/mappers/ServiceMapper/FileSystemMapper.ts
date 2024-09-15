import type { Drivers } from '@adapter/spi/Drivers'
import { FileSystemSpi } from '@adapter/spi/FileSystemSpi'
import { FileSystem } from '@domain/services/FileSystem'

export class FileSystemMapper {
  static toService(drivers: Drivers): FileSystem {
    const driver = drivers.fileSystem()
    const spi = new FileSystemSpi(driver)
    return new FileSystem(spi)
  }
}
