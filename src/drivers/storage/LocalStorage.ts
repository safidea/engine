import { join } from 'path'
import fs from 'fs-extra'
import { IStorageDriver } from '@adapters/services/storage/IStorageDriver'
import { File } from '@entities/services/storage/file/File'
import { StorageDriverOptions } from './index'
import { FileParams } from '@entities/services/storage/file/FileParams'

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

  async upload(bucket: string, buffer: Buffer, params: FileParams): Promise<string> {
    const filePath = join(bucket, params.filename)
    await fs.outputFile(join(this.storageUrl, filePath), buffer)
    return this.getPublicUrl(filePath)
  }

  async uploadMany(
    bucket: string,
    files: { data: Buffer; params: FileParams }[]
  ): Promise<string[]> {
    return Promise.all(files.map(({ data, params }) => this.upload(bucket, data, params)))
  }

  async read(bucket: string, filename: string): Promise<File | undefined> {
    const path = join(this.storageUrl, bucket, filename)
    if (!fs.existsSync(path)) return
    const data = await fs.readFile(path)
    return new File(data, { filename, path })
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
