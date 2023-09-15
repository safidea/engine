import { Emit } from '@entities/app/automation/AutomationList'
import { IStorageDriver } from './IStorageDriver'
import { File } from '@entities/services/storage/file/File'
import { IStorageService } from '@entities/services/storage/IStorageService'

export class StorageService implements IStorageService {
  private emit?: Emit

  constructor(readonly driver: IStorageDriver) {}

  async listen(emit: Emit) {
    this.emit = emit
  }

  async upload(bucket: string, file: File): Promise<string> {
    const path = this.driver.upload(bucket, file.buffer, file.params())
    //if (this.emit) await this.emit('file_created', { bucket, path })
    return path
  }

  async uploadMany(bucket: string, files: File[]): Promise<string[]> {
    const paths = await this.driver.uploadMany(
      bucket,
      files.map((file) => ({ data: file.buffer, params: file.params() }))
    )
    //for (const path of paths) if (this.emit) await this.emit('file_created', { bucket, path })
    return paths
  }

  async read(bucket: string, filename: string): Promise<File | undefined> {
    return this.driver.read(bucket, filename)
  }

  async list(bucket: string, filenames?: string[]): Promise<File[]> {
    return this.driver.list(bucket, filenames)
  }

  readStaticFile(path: string): string {
    return this.driver.readStaticFile(path)
  }
}
