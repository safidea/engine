import type { Drivers } from '@adapter/spi/Drivers'
import { FileSystemSpi } from '@adapter/spi/FileSystemSpi'
import { FileSystem } from '@domain/services/FileSystem'

interface Ressources {
  drivers: Drivers
}

export class FileSystemMapper {
  static toService(ressources: Ressources): FileSystem {
    const { drivers } = ressources
    const driver = drivers.fileSystem()
    const spi = new FileSystemSpi(driver)
    return new FileSystem(spi)
  }
}
