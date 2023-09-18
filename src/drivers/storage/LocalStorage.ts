import { join } from 'path'
import fs from 'fs-extra'
import { IStorageDriver } from '@adapters/services/storage/IStorageDriver'
import { StorageDriverOptions } from './index'
import { FileDto } from '@adapters/dtos/FileDto'

export class LocalStorage implements IStorageDriver {
  private folder: string
  private storageUrl: string
  private domain: string

  constructor(readonly options: StorageDriverOptions) {
    this.folder = options.folder ?? process.cwd()
    this.domain = options.domain ?? 'http://localhost:3000'
    this.storageUrl = join(this.folder, 'storage')
    if (!fs.existsSync(this.storageUrl)) {
      fs.ensureDirSync(this.storageUrl)
    }
  }

  getPublicUrl(filePath: string): string {
    return `${this.domain}/api/storage/${filePath}`
  }

  async upload(bucket: string, buffer: Buffer, file: FileDto): Promise<string> {
    const filePath = join(bucket, file.filename)
    await fs.outputFile(join(this.storageUrl, filePath), buffer)
    return this.getPublicUrl(filePath)
  }

  async uploadMany(bucket: string, buffers: Buffer[], files: FileDto[]): Promise<string[]> {
    return Promise.all(files.map((file, index) => this.upload(bucket, buffers[index], file)))
  }

  async read(bucket: string, filename: string): Promise<Buffer | undefined> {
    const path = join(this.storageUrl, bucket, filename)
    if (!fs.existsSync(path)) return
    const data = await fs.readFile(path)
    return data
  }

  async list(bucket: string, filenames?: string[]): Promise<Buffer[]> {
    const buffers = []
    const path = join(this.storageUrl, bucket)
    if (!fs.existsSync(path)) throw new Error(`Bucket "${bucket}" does not exist`)
    if (!filenames) filenames = await fs.readdir(path)
    for (const filename of filenames) {
      const buffer = await this.read(bucket, filename)
      if (buffer) buffers.push(buffer)
    }
    return buffers
  }

  readStaticFile(path: string): string {
    return fs.readFileSync(join(this.folder, path), 'utf-8')
  }
}
