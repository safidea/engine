import { join } from 'path'
import fs from 'fs-extra'
import { StorageDriver } from '@adapters/services/storage/IStorageDriver'
import { File } from '@entities/services/storage/file/File'

export class FileStorage implements StorageDriver {
  private storageUrl: string

  constructor(
    private folder: string,
    private url: string
  ) {
    this.storageUrl = join(folder, 'storage')
    if (!fs.existsSync(this.storageUrl)) {
      fs.ensureDirSync(this.storageUrl)
    }
  }

  getPublicUrl(filePath: string): string {
    return `${this.url}/api/storage/${filePath}`
  }

  async write(bucket: string, file: File): Promise<string> {
    const filePath = join(bucket, file.filename)
    await fs.outputFile(join(this.storageUrl, filePath), file.data)
    return this.getPublicUrl(filePath)
  }

  async writeMany(bucket: string, files: File[]): Promise<string[]> {
    return Promise.all(files.map((file) => this.write(bucket, file)))
  }

  async read(bucket: string, filename: string): Promise<File | undefined> {
    const filePath = join(this.storageUrl, bucket, filename)
    if (!fs.existsSync(filePath)) return
    const data = await fs.readFile(filePath)
    return new File(filename, data, filePath)
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

  readStaticFile(path: string): string {
    return fs.readFileSync(join(this.folder, path), 'utf-8')
  }
}
