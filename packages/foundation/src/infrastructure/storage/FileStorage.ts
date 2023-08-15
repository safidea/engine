import { IStorageAdapter } from '@adapter/spi/storage/IStorageAdapter'
import { join } from 'path'
import fs from 'fs-extra'
import { FileDto } from '@adapter/spi/storage/dtos/FileDto'

export class FileStorage implements IStorageAdapter {
  private url: string

  constructor(folder: string) {
    this.url = join(folder, 'storage')
    if (fs.existsSync(this.url)) return
    fs.ensureDirSync(this.url)
  }

  public bucketExists(bucket: string): boolean {
    return fs.existsSync(join(this.url, bucket))
  }

  async write(bucket: string, file: FileDto): Promise<string> {
    const filePath = join(this.url, bucket, file.filename)
    await fs.outputFile(filePath, file.data)
    return filePath
  }

  async writeMany(bucket: string, files: FileDto[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.write(bucket, file)))
  }

  async read(bucket: string, filename: string): Promise<FileDto | undefined> {
    const filePath = join(this.url, bucket, filename)
    if (!fs.existsSync(filePath)) return
    const data = await fs.readFile(filePath)
    return { filename, data }
  }

  async list(bucket: string, filenames?: string[]): Promise<FileDto[]> {
    const fileDtos = []
    if (!filenames) filenames = await fs.readdir(join(this.url, bucket))
    for (const filename of filenames) {
      const fileDto = await this.read(bucket, filename)
      if (fileDto) fileDtos.push(fileDto)
    }
    return fileDtos
  }
}
