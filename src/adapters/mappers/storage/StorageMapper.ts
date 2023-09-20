import { IStorageDriver } from './IStorageDriver'
import { File } from '@entities/services/storage/file/File'
import { IStorageMapper } from '@entities/services/storage/IStorageMapper'
import { Bucket } from '@entities/app/bucket/Bucket'
import { FileMapper } from '@adapters/mappers/storage/file/FileMapper'
import { BucketList } from '@entities/app/bucket/BucketList'

export class StorageMapper implements IStorageMapper {
  constructor(readonly driver: IStorageDriver) {}

  async configure(buckets: BucketList): Promise<void> {
    await this.driver.configure(buckets.getAllParams())
  }

  async upload(bucket: Bucket, file: File): Promise<string> {
    const fileDto = FileMapper.toDto(file)
    return this.driver.upload(bucket.name, file.buffer, fileDto)
  }

  async uploadMany(bucket: Bucket, files: File[]): Promise<string[]> {
    const buffers = files.map((f) => f.buffer)
    const filesDtos = FileMapper.toManyDtos(files)
    return this.driver.uploadMany(bucket.name, buffers, filesDtos)
  }

  async read(bucket: Bucket, filename: string): Promise<File | undefined> {
    const file = await this.driver.read(bucket.name, filename)
    if (!file) return
    return FileMapper.toFile({ filename }, file.data)
  }

  async list(bucket: Bucket, filenames: string[]): Promise<File[]> {
    const file = await this.driver.list(bucket.name, filenames)
    return FileMapper.toManyFiles(
      file.map((file) => ({ filename: file.filename })),
      file.map((file) => file.data)
    )
  }

  readStaticFile(path: string): string {
    return this.driver.readStaticFile(path)
  }
}
