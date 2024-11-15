import type { IFileSystemDriver } from '@adapter/spi/drivers/FileSystemSpi'
import fs from 'fs-extra'

export class FileSystemDriver implements IFileSystemDriver {
  exists = (path: string) => {
    return fs.existsSync(path)
  }
}
