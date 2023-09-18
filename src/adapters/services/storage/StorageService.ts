import { Emit } from '@entities/app/automation/AutomationList'
import { IStorageDriver } from './IStorageDriver'
import { File } from '@entities/services/storage/file/File'
import { IStorageService } from '@entities/services/storage/IStorageService'
import { Bucket } from '@entities/app/bucket/Bucket'
import { FileMapper } from '@adapters/mappers/FileMapper'

export class StorageService implements IStorageService {
  private emit?: Emit

  constructor(readonly driver: IStorageDriver) {}

  async listen(emit: Emit) {
    this.emit = emit
  }

  async upload(bucket: Bucket, file: File): Promise<string> {
    const fileDto = FileMapper.toDto(file)
    const path = this.driver.upload(bucket.name, file.buffer, fileDto)
    //if (this.emit) await this.emit('file_created', { bucket, path })
    return path
  }

  async uploadMany(bucket: Bucket, files: File[]): Promise<string[]> {
    const buffers = files.map((f) => f.buffer)
    const filesDtos = FileMapper.toManyDtos(files)
    const paths = await this.driver.uploadMany(bucket.name, buffers, filesDtos)
    //for (const path of paths) if (this.emit) await this.emit('file_created', { bucket, path })
    return paths
  }

  async read(bucket: Bucket, filename: string): Promise<File | undefined> {
    const buffer = await this.driver.read(bucket.name, filename)
    if (!buffer) return
    return FileMapper.toFile({ filename }, buffer)
  }

  async list(bucket: Bucket, filenames: string[]): Promise<File[]> {
    const buffers = await this.driver.list(bucket.name, filenames)
    return FileMapper.toManyFiles(
      filenames.map((filename) => ({ filename })),
      buffers
    )
  }

  readStaticFile(path: string): string {
    return this.driver.readStaticFile(path)
  }
}
