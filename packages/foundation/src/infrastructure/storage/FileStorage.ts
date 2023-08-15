import { join } from 'path'
import fs from 'fs-extra'
import { IStorageSpi } from '@domain/spi/IStorageSpi'
import { File } from '@domain/entities/storage/File'

export class FileStorage implements IStorageSpi {
  private url: string

  constructor(folder: string) {
    this.url = join(folder, 'storage')
    if (fs.existsSync(this.url)) return
    fs.ensureDirSync(this.url)
  }

  async write(bucket: string, file: File): Promise<string> {
    const filePath = join(this.url, bucket, file.filename)
    await fs.outputFile(filePath, file.data)
    return filePath
  }

  async writeMany(bucket: string, files: File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.write(bucket, file)))
  }

  async read(bucket: string, filename: string): Promise<File | undefined> {
    const filePath = join(this.url, bucket, filename)
    if (!fs.existsSync(filePath)) return
    const data = await fs.readFile(filePath)
    return new File(filename, data)
  }

  async list(bucket: string, filenames?: string[]): Promise<File[]> {
    const fileDtos = []
    if (!filenames) filenames = await fs.readdir(join(this.url, bucket))
    for (const filename of filenames) {
      const fileDto = await this.read(bucket, filename)
      if (fileDto) fileDtos.push(fileDto)
    }
    return fileDtos
  }
}
