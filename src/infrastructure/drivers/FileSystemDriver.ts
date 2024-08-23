import type { Driver } from '@adapter/spi/FileSystemSpi'
import fs from 'fs-extra'

export class FileSystemDriver implements Driver {
  read = (path: string) => {
    if (!fs.existsSync(path)) throw new Error('File not found')
    return fs.readFileSync(path)
  }
}
