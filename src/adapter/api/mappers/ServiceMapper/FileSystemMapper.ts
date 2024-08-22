import type { Drivers } from '@adapter/spi/Drivers'
import { FileSystemSpi } from '@adapter/spi/FileSystemSpi'
import { FileSystem } from '@domain/services/FileSystem'
import type { IdGenerator } from '@domain/services/IdGenerator'

interface Ressources {
  drivers: Drivers
  idGenerator: IdGenerator
}

export class FileSystemMapper {
  static toService(ressources: Ressources): FileSystem {
    const { drivers, idGenerator } = ressources
    const driver = drivers.fileSystem()
    const spi = new FileSystemSpi(driver)
    return new FileSystem(spi, { idGenerator })
  }
}
