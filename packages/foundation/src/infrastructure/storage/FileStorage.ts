import { join } from 'path'
import fs from 'fs-extra'
import { IStorageSpi } from '@domain/spi/IStorageSpi'
import { File } from '@domain/entities/storage/File'

export class FileStorage implements IStorageSpi {
  private storageUrl: string
  private staticPrivateUrl: string

  constructor(folder: string) {
    this.storageUrl = join(folder, 'storage')
    this.staticPrivateUrl = join(folder, 'private')
    if (!fs.existsSync(this.storageUrl)) {
      fs.ensureDirSync(this.storageUrl)
    }
    if (!fs.existsSync(this.staticPrivateUrl)) {
      fs.ensureDirSync(this.staticPrivateUrl)
    }
  }

  async write(bucket: string, file: File): Promise<string> {
    const filePath = join(this.storageUrl, bucket, file.filename)
    await fs.outputFile(filePath, file.data)
    return filePath
  }

  async writeMany(bucket: string, files: File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.write(bucket, file)))
  }

  async read(bucket: string, filename: string): Promise<File | undefined> {
    const filePath = join(this.storageUrl, bucket, filename)
    if (!fs.existsSync(filePath)) return
    const data = await fs.readFile(filePath)
    return new File(filename, data)
  }

  async list(bucket: string, filenames?: string[]): Promise<File[]> {
    const fileDtos = []
    const path = join(this.storageUrl, bucket)
    if (!fs.existsSync(path)) throw new Error(`Bucket "${bucket}" does not exist`)
    if (!filenames) filenames = await fs.readdir(path)
    for (const filename of filenames) {
      const fileDto = await this.read(bucket, filename)
      if (fileDto) fileDtos.push(fileDto)
    }
    return fileDtos
  }

  readStaticPrivateFile(privatePath: string): string {
    return fs.readFileSync(join(this.staticPrivateUrl, privatePath), 'utf-8')
  }
}
