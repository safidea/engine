import type { Driver } from '@adapter/spi/FileSystemSpi'
import fs from 'fs-extra'
import { join } from 'path'

export class FileSystemDriver implements Driver {
  getSystemFilePath = (path: string) => {
    return join(process.cwd(), path)
  }

  write = (path: string, data: Buffer) => {
    fs.outputFileSync(path, data)
  }

  read = (path: string) => {
    if (!fs.existsSync(path)) throw new Error('File not found')
    return fs.readFileSync(path)
  }

  remove = (path: string) => {
    if (fs.existsSync(path)) {
      fs.removeSync(path)
    }
  }
}
